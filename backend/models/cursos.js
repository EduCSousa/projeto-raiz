const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nomeDoCurso: { type: String, required: true }
});

module.exports = mongoose.model('Curso', cursoSchema);
