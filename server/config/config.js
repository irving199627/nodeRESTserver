// ===================
// Puerto
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// Entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Vencimiento del Token
// ===================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = '48h';
// 60 * 60 * 24 * 30;

// ===================
// SEED de autenticación
// ===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===================
// Base de Datos
// ===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;

// ===================
// Google client ID
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '553318163964-g55j4m19n6vk0hqb56h68f880mjgueek.apps.googleusercontent.com';