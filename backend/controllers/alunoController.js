const Aluno = require('../models/aluno');

exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar alunos' });
  }
};

exports.obterAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter aluno' });
  }
};

exports.criarAluno = async (req, res) => {
  try {
    const novoAluno = new Aluno(req.body);
    const alunoSalvo = await novoAluno.save();
    res.status(201).json(alunoSalvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar aluno' });
  }
};

exports.atualizarAluno = async (req, res) => {
  try {
    const alunoAtualizado = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alunoAtualizado) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(alunoAtualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar aluno' });
  }
};

exports.apagarAluno = async (req, res) => {
  try {
    const alunoRemovido = await Aluno.findByIdAndDelete(req.params.id);
    if (!alunoRemovido) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json({ message: 'Aluno apagado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar aluno' });
  }
};
