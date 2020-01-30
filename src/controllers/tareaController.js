const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }



    try {
        //Extraer proyecto y comprobar existencia
        const proyectoId = req.body.proyecto;
        const proyecto = await Proyecto.findById(proyectoId);
        if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'});

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(200).json({tarea});

    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer proyecto y comprobar existencia
        const proyectoId = req.body.proyecto;
        const proyecto = await Proyecto.findById(proyectoId);
        if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'});

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto: proyectoId});
        res.status(200).json({tareas});

    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}