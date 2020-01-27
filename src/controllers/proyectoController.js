const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');


exports.crearProyecto = async (req, res) => {

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