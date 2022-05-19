const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const getUsers = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });

};


const postUsers = async(req = request, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    //encriptar la pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en DB
    await usuario.save();
    
    res.json({
        usuario
    });

};

const putUsers = async(req = request, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //validar contra bd
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });

};

const deleteUsers = async(req = request, res = response) => {
    
    const { id } = req.params;

    //Borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Borrar logicamente
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        usuario
    });

};

const patchUsers = (req = request, res = response) => {
   
    res.json({
        msg: "patch API - controller"
    });

};



module.exports = {
    getUsers,
    putUsers, 
    postUsers,
    deleteUsers,
    patchUsers
}