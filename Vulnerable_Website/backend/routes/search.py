from flask import Blueprint, request, jsonify
from db import get_db_connection
from utils.logger import log_attack
from utils.detector import detect_attack
search_bp = Blueprint('search', __name__)
@search_bp.route('/search', methods=['GET'])
def search():
    query_param = request.args.get('query')
    ip = request.remote_addr
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    #vulnerable query
    query = f"SELECT * FROM products WHERE name LIKE '%{query_param}%'"
    print("Executing:", query)
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        #detect attack
        attack_type = detect_attack(query_param)
        #log attack
        log_attack(ip, "/search", query_param, attack_type, "Success")
        return jsonify(results)
    except Exception as e:
        log_attack(ip, "/search", query_param, "Error", str(e))
        return jsonify({"error": str(e)}), 500