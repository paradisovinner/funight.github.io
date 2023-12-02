import sqlite3
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from features import login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure to use SQLite database
db = sqlite3("sqlite:///funight.db")

error_messages = []

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/history")
@login_required
def history():
    """Show history of funight"""

    history = db.execute(
        "SELECT * FROM history WHERE user_id = :user_id ORDER BY timestamp DESC",
        user_id=session["user_id"],
    )

    return render_template("history.html", history=history)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            error_messages.append("must provide username")

        # Ensure password was submitted
        elif not request.form.get("password"):
            error_messages.append("must provide password")

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            error_messages.append("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    session.clear()

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        
        if not username or not password or not confirmation:
            error_messages.append("You must fill in all criteria to register")

        elif len(password) < 8:
            error_messages.append("Password must be at least 8 characters long")
        
        elif not any(char.isupper().islower().isdigit() for char in password):
            error_messages.append("Password must contain at least one uppercase, one lowercase, and one digit")
        
        elif not any(char.isalnum or char in "!@#$%^&*-_?./" for char in password):
            error_messages.append("Password must contain at least one special character !@#$%^&*-_?./")

        if password != confirmation:
            error_messages.append("Your passwords do not match")

        user_check = db.execute(
            "SELECT username FROM users WHERE username = ?;", username
        )

        if len(user_check) != 0:
            error_messages.append("Username already exists")
        else:
            pwhash = generate_password_hash(password)
            db.execute(
                "INSERT INTO users (username, hash) VALUES (?, ?)", username, pwhash
            )

            user_check = db.execute(
                "SELECT id FROM users WHERE username = ? AND hash = ?", username, pwhash
            )
            session["user_id"] = user_check[0]["id"]
            return redirect("/")
    else:
        return render_template("register.html")

    return render_template("add.html")


@app.route('/getOptions')
@login_required
def get_options():
    # Fetch options from the database
    
    if request.method == "POST":
        meals = request.form.get("meals");
        desserts = request.form.get("desserts");
        activities = request.form.get("activities");
        endofnight = request.form.get("endofnight");
    
        if not (meals or desserts or activities or endofnight):
            error_messages.append("Please enter at least one entry")

    options = db.execute("SELECT meals, desserts, activities, endofnight FROM history WHERE id = :user_id", user_id=session["user_id"])[0]["meals", "desserts", "activities", "endofnight"]
    
    db.execute("INSERT INTO history (user_id, meals, desserts, activities, endofnight) VALUES (:user_id, :meals, :desserts, :activities, :endofnight)",
               user_id=session["user_id"], meals=meals, desserts=desserts, activities=activities, endofnight=endofnight)

    flash("Your touch of funight has been added!")

    return jsonify(options)


@app.route("/personalize", methods=["GET", "POST"])
@login_required
def personalize():
    if request.method == "POST":
        meals = request.form.get("meals");
        desserts = request.form.get("desserts");
        activities = request.form.get("activities");
        endofnight = request.form.get("endofnight");
    
        if not meals or not desserts or not activities or not endofnight:
            error_messages.append("Please provide us with your ideal funight")
    
        options = db.execute("SELECT meals, desserts, activities, endofnight FROM history WHERE id = :user_id", user_id=session["user_id"])[0]["meals", "desserts", "activities", "endofnight"]
    
        db.execute("INSERT INTO history (user_id, meals, desserts, activities, endofnight) VALUES (:user_id, :meals, :desserts, :activities, :endofnight)",
               user_id=session["user_id"], meals=meals, desserts=desserts, activities=activities, endofnight=endofnight)

        flash("Your touch of funight has been added!")

        return jsonify(options)
    return render_template('personalize.html')


@app.route("/inout", methods=["GET", "POST"])
@login_required
def inout():
    return render_template('inout.html')


if __name__ == "__main__":
    app.run(debug=True)