const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');


exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardar el proyecto
        await proyecto.save();
        return res.status(200).json(proyecto);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
   try {
       const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
       res.status(200).json({proyectos});
   } catch (e) {
       console.log(e);
       res.status(500).send('Hubo un error');
   }
}

exports.actualizarProyecto = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {nombre} = req.body;

        const nuevoProyecto = {};

        if(nombre) {
            nuevoProyecto.nombre = nombre;
        }

        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //actualizar
        proyecto = await Proyecto.findOneAndUpdate({_id: req.params.id}, {
            $set : nuevoProyecto
        }, {new: true});


        res.status(200).json(proyecto);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error en el servidor');
    }
}

//Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        return res.json({msg: 'Proyecto eliminado'});
    } catch (e) {
        console.log(e);
        res.status(500).send("Error en el servidor");
    }

}