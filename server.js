// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { crearSolicitud, listarSolicitudes } from './db.js';
import { notificarNuevaSolicitud } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'cambia-esto';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crear una solicitud nueva desde el formulario del sitio.
app.post('/api/solicitudes', async (req, res) => {
  const { nombre, telefono, direccion, servicio, detalle } = req.body || {};

  if (!nombre || !telefono || !direccion || !servicio) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios.' });
  }

  try {
    const id = crearSolicitud({ nombre, telefono, direccion, servicio, detalle });

    try {
      await notificarNuevaSolicitud({ nombre, telefono, direccion, servicio, detalle });
    } catch (mailErr) {
      // La solicitud ya se guardó bien; que falle el correo no debe
      // tumbar la respuesta al usuario. Solo lo dejamos en el log.
      console.error('No se pudo enviar el correo de notificación (la solicitud sí se guardó):', mailErr.message);
    }

    res.json({ ok: true, id });
  } catch (err) {
    console.error('Error guardando solicitud:', err);
    res.status(500).json({ ok: false, error: 'No se pudo guardar la solicitud.' });
  }
});

// Panel simple para ver las solicitudes guardadas.
// Protegido con un token básico: /admin?token=TU_TOKEN
app.get('/admin', (req, res) => {
  if (req.query.token !== ADMIN_TOKEN) {
    return res.status(401).send('No autorizado. Usa /admin?token=TU_TOKEN');
  }

  const solicitudes = listarSolicitudes();
  const filas = solicitudes.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.creado_en}</td>
      <td>${s.nombre}</td>
      <td>${s.telefono}</td>
      <td>${s.direccion}</td>
      <td>${s.servicio}</td>
      <td>${s.detalle || ''}</td>
    </tr>
  `).join('');

  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Solicitudes — WS. SERVICIOS</title>
        <style>
          body{font-family:sans-serif; background:#0D1922; color:#EEF2F3; padding:24px;}
          table{border-collapse:collapse; width:100%;}
          th, td{border:1px solid #26404B; padding:8px 10px; font-size:14px; text-align:left;}
          th{background:#132531;}
        </style>
      </head>
      <body>
        <h1>Solicitudes recibidas (${solicitudes.length})</h1>
        <table>
          <tr><th>#</th><th>Fecha</th><th>Nombre</th><th>Teléfono</th><th>Dirección</th><th>Servicio</th><th>Detalle</th></tr>
          ${filas || '<tr><td colspan="7">Todavía no hay solicitudes.</td></tr>'}
        </table>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Panel de solicitudes en http://localhost:${PORT}/admin?token=${ADMIN_TOKEN}`);
});
