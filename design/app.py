import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from features import apology, login_required, lookup, usd

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
@login_required
def index():
    """Show portfolio of stocks"""
    stocks = db.execute(
        "SELECT symbol, SUM(shares) as total_shares FROM transactions WHERE user_id = :user_id GROUP BY symbol HAVING total_shares > 0",
        user_id=session["user_id"],
    )

    cash = db.execute(
        "SELECT cash FROM users WHERE id = :user_id", user_id=session["user_id"]
    )[0]["cash"]

    total_value = cash
    grand_total = cash

    for stock in stocks:
        quoted = lookup(stock["symbol"])
        stock["name"] = quoted["name"]
        stock["price"] = quoted["price"]
        stock["value"] = stock["price"] * stock["total_shares"]
        total_value += stock["value"]
        grand_total += stock["value"]

    total_value = usd(total_value)
    grand_total = usd(grand_total)
    cash = usd(cash)

    return render_template(
        "index.html",
        stocks=stocks,
        cash=cash,
        total_value=total_value,
        grand_total=grand_total,
    )



@app.route("/history")
@login_required
def history():
    """Show history of transactions"""

    transactions = db.execute(
        "SELECT * FROM transactions WHERE user_id = :user_id ORDER BY timestamp DESC",
        user_id=session["user_id"],
    )

    return render_template("history.html", transactions=transactions)


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


@app.route("/add", methods=["GET", "POST"])
@login_required
def add():
    if request.method == "POST":
        new_cash = int(request.form.get("new_cash"))

        if not new_cash or not str(new_cash).isdigit() or new_cash <= 0:
            return apology("Must Give Money")

        user_id = session["user_id"]

        rows = db.execute(
            "SELECT cash FROM users WHERE id = :user_id", user_id=session["user_id"]
        )

        user_cash = rows[0]["cash"]

        update_cash = user_cash + new_cash

        db.execute("UPDATE users SET cash = ? WHERE id = ?", update_cash, user_id)

        flash(f"You added {usd(new_cash)}!")
        return redirect("/")
    else:
        return render_template("add.html")

if __name__ == "__main__":
    app.run(debug=True)