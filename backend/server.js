require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error);
    process.exit(1);
  }
}

connect();

// Schemas e modelos
const cursoSchema = new mongoose.Schema({
  nomeDoCurso: String
});

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number
});

const Curso = mongoose.model('Curso', cursoSchema);
const Aluno = mongoose.model('Aluno', alunoSchema);

// Rotas Cursos
app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).send('Erro ao listar cursos');
  }
});

// Rotas Alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (error) {
    res.status(500).send('Erro ao listar alunos');
  }
});

app.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).send('Aluno não encontrado');
    res.json(aluno);
  } catch (error) {
    res.status(500).send('Erro ao buscar aluno');
  }
});

app.post('/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).send('Erro ao criar aluno');
  }
});

app.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aluno) return res.status(404).send('Aluno não encontrado');
    res.json(aluno);
  } catch (error) {
    res.status(500).send('Erro ao atualizar aluno');
  }
});

app.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) return res.status(404).send('Aluno não encontrado');
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send('Erro ao apagar aluno');
  }
});

// Rota raiz só pra teste rápido
app.get('/', (req, res) => {
  res.send('API está a funcionar');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor a escutar na porta ${PORT}`);
});

