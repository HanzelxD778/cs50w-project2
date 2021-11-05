document.addEventListener('DOMContentLoaded', () => {

    //conectar al web socket
    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

        //nueva conexión al servidor
        let local = localStorage.getItem("localuser");
        console.log(local);
        socket.emit('join', {'username': local});
    });
    
    socket.on('joined', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.msg}`;
        document.querySelector("#mensajes").append(li);
        localStorage.setItem("last_channel", data.canal);
    });

    //para el index
    if(localStorage.getItem("last_channel") && (location.href === location.protocol + "//" + location.host + "/")){
        swal("Su ultimo canal fue " + localStorage.getItem("last_channel") + " , ¿Desea regresar a el?, sino toque afuera del mensaje")
            .then((value) => {
                if (value){
                    window.location.replace("/" + localStorage.getItem("last_channel"));
                }
        });
        //window.location.replace("/" + localStorage.getItem("last_channel"));
        //localStorage.removeItem("last_channel");
    };

    //deshabilitar boton enviar
    document.querySelector("#btn-msg").disabled = true;

    //habilitar si hay texto en el input
    document.querySelector("#msg").onkeyup = () => {
        if(document.querySelector("#msg").value.length > 0)
            document.querySelector("#btn-msg").disabled = false;
        else
            document.querySelector("#btn-msg").disabled = true;
    };

    //tomar input del formulario cuando se envie un mensaje
    document.getElementById("new-msg").onsubmit = (e) => {
        e.preventDefault();
        const mensaje = document.getElementById("msg").value;

        //limpiar el input y deshabilitar el boton
        document.getElementById("msg").value = '';
        document.getElementById("btn-msg").disabled = true;

        //emitir mensaje al servidor
        socket.emit("submit mensaje", {"mensaje": mensaje});

        //no recargar pagina
        return false;
    };

    //recibe mensajes del servidor y los agrega como etiqueta li
    socket.on("anunciar mensaje", data => {
        let local = localStorage.getItem("localuser")

        const li = document.createElement("li");

        if(data.user != local)
            li.className = "otra-persona"
        else
            li.className = "mi-persona"
            
        li.innerHTML = `<b>${data.user}:</b> ${data.mensaje} --- ${data.tiempo}`;
        document.querySelector("#mensajes").append(li);
    });

});