const Curso = require('../models/curso');

exports.listarCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar cursos' });
  }
};
