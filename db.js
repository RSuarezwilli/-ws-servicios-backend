// db.js
// Guarda las solicitudes en un archivo JSON local (solicitudes.json).
// No necesita ninguna librería externa ni instalar una base de datos aparte.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'solicitudes.json');

function leerTodas() {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  const contenido = fs.readFileSync(DB_PATH, 'utf-8').trim();
  return contenido ? JSON.parse(contenido) : [];
}

function guardarTodas(lista) {
  fs.writeFileSync(DB_PATH, JSON.stringify(lista, null, 2), 'utf-8');
}

export function crearSolicitud({ nombre, telefono, direccion, servicio, detalle, correo }) {
  const lista = leerTodas();
  const nuevoId = lista.length ? lista[lista.length - 1].id + 1 : 1;

  const nueva = {
    id: nuevoId,
    nombre,
    telefono,
    direccion,
    servicio,
    detalle: detalle || '',
    correo: correo || '',
    creado_en: new Date().toLocaleString('es-CO')
  };

  lista.push(nueva);
  guardarTodas(lista);
  return nuevoId;
}

export function listarSolicitudes() {
  return leerTodas().slice().reverse(); // más nuevas primero
}
