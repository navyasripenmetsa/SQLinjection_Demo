from flask import Blueprint, jsonify
from db import get_db_connection
from utils.security import require_admin

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard/summary", methods=["GET"])
@require_admin
def attack_summary():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT attack_type, COUNT(*) AS count
            FROM attack_logs
            GROUP BY attack_type
            ORDER BY count DESC
            """
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()


@dashboard_bp.route("/dashboard/logs", methods=["GET"])
@require_admin
def recent_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT timestamp, ip_address, user_id, endpoint, attack_type, payload, status
            FROM attack_logs
            ORDER BY timestamp DESC
            LIMIT 20
            """
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()
