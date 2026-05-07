from flask import Blueprint, request, jsonify
from db import get_db_connection

profile_bp = Blueprint('profile', __name__)

# ✅ GET PROFILE DETAILS
@profile_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    conn.close()

    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404


# ✅ UPDATE USERNAME (SAFE - important for second-order SQLi)
@profile_bp.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    user_id = data.get("user_id")
    username = data.get("username")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET username = %s WHERE id = %s",
        (username, user_id)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Profile updated successfully"})