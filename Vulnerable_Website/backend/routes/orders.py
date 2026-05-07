from flask import Blueprint, request, jsonify
from db import get_db_connection

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():

    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 🚨 VULNERABLE (BROKEN ACCESS CONTROL)
    query = f"""
SELECT 
    orders.id,
    orders.user_id,
    products.name AS product_name,
    orders.quantity,
    orders.total_price,
    orders.created_at
FROM orders
JOIN products ON orders.product_id = products.id
WHERE orders.user_id = {user_id}
"""

    print("Executing:", query)

    cursor.execute(query)
    orders = cursor.fetchall()

    return jsonify(orders)