from flask import Blueprint, jsonify
from db import get_db_connection
from utils.security import require_admin

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/reviews", methods=["GET"])
@require_admin
def process_reviews():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT reviews.id, reviews.comment, reviews.created_at, users.id AS user_id, users.username, users.last_processed
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            ORDER BY reviews.created_at DESC
            """
        )
        reviews = cursor.fetchall()

        logs = []
        for review in reviews:
            logs.append(
                f"Safely reviewed comment {review['id']} for user {review['username']} without dynamic SQL execution"
            )

        return jsonify(
            {
                "message": "Reviews processed safely",
                "logs": logs,
                "reviews": reviews,
            }
        )
    finally:
        cursor.close()
        conn.close()
