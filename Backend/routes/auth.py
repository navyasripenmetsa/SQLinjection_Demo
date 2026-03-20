from flask import Blueprint, request
from services.db import get_db_connection
from services.logger import log_event
from services.security import detect_attack

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    ip_address = request.remote_addr

    conn = get_db_connection()
    cursor = conn.cursor()

    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"

    print("Generated Query:", query)

    result = cursor.execute(query).fetchone()

# detect attack
    attack_type = detect_attack(username, password)

# response
    if result:
        response = "Login successful"
    else:
        response = "Invalid credentials"

# log it
    log_event(
    {"username": username, "password": password},
    query,
    response,
    attack_type,
    ip_address
)

    conn.close()

    return {"message": response}