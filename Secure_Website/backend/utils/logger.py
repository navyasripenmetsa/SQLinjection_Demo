from db import get_db_connection


def log_attack(ip_address, endpoint, payload, attack_type, status, user_id=None):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO attack_logs (ip_address, user_id, endpoint, attack_type, payload, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (ip_address, user_id, endpoint, attack_type, payload, status),
        )
        conn.commit()
    except Exception:
        # Logging should never break the main request path.
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
