# Project 2

Este proyecto es un servicico de mensajería en línea que utiliza Flask.

Cuando un nuevo usuario accede a la página este es redirigido a la funcion login, en helpers.py se encuentra la funcion que hace que esa redireccion funcione, en login.html se pide el nombre del usuario, ese nombre de usuario es almacenado en el servidor de flask si es que no existe aún un usuario con ese nombre, también se almacena ese nombre en el localStorage en el lado del cliente con Javascript en el script que se encuentra en el mismo documento.

Una vez logeado la aplicacion te redirecciona a index.html donde hay un formulario para crear nuevos canales, esos canales se crean en index.js la funcion crearCanal toma el valor del input escrito en el formulario del index.html, ese valor se envia al servidor para almacenarlo, este manda una respuesta al index.js para crear los elementos con un molde de handlebars en el lado del cliente con javascript (el molde se encuentra en layout.html al final del head).

También como toque personal un requerimiento que no se pidio fue el de mostrar los usuarios que estan conectados a la aplicacion, esto se hace comparando las sesiones activas en el servidor con la sesión del usuario que se esta usando actualmente, si hay más sesiones de flask aparte de mi usuario esas sesiones que son de otros usuarioas se muestran.

El side-navbar que muestra los canales creados y el nombre de usuario se encuentra en layout.html, los estilos del side-navbar se encuentran en sidebar.css y las animaciones de la barra se encuentran en main.js

Cuando un usuario accede a un canal creado este es redireccionado a la url "/" + nombreDelCanal renderiza channel.html donde muestra los mensajes que ya estan almacenados en la memoria del sevidor en caso de que ya hayan enviado mensaje otros usuarios, si el nombre asociado al mensaje es distinto a mi nombre de usuario entonces es un mensaje de otra persona y se crea una etiqueta "li" con la clase "otra-persona" si el mensaje es mio entonces se le agrega la clase "mi-persona" a la etiqueta y se les da estilos distintos en styles.css 