// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({ limit: '25mb' }));
server.set('view engine', 'ejs');

// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'recetas_db',
  });
  connection.connect();
  return connection;
}

// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});

// Endpoints

// GET /api/items
server.get('/recetas', async (req, res) => {
  const selectRE = 'SELECT * FROM recetas';
  const conn = await getConnection();
  const [result] = await conn.query(selectRE);
  console.log(result);
  conn.end();
  res.json({
    info: { count: result.length },
    results: result,
  });
});

//Obtener una receta por su ID (GET /recetas/:id)
server.get('/recetas/:id', async (req, res) => {
  const RecetaId = req.params.id;
  const selectRE = 'select * from recetas where id = ?';
  const conn = await getConnection();
  const [result] = await conn.query(selectRE, [RecetaId]);
  conn.end();
  console.log(result);
  res.json({
    results: result,
  });
});

//Crear una nueva receta (POST /recetas):

//Actualizar una receta existente (PUT /recetas/:id):

//Eliminar una receta (DELETE /recetas/:id)
