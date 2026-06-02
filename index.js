import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Conectamos con la URL de tu archivo .env
const sql = neon(process.env.DATABASE_URL);

async function ejecutarPrueba() {
  try {
    // Hacemos una consulta simple para pedirle la hora al servidor de Neon
    const resultado = await sql`SELECT NOW();`;
    
    console.log("--------------------------------------------");
    console.log("¡Conexión exitosa a Neon! 🚀");
    console.log("Hora actual del servidor:", resultado[0].now);
    console.log("--------------------------------------------");
  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  }
}

ejecutarPrueba();