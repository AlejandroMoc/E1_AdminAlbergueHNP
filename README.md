# Administrador del albergue del Hospital del Niño Poblano

<!-- ### En colaboración con el Instituto Tecnológico y de Estudios Superiores de Monterrey y el Albergue del Hospital del Niño Poblano. -->

<!--Ctrl+Shift+V en VSCode para consultar la vista previa de este archivo -->

Aplicación desarrollada del 19 de febrero al 14 de junio de 2024.

Entrega realizada el 12 de junio de 2024.

## Ejecución general

Estos pasos son necesarios para realizar tanto la instalación local como en una red cerrada del sistema.

Para ejecutar el proyecto es necesario importar la base de datos de la carpeta "dump" en una base de datos de MySQL. En este caso se utiliza PostgreSQL con PGAdmin4.

Igualmente, es necesario cambiar estos valores en el archivo [db_connection.js](server/db_connection.js).
Es necesario modificar también el valor de API_URL en el archivo [App.jsx](client/src/App.jsx) con la dirección ip local del sistema.


## Ejecución local

Abrir la carpeta "server" y la carpeta "client" en dos terminales individuales. Ejecutar los siguientes comandos en cada una de las terminales recién abiertas:

    npm install

    npm start

Dirigirse a la dirección establecida en API_URL (por defecto localhost:3000).

## Ejecución remota

También es posible utilizar Docker para la instalación de este sistema de forma remota. Para ello, y tras haber instalado Docker:

En la carpeta client, ejecutar el siguiente comando:

    docker image build -t gestion-front-image:latest .

En la carpeta server, por su parte, ejecutar:

    docker image build -t gestion-back-image:latest .

Una vez hecho esto, dirigirse a la dirección establecida en API_URL (por ejemplo, http://192.168.1.68:8008). Cualquier persona dentro de la red debería poder acceder al sistema con esta misma URL.

### Desarrolladores

- Hugo Muñoz Rodríguez

- Daniela Lozada Bracamontes

- José Luis Zago Guevara

- Christian Flores Alberto

- César Guerra Martínez 

- Alejandro Daniel Moctezuma Cruz
