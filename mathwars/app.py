import os
import socketio
import eventlet
from functools import wraps
from flask import Flask, render_template

from .utils import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)

sio = socketio.Server()
app = Flask(__name__)
am_master = os.environ.get("MASTER", None)


def slave_only(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if am_master:
            return None
        return func(*args, **kwargs)


@app.route("/")
def index():
    if am_master:
        return render_template(
            "index.html"
        )  # set something in template to make this a simple signin
    else:
        return render_template(
            "index.html"
        )  # set something in template to make this the game


@sio.on("connect")
@slave_only
def connect(sid, environ):
    pass


if __name__ == "__main__":
    app = socketio.WSGIApp(sio, app)
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
