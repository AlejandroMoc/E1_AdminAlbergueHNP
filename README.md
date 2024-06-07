# Administrador del albergue del Hospital del Niño Poblano

## Planeación de sistemas de software (Gpo 101)
<!-- ### En colaboración con el Instituto Tecnológico y de Estudios Superiores de Monterrey y la empresa Green Carson. -->

<!--Ctrl shift v para ver preview en VSCode -->

Aplicación desarrollada del 19 de febrero al 14 de junio de 2024.

<!-- Entrega prevista para el 25 de mayo de 2024. -->

## Ejecución general

Estos pasos son necesarios para realizar tanto la instalación local como en una red cerrada del sistema.

Para ejecutar el proyecto es necesario importar la base de datos del folder "dump" en una base de datos de MYSQL. En este caso se utiliza PostgreSQL con PGAdmin4.

Igualmente, es necesario cambiar estos valores en el archivo [db_connection.js](server/db_connection.js).
Es necesario modificar también el valor de API_URL en el archivo [App.jsx](client/src/App.jsx) con la dirección ip local del sistema.


## Ejecución local

Abrir la carpeta "server" y la carpeta "client" y ejecutar los siguientes comandos en cada una:

    npm install

    npm start

Dirigirse a la dirección establecida en API_URL (por defecto localhost:3000).

## Ejecución remota

Es posible también utilizar Docker para la instalación de este sistema de forma remota. Para ello, y tras haber instalado Docker:

En la carpeta client, ejecutar el siguiente comando:

    docker image build -t gestion-front-image:latest .

En la carpeta server, por su parte, ejecutar:

    docker image build -t gestion-back-image:latest .

Una vez hecho esto, dirigirse a la dirección establecida en API_URL (por ejemplo, http://192.168.1.68:8008). Cualquier persona dentro de la red debería poder acceder al sistema con esta misma URL.

### Desarrolladores
A01736149 - Hugo Muñoz Rodríguez

A01736594 - Daniela Lozada Bracamontes

A01736278 - José Luis Zago Guevara

A01734997 - Christian Flores Alberto

A01656774 - César Guerra Martínez 

A01736353 - Alejandro Daniel Moctezuma Cruz
