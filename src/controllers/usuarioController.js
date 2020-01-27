const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {email, password} = req.body;

        //Revisar si existe usuario con el mismo correo
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //crear nuevo usuario
        usuario = new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if(error) throw error;
            //mensaje de confirmacion
            res.status(200).json({token});
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
}