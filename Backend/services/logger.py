import sqlite3
from datetime import datetime

def log_event(input_data, query, response, attack_type,ip_address):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO logs (input_data, query, response, attack_type, timestamp, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        str(input_data),
        query,
        response,
        attack_type,
        datetime.now(),
        ip_address
))
    conn.commit()
    conn.close()