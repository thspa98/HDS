import express from 'express';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const app = express();
const port = 3000;

// Conectamos a Neon usando la variable de entorno
const sql = neon(process.env.DATABASE_URL);

// Configuración para poder leer los datos que se envían desde los formularios HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. RUTA PRINCIPAL: Muestra la interfaz y la lista de productos
app.get('/', async (req, res) => {
    try {
        // Consultamos los productos ya existentes
        const productos = await sql`SELECT * FROM productos ORDER BY id DESC;`;
        
        // Generamos el HTML dinámicamente
        let htmlProductos = productos.map(p => 
            `<tr><td>${p.id}</td><td>${p.nombre}</td><td>$${p.precio}</td><td>${new Date(p.fecha_creacion).toLocaleString()}</td></tr>`
        ).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Prueba de Conexión Neon</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background-color: #f4f7f6; }
                    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
                    h2 { color: #333; }
                    input[type="text"], input[type="number"] { width: 100%; padding: 10px; margin: 8px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
                    button { background-color: #0070f3; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%; font-size: 16px; }
                    button:hover { background-color: #0051a8; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .status { color: green; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Estado de la Base de Datos</h2>
                    <p class="status">● Conectado exitosamente a Neon</p>
                </div>

                <div class="card">
                    <h2>Cargar nuevo producto</h2>
                    <form action="/agregar" method="POST">
                        <label>Nombre del Producto:</label>
                        <input type="text" name="nombre" placeholder="Ej. Creatina 500g" required>
                        
                        <label>Precio:</label>
                        <input type="number" step="0.01" name="precio" placeholder="Ej. 4500.50" required>
                        
                        <button type="submit">Guardar en Neon</button>
                    </form>
                </div>

                <div class="card">
                    <h2>Productos en la Base de Datos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlProductos || '<tr><td colspan="4" style="text-align:center;">No hay productos cargados aún.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send(`<h1>Error al conectar con Neon</h1><pre>${error.message}</pre>`);
    }
});

// 2. RUTA POST: Recibe los datos del formulario e inserta en la base de datos
app.post('/agregar', async (req, res) => {
    const { nombre, precio } = req.body;
    try {
        // Insertar datos de forma segura para evitar SQL Injection
        await sql`INSERT INTO productos (nombre, precio) VALUES (${nombre}, ${precio});`;
        // Recargamos la página principal para ver el nuevo producto
        res.redirect('/');
    } catch (error) {
        res.status(500).send(`<h1>Error al insertar datos</h1><pre>${error.message}</pre>`);
    }
});

// Iniciamos el servidor local
app.listen(port, () => {
    console.log(`🚀 Servidor web corriendo en http://localhost:${port}`);
});