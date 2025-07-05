from flask import Flask, request, jsonify, render_template

from flask_cors import CORS
import sqlite3

# app = Flask(__name__)
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
CORS(app)


# Connect to SQLite database
DB_PATH = os.path.join(BASE_DIR, 'user.db')
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Create users table if it doesn't exist
with get_db_connection() as conn:
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()
    print("Received signup payload:", data)  # Debug print
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE email = ?", (email,))
        if cur.fetchone():
            return jsonify({"msg": "Email already exists"}), 409
        cur.execute(
            "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
            (name, email, phone, password)
        )
        conn.commit()
    return jsonify({"msg": "Signup successful"}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT name FROM users WHERE email = ? AND password = ?", (email, password))
        user = cur.fetchone()
        if user:
            return jsonify({"msg": "Login successful", "user": user["name"]}), 200
        else:
            return jsonify({"msg": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True)
