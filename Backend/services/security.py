def detect_attack(username, password):
    if "'" in username or "--" in username:
        return "SQL Injection"
    return "Normal"