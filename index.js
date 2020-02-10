const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//habilitar cors
app.use(cors());

//puerto de la app
const port = process.env.port || 4000;

//Habilitar express.json
app.use(express.json({extended: true }));

app.use('/api/usuarios', require('./src/routes/usuarios'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/proyectos', require('./src/routes/proyectos'));
app.use('/api/tareas', require('./src/routes/tareas'));

app.listen(port, '0.0.0.0', () => {
    console.log(`app listening port:${PORT}`);
});