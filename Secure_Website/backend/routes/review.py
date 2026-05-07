from flask import Blueprint, request, jsonify, g
from db import get_db_connection
from utils.security import require_auth

review_bp = Blueprint("review", __name__)


@review_bp.route("/review", methods=["POST"])
@require_auth
def add_review():
    data = request.get_json(silent=True) or {}
    product_id = data.get("product_id")
    comment = (data.get("comment") or "").strip()
    user_id = g.current_user["user_id"]

    if not product_id or not comment:
        return jsonify({"error": "Product and comment are required"}), 400

    if len(comment) > 500:
        return jsonify({"error": "Review too long"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # SECURE: store user-controlled content only as data.
        cursor.execute(
            "INSERT INTO reviews (user_id, product_id, comment) VALUES (%s, %s, %s)",
            (user_id, product_id, comment),
        )
        conn.commit()
        return jsonify({"message": "Review added successfully"}), 201
    finally:
        cursor.close()
        conn.close()


@review_bp.route("/reviews", methods=["GET"])
def get_reviews():
    product_id = request.args.get("product_id")
    if not product_id:
        return jsonify([])

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # SECURE: safe retrieval blocks second-order SQL injection by avoiding dynamic SQL reuse.
        cursor.execute(
            """
            SELECT reviews.id, reviews.comment, users.username, reviews.created_at
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.product_id = %s
            ORDER BY reviews.created_at DESC
            """,
            (product_id,),
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()
