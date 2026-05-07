from flask import Blueprint, jsonify
from db import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/reviews', methods=['GET'])
def process_reviews():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    logs = []

    # ✅ STEP 1: Get ALL users
    cursor.execute("SELECT id, username FROM users")
    users = cursor.fetchall()

    for user in users:
        user_id = user["id"]
        username = user["username"]

        logs.append(f"Checking user: {username}")

        # ✅ STEP 2: Check if user has reviews
        cursor.execute(
            "SELECT COUNT(*) as cnt FROM reviews WHERE user_id = %s",
            (user_id,)
        )
        review_count = cursor.fetchone()["cnt"]

        # ❌ If no reviews → log and skip
        if review_count == 0:
            logs.append(f"❌ No reviews given by user: {username}")
            continue

        logs.append(f"Processing {review_count} reviews for user: {username}")

        # 🚨 VULNERABLE QUERY (for SQLi demo)
        dangerous_query = f"""
        UPDATE users 
        SET last_processed = NOW(), username = '{username}'
        WHERE id = {user_id}
        """

        logs.append(f"Executing query: {dangerous_query}")

        cursor.execute(dangerous_query)
        conn.commit()

        logs.append(f"✅ Processed reviews for user: {username}")

    return jsonify({
        "message": "Review processing completed successfully",
        "logs": logs
    })