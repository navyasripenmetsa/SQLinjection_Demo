from flask import Blueprint, request, jsonify, g
from db import get_db_connection
from utils.security import require_auth

order_bp = Blueprint("order", __name__)


@order_bp.route("/order", methods=["GET"])
@require_auth
def get_order():
    order_id = request.args.get("id", type=int)
    if not order_id:
        return jsonify({"error": "Order id is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT orders.id, orders.user_id, orders.product_id, orders.quantity, orders.total_price,
                   orders.created_at, products.name AS product_name
            FROM orders
            JOIN products ON orders.product_id = products.id
            WHERE orders.id = %s
            """,
            (order_id,),
        )
        order = cursor.fetchone()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        if order["user_id"] != g.current_user["user_id"] and g.current_user.get("role") != "admin":
            return jsonify({"error": "Forbidden"}), 403

        return jsonify(order)
    finally:
        cursor.close()
        conn.close()


@order_bp.route("/orders", methods=["GET"])
@require_auth
def list_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if g.current_user.get("role") == "admin":
            cursor.execute(
                """
                SELECT orders.id, orders.user_id, orders.product_id, orders.quantity, orders.total_price,
                       orders.created_at, products.name AS product_name
                FROM orders
                JOIN products ON orders.product_id = products.id
                ORDER BY orders.created_at DESC
                """
            )
        else:
            cursor.execute(
                """
                SELECT orders.id, orders.user_id, orders.product_id, orders.quantity, orders.total_price,
                       orders.created_at, products.name AS product_name
                FROM orders
                JOIN products ON orders.product_id = products.id
                WHERE orders.user_id = %s
                ORDER BY orders.created_at DESC
                """,
                (g.current_user["user_id"],),
            )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()
