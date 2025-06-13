const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // Importa variáveis do .env

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado com sucesso'))
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// Modelo da Doceria
const Doceria = mongoose.model('Doceria', {
  name: String,
  description: String,
  photo: String,
  latitude: Number,
  longitude: Number,
});

// Configuração do Multer (upload de imagens)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Rota: listar todas as docerias
app.get('/docerias', async (req, res) => {
  const docerias = await Doceria.find();
  res.json(docerias);
});

// Rota: cadastrar nova doceria
app.post('/docerias', upload.single('photo'), async (req, res) => {
  const { name, description, latitude, longitude } = req.body;
  const photo = req.file ? req.file.path : null;

  const doceria = new Doceria({
    name,
    description,
    photo,
    latitude,
    longitude,
  });

  await doceria.save();
  res.json(doceria);
});

// Inicia o servidor
app.listen(3000, () => console.log('Backend ouvindo na porta 3000'));
