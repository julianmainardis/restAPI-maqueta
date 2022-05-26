const bcryptjs = require("bcryptjs");
const { request } = require("express");
const { response } = require("express");
const { json } = require("express/lib/response");
const { DefaultTransporter } = require("google-auth-library");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario')

const login = async(req, res = response ) => {

    const { correo, password } = req.body;

    try {

        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        //verificar si el usuario esta activo en la DB
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecta'
            });
        }
        
        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

const googleSignIn = async(req = request, res = response) => {
    
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '.',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en DB 
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado'
            });
        }

        //GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
 
}

module.exports = {
    login,
    googleSignIn
}