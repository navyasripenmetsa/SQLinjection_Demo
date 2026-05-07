from flask import Blueprint, request, jsonify
from db import get_db_connection
from utils.detector import detect_attack, is_suspicious
from utils.logger import log_attack
from utils.security import hash_password, check_password, create_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    ip = request.remote_addr

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if is_suspicious(username) or is_suspicious(password):
        log_attack(ip, "/login", f"username={username}", detect_attack(username or password), "Blocked")
        return jsonify({"error": "Suspicious input blocked"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # SECURE: parameterized query prevents authentication bypass via SQL injection.
        cursor.execute(
            "SELECT id, username, password, role, email FROM users WHERE username = %s",
            (username,),
        )
        user = cursor.fetchone()

        if not user or not check_password(password, user["password"]):
            return jsonify({"message": "Invalid credentials"}), 401

        token = create_token(user)
        return jsonify(
            {
                "message": "Login successful",
                "token": token,
                "user_id": user["id"],
                "username": user["username"],
                "role": user["role"],
                "email": user["email"],
            }
        )
    finally:
        cursor.close()
        conn.close()


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    email = (data.get("email") or "").strip()

    if len(username) < 3 or len(password) < 6 or "@" not in email:
        return jsonify({"error": "Invalid registration details"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            return jsonify({"error": "Username or email already exists"}), 409

        password_hash = hash_password(password)
        cursor.execute(
            """
            INSERT INTO users (username, password, role, email, last_processed)
            VALUES (%s, %s, %s, %s, NOW())
            """,
            (username, password_hash, "user", email),
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    finally:
        cursor.close()
        conn.close()
