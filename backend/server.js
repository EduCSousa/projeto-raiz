const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const Aluno = require('./models/alunos'); 
const Curso = require('./models/cursos'); 

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro na conexão com MongoDB:', err));


app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/alunos', async (req, res) => {
  if (!req.body.nome || !req.body.apelido) {
    return res.status(400).json({ message: 'Nome e apelido são obrigatórios' });
  }

  const aluno = new Aluno({
    nome: req.body.nome,
    apelido: req.body.apelido,
    curso: req.body.curso,
    anoCurricular: req.body.anoCurricular
  });

  try {
    const novoAluno = await aluno.save();
    res.status(201).json(novoAluno);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });

    aluno.nome = req.body.nome ?? aluno.nome;
    aluno.apelido = req.body.apelido ?? aluno.apelido;
    aluno.curso = req.body.curso ?? aluno.curso;
    aluno.anoCurricular = req.body.anoCurricular ?? aluno.anoCurricular;

    const alunoAtualizado = await aluno.save();
    res.json(alunoAtualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/alunos/:id', async (req, res) => {
  try {
    await Aluno.deleteOne({ _id: req.params.id }); 
    res.json({ message: 'Aluno apagado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotas para Cursos
app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});