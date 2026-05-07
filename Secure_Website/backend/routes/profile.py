from flask import Blueprint, request, jsonify, g
from db import get_db_connection
from utils.security import require_auth

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile/<int:user_id>", methods=["GET"])
@require_auth
def get_profile(user_id):
    if g.current_user["user_id"] != user_id and g.current_user.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, username, email, role, last_processed FROM users WHERE id = %s",
            (user_id,),
        )
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user)
    finally:
        cursor.close()
        conn.close()


@profile_bp.route("/update-profile", methods=["POST"])
@require_auth
def update_profile():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()

    if g.current_user["user_id"] != user_id and g.current_user.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    if not username:
        return jsonify({"error": "Username is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # SECURE: only allowed fields are updated. Role is intentionally excluded to stop privilege escalation.
        cursor.execute(
            "UPDATE users SET username = %s, email = %s, last_processed = NOW() WHERE id = %s",
            (username, email, user_id),
        )
        conn.commit()
        return jsonify({"message": "Profile updated successfully"})
    finally:
        cursor.close()
        conn.close()
