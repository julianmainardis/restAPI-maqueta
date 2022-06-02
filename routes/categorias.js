const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { postCategoria,
        getCategorias,
        getCategoriaById,
        putCategoria, 
        deleteCategoria} = require('../controllers/categorias.controller');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/categorias

//obtener todas las categorias - publico
router.get('/', getCategorias);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],getCategoriaById);

//crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCategoria);

// actualizar registro por id - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], putCategoria);

//borar categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], deleteCategoria);


module.exports = router;