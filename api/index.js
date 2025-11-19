// Ajuste o caminho para onde sua aplicação Express (app) é exportada.
// Assumindo que o arquivo app.ts/js está na pasta 'backend/src'
const app = require('../backend/dist/app'); 

// Vercel usa o Node.js para servir o handler
module.exports = app;