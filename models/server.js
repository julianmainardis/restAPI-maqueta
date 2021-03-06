const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

const app = express();

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        }
        
        // Conectar a base de datos
        this.conectDB();
        
        // middlewares, funcion que siempre se ejecuta cuando levantemos el server
        this.middlewares();

        //rutas de mi app
        this.routes();
    }

    async conectDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        // Parseo y lectura body
        this.app.use(express.json());

        // directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        });
    }

}

module.exports = Server;