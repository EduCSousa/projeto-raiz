const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number
});

const Aluno = mongoose.model('Aluno', alunoSchema);

app.get('/', (req, res) => {
  res.send('API está a funcionar');
});

app.get('/alunos', async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
});

app.get('/alunos/:id', async (req, res) => {
  const aluno = await Aluno.findById(req.params.id);
  if (!aluno) return res.status(404).send('Aluno não encontrado');
  res.json(aluno);
});

app.post('/alunos', async (req, res) => {
  const aluno = new Aluno(req.body);
  await aluno.save();
  res.status(201).json(aluno);
});

app.put('/alunos/:id', async (req, res) => {
  const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!aluno) return res.status(404).send('Aluno não encontrado');
  res.json(aluno);
});

app.delete('/alunos/:id', async (req, res) => {
  const aluno = await Aluno.findByIdAndDelete(req.params.id);
  if (!aluno) return res.status(404).send('Aluno não encontrado');
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
