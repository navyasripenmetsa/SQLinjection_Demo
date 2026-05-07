from flask import Blueprint, request, jsonify
from db import get_db_connection

review_bp = Blueprint('review', __name__)

# ✅ ADD REVIEW (SAFE)
@review_bp.route('/review', methods=['POST'])
def add_review():
    data = request.json

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    comment = data.get("comment")

    conn = get_db_connection()
    cursor = conn.cursor()

    # ✅ SAFE (parameterized query)
    cursor.execute(
        "INSERT INTO reviews (user_id, product_id, comment) VALUES (%s, %s, %s)",
        (user_id, product_id, comment)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Review added"})


# ✅ GET REVIEWS (SAFE)
@review_bp.route('/reviews', methods=['GET'])
def get_reviews():
    product_id = request.args.get("product_id")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # ✅ SAFE JOIN query
    cursor.execute("""
        SELECT reviews.id, reviews.comment, users.username
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.product_id = %s
    """, (product_id,))

    data = cursor.fetchall()

    conn.close()

    return jsonify(data)