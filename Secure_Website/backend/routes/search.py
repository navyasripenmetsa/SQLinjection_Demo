from flask import Blueprint, request, jsonify
from db import get_db_connection
from utils.detector import detect_attack, is_suspicious
from utils.logger import log_attack

search_bp = Blueprint("search", __name__)


@search_bp.route("/search", methods=["GET"])
def search_products():
    query_param = (request.args.get("query") or "").strip()
    ip = request.remote_addr

    if not query_param:
        return jsonify([])

    if len(query_param) > 50:
        log_attack(ip, "/search", query_param, "Input Validation", "Blocked")
        return jsonify({"error": "Search query too long"}), 400

    if is_suspicious(query_param):
        log_attack(ip, "/search", query_param, detect_attack(query_param), "Blocked")
        return jsonify({"error": "Suspicious search blocked"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        like_value = f"%{query_param}%"
        # SECURE: parameterized LIKE query. MAX_EXECUTION_TIME helps align with time-based defense.
        cursor.execute(
            "SELECT /*+ MAX_EXECUTION_TIME(1000) */ id, name, description, price, category FROM products WHERE name LIKE %s",
            (like_value,),
        )
        results = cursor.fetchall()
        return jsonify(results)
    finally:
        cursor.close()
        conn.close()
