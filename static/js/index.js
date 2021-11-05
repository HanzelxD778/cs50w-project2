/*codigo del lado del cliente*/

//var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
var socket = io();

const crearCanal = (e) => {
    e.preventDefault();

    let channel = document.getElementById("channel").value;

    socket.emit("addChannel", {"channel": channel});

    document.getElementById("channel").value = "";

    return false;
}

socket.on("added", (data) =>{
    const molde = Handlebars.compile(document.getElementById("molde-post").innerHTML)
    const channel = molde(data);
    document.getElementById("channels").innerHTML += channel;
})

document.getElementById("new-channel").addEventListener("submit", crearCanal);