from db import get_db_connection
def log_attack(ip, endpoint, payload, attack_type, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    INSERT INTO attack_logs (ip_address, endpoint, payload, attack_type, status)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (ip, endpoint, payload, attack_type, status))
    conn.commit()
    cursor.close()
    conn.close()