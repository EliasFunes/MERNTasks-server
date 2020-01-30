const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crea proyectos
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//Obtener proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//actualizar proyecto via ID
router.get('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//elimina un proyecto via ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;