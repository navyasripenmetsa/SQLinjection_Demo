import re

SUSPICIOUS_PATTERNS = [
    (r"(?i)(?:'|\"|%27)\s*(?:or|and)\s*\d+\s*=\s*\d+", "Boolean SQLi"),
    (r"(?i)\bunion\b\s+\bselect\b", "Union SQLi"),
    (r"(?i)\bsleep\s*\(", "Time-based SQLi"),
    (r"(?i)\bbenchmark\s*\(", "Time-based SQLi"),
    (r"(?i)--", "SQL Comment Injection"),
    (r"(?i)/\*|\*/", "SQL Comment Injection"),
    (r"(?i)\bselect\b.+\bfrom\b", "SQL Keyword Abuse"),
    (r"(?i);", "Statement Chaining"),
]


def detect_attack(payload: str) -> str:
    if not payload:
        return "Normal"

    for pattern, attack_type in SUSPICIOUS_PATTERNS:
        if re.search(pattern, payload):
            return attack_type
    return "Normal"


def is_suspicious(payload: str) -> bool:
    return detect_attack(payload) != "Normal"
