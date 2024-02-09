
$(function () {
    $('.nav-tabs a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    // show a customer detail
    function showCustomer(msisdn){
        $.get("/customer/" + encodeURIComponent(msisdn), 
            function (data) {
                if (!data) return;
            }, "json" 
        );
    }

    // load a movie and show it 
    function showMovie(title) {
        $.get("/movie/" + encodeURIComponent(title),
                function (data) {
                    if (!data) return;
                    $("#title").text(data.title);
                    $("#poster").attr("src","https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/"+encodeURIComponent(data.title)+".jpg");
                    const $list = $("#details").empty();
                    data.cast.forEach(function (cast) {
                        $list.append($("<li>" + cast.name + " " +cast.job + (cast.job == "acted"?" as " + cast.role : "") + "</li>"));
                    });
                    $("#vote")
                        .unbind("click")
                        .click(function () {
                            voteInMovie(data.title)
                        })
                }, "json");
        return false;
    }
    function search(showFirst = true) {
        const query=$("#search").find("input[name=search]").val();
        $.get("/search?q=" + encodeURIComponent(query),
                function (data) {
                    const t = $("table#results tbody").empty();
                    if (!data || data.length == 0) return;
                    data.forEach(function (movie, index) {
                        $("<tr><td class='movie'>" + movie.title
                            + "</td><td>" + movie.released
                            + "</td><td>" + movie.tagline
                            + "</td><td id='votes" + index + "'>" + (movie.votes || 0)
                            + "</td></tr>").appendTo(t)
                                .click(function() { showMovie($(this).find("td.movie").text());})
                    });
                    if (showFirst) {
                        showMovie(data[0].title);
                    }
                }, "json");
        return false;
    }

    function voteInMovie(title) {
        $.post("/movie/" + encodeURIComponent(title) + "/vote", () => {
            search(false);
            showMovie(title);
        });
    }

    $("#search").submit(search);
    search();
})
const width = 400, height = 400;

// const force = d3.layout.force()
//         .charge(-200).linkDistance(30).size([width, height]);

// const svg = d3.select("#graph").append("svg")
//         .attr("width", "100%").attr("height", "100%")
//         .attr("pointer-events", "all");

// d3.json("/graph", 
//     function(error, graph) {
//         if (error) return;

//         force.nodes(graph.nodes).links(graph.links).start();

//         const link = svg.selectAll(".link")
//                 .data(graph.links).enter()
//                 .append("line").attr("class", "link");

//         const node = svg.selectAll(".node")
//                 .data(graph.nodes).enter()
//                 .append(function (d) { return d3.image("https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/"+encodeURIComponent(d.label)+".jpg"); })
//                 .attr("class", function (d) { return "node "+d.label })
//                 .attr("r", 10)
//                 .call(force.drag);

//         // html title attribute
//         node.append("title")
//                 .text(function (d) { return d.title; })

//         // force feed algo ticks
//         force.on("tick", function() {
//             link.attr("x1", function(d) { return d.source.x; })
//                     .attr("y1", function(d) { return d.source.y; })
//                     .attr("x2", function(d) { return d.target.x; })
//                     .attr("y2", function(d) { return d.target.y; });

//             node.attr("cx", function(d) { return d.x; })
//                     .attr("cy", function(d) { return d.y; });
//         });
//     }
// );

const customers = [
    { id: 1, name: "Adamu" },
    { id: 2, name: "Mercy" },
    { id: 3, name: "Kaleab" },
    { id: 4, name: "Michael" },
    { id: 5, name: "Magi" }
    // Add more customers as needed
  ];

  const links = [
    { source: 1, target: 2, label: "Called" },
    { source: 1, target: 3, label: "Gifted" },
    { source: 1, target: 4, label: "Called" },
    { source: 1, target: 5, label: "Called" }
    // Add more links as needed
  ];


  const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

  const node = svg.selectAll(".node")
    .data(customers)
    .enter().append("circle")
    .attr("class", d => (d.id === 1) ? "center-node" : "node")
    .attr("r", 20)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  const label = svg.selectAll(".label")
    .data(links)
    .enter().append("text")
    .attr("class", "label")
    .attr("dy", -5)
    .attr("text-anchor", "middle")
    .text(d => d.label);

  const nodeLabel = svg.selectAll(".node-label")
    .data(customers)
    .enter().append("text")
    .attr("class", "label")
    .attr("dy", 15)
    .attr("text-anchor", "middle")
    .text(d => d.name);

  simulation
    .nodes(customers)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2);

    nodeLabel
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
