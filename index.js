const express = require('express');
const conectarDB = require('./config/db');

const app = express();

conectarDB();

const PORT = process.env.PORT || 4000;

app.use(express.json({extended: true }));

app.use('/api/usuarios', require('./src/routes/usuarios'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/proyectos', require('./src/routes/proyectos'));

app.listen(PORT, () => {
    console.log(`app listening port:${PORT}`);
});