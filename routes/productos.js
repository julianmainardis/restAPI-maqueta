const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { postProducto,
        getProductos,
        getProductoById,
        putProducto, 
        deleteProducto} = require('../controllers/productos.controller');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/productos

//obtener todos los productos - publico
router.get('/', getProductos);

//obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],getProductoById);

//crear producto - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], postProducto);

// actualizar registro por id - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], putProducto);

//borar producto - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProducto);


module.exports = router;