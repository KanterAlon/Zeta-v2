const express = require('express');
const cors = require('cors');
const homeRoutes = require('./routes/home.routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/home', homeRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
