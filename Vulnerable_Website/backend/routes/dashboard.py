from flask import Blueprint, jsonify
from db import get_db_connection
dashboard_bp = Blueprint('dashboard', __name__)
#Get attack count by type
@dashboard_bp.route('/dashboard/summary', methods=['GET'])
def attack_summary():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT attack_type, COUNT(*) as count
    FROM attack_logs
    GROUP BY attack_type
    """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)


# Get recent attacks
@dashboard_bp.route('/dashboard/logs', methods=['GET'])
def recent_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT timestamp, ip_address, endpoint, attack_type, payload, status
    FROM attack_logs
    ORDER BY timestamp DESC
    LIMIT 10
    """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)