
import socketio
import eventlet
from flask import Flask, render_template

from .utils import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)

sio = socketio.Server()
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@sio.on("connect")
def connect(sid, environ):
    pass


@sio.on("hey")
def hey(*args, **kwargs):
    breakpoint()
    print(args)
    print(kwargs)


if __name__ == "__main__":
    app = socketio.WSGIApp(sio, app)
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
