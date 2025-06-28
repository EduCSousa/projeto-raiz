// seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: String,
  apelido: String,
  curso: String,
  anoCurricular: Number
});
const cursoSchema = new mongoose.Schema({
  nomeDoCurso: String
});

const Aluno = mongoose.model('Aluno', alunoSchema);
const Curso = mongoose.model('Curso', cursoSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Apaga dados antigos (opcional)
  await Aluno.deleteMany({});
  await Curso.deleteMany({});

  // Insere cursos
  const cursos = await Curso.insertMany([
    { nomeDoCurso: 'Engenharia Informática' },
    { nomeDoCurso: 'Design Gráfico' },
    { nomeDoCurso: 'Medicina' }
  ]);

  // Insere alunos
  await Aluno.insertMany([
    { nome: 'João', apelido: 'Silva', curso: 'Engenharia Informática', anoCurricular: 2 },
    { nome: 'Maria', apelido: 'Costa', curso: 'Design Gráfico', anoCurricular: 1 }
  ]);

  console.log('Dados inseridos com sucesso!');
  await mongoose.disconnect();
}

seed().catch(console.error);
