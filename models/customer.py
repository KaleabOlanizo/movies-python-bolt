class Customer:
    def __init__(self, base) -> None:
        self.cutomer_id = base["cutomer_id"]
        self.name = base["name"]
        self.gender = base["gender"]
        self.nationality = base["nationality"]
        self.city = base["city"]
        self.wereda = base["wereda"]
        self.zone = base["zone"]
        self.dob = base["dob"]
        self.langauge  = base["langauge"]
        self.total_recharge = base["total_recharge"]
        self.current_balance = base["current_balance"]
        self.charging_pattern  = base["charging_pattern"]
        self.activation_type  = base["activation_type"]
        self.service_type = base["service_type"]
        self.age_on_net = base["age_on_net"]
        self.msisdn = base["msisdn"]
    
    def get_churn_probability() -> float:
        pass