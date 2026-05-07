def detect_attack(payload):
    payload_lower = payload.lower()
    if "sleep" in payload_lower:
        return "Time-based SQLi"
    elif " or " in payload_lower or " and " in payload_lower:
        return "Boolean SQLi"
    elif "'" in payload_lower or "--" in payload_lower:
        return "Basic SQLi"
    else:
        return "Normal"
