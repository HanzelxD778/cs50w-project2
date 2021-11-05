import re
from flask import Flask, render_template, session, request, redirect, flash
from flask_session import Session
from flask_socketio import SocketIO, emit, join_room
from time import localtime, asctime

from collections import deque
from helpers import login_required

app = Flask(__name__)

app.config["SECRET_KEY"] = "secret"
app.config['SESSION_TYPE'] = "filesystem"
Session(app)
socketio = SocketIO(app, cors_allowed_origins="*")

#almacenar usuarios logeados
users = []

#almacenar canales creados
channels = []

#instanciar un diccionario para los mensajes de cada chat
ChannelsMessages = dict()

@app.route("/")
@login_required
def index():
    return render_template("index.html", channels=channels, activos=users)

@app.route("/login" , methods=['GET', 'POST'])
def login():
    
    session.clear()

    username = request.form.get("username")

    if request.method == "POST":
        
        if username in users:
            flash("Nombre de usuario ya existente")
            return render_template("login.html")
            
        users.append(username)
            
        session["username"] = username

        #remember the user session on a cookie if the browser is closed
        session.permanent = True
            
        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/logout", methods=['GET'])
def logout():
    """ Logout user from list and delete cookie."""

    # Remove from list
    try:
        users.remove(session['username'])
    except:
        pass

    # Delete cookie
    session.clear()

    return redirect("/")
        
@app.route("/<canal>")
def canal(canal):
    session["canal"] = canal

    return render_template("channel.html", channels=channels, ChannelsMessages=ChannelsMessages[canal], canal = canal)

#Creamos y unimos al canal el canal
@socketio.on("addChannel")
def addChannel(dato):
    print(dato)

    if dato["channel"] in channels:
        flash("Ya existe un canal con ese nombre")
        return render_template("index.html")

    channels.append(dato["channel"])

    for chanel in channels:
        print(channels)

    ChannelsMessages[dato["channel"]] = []

    emit("added", dato)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = session.get('canal')
    msg = username + " ha entrado a la sala de chat"
    join_room(room)
    emit('joined', {"canal": room, "msg": msg}, room=room) #enviar mensaje solo al canal actual

@socketio.on("submit mensaje")
def msg(data):
    canal = session.get("canal")
    mensaje = data["mensaje"]
    tiempo = asctime(localtime())
    room = session.get("canal")

    ChannelsMessages[canal].append([session.get("username"), mensaje, tiempo])

    if len(ChannelsMessages[canal]) > 100:
        ChannelsMessages[canal].pop(0)

    emit("anunciar mensaje", {
        "user": session.get("username"),
        "mensaje": mensaje,
        "tiempo": tiempo
    }, room=room)

"""@socketio.on("nuevoUser")
def nuevoUser(data):
    print("YO CREO QUE SI FUNCIONA")
    emit("nuevoUser", data, broadcast = True)"""

if __name__ == '__main__':
    socketio.run(app)