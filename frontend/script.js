const apiUrl = 'https://projeto-raiz-backend.onrender.com'; // Added your Render URL
const alunosTableBody = document.querySelector('#alunosTable tbody');
const alunoForm = document.getElementById('alunoForm');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEdit');
const cursoSelect = document.getElementById('curso');

let editAlunoId = null;

// Load cursos and initialize the page
async function init() {
  try {
    await carregarCursos();
    await listarAlunos();
  } catch (error) {
    console.error('Initialization error:', error);
    alert('Erro ao inicializar a página');
  }
}

async function carregarCursos() {
  try {
    const res = await fetch(`${apiUrl}/cursos`);
    if (!res.ok) throw new Error('Failed to load cursos');
    
    const cursos = await res.json();
    cursoSelect.innerHTML = '<option value="">Selecione um curso</option>';
    
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso._id; // Using _id instead of id for MongoDB
      option.textContent = curso.nomeDoCurso;
      cursoSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading cursos:', error);
    alert('Erro ao carregar cursos. Por favor, recarregue a página.');
  }
}

async function listarAlunos() {
  try {
    const res = await fetch(`${apiUrl}/alunos`);
    if (!res.ok) throw new Error('Failed to load alunos');
    
    const alunos = await res.json();
    alunosTableBody.innerHTML = '';
    
    if (alunos.length === 0) {
      alunosTableBody.innerHTML = '<tr><td colspan="5">Nenhum aluno cadastrado</td></tr>';
      return;
    }
    
    alunos.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.apelido}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.anoCurricular}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editarAluno('${aluno._id}')">Editar</button>
          <button class="delete-btn" onclick="apagarAluno('${aluno._id}')">Apagar</button>
        </td>
      `;
      alunosTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error listing alunos:', error);
    alunosTableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar alunos</td></tr>';
  }
}

async function apagarAluno(id) {
  if (!confirm('Tem certeza que quer apagar este aluno?')) return;
  
  try {
    const res = await fetch(`${apiUrl}/alunos/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!res.ok) throw new Error('Failed to delete');
    listarAlunos();
  } catch (error) {
    console.error('Error deleting aluno:', error);
    alert('Erro ao apagar aluno. Por favor, tente novamente.');
  }
}

async function editarAluno(id) {
  try {
    const res = await fetch(`${apiUrl}/alunos/${id}`);
    if (!res.ok) throw new Error('Failed to load aluno');
    
    const aluno = await res.json();
    
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('apelido').value = aluno.apelido;
    
    // Select the correct curso
    const cursoOptions = Array.from(cursoSelect.options);
    const cursoIndex = cursoOptions.findIndex(opt => opt.text === aluno.curso);
    if (cursoIndex >= 0) {
      cursoSelect.selectedIndex = cursoIndex;
    }
    
    document.getElementById('anoCurricular').value = aluno.anoCurricular;
    formTitle.textContent = 'Editar Aluno';
    cancelEditBtn.style.display = 'inline';
    editAlunoId = id;
    
    // Scroll to form
    alunoForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error editing aluno:', error);
    alert('Erro ao carregar dados do aluno');
  }
}

// Cancel edit function
cancelEditBtn.onclick = () => {
  alunoForm.reset();
  formTitle.textContent = 'Adicionar Aluno';
  cancelEditBtn.style.display = 'none';
  editAlunoId = null;
};

// Form submission handler
alunoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('nome').value.trim();
  const apelido = document.getElementById('apelido').value.trim();
  const cursoSelected = cursoSelect.options[cursoSelect.selectedIndex];
  
  if (!nome || !apelido || !cursoSelected.value) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }
  
  const alunoData = {
    nome,
    apelido,
    curso: cursoSelected.text,
    anoCurricular: Number(document.getElementById('anoCurricular').value) || 1
  };

  try {
    const url = editAlunoId ? `${apiUrl}/alunos/${editAlunoId}` : `${apiUrl}/alunos`;
    const method = editAlunoId ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alunoData)
    });
    
    if (!res.ok) throw new Error('Failed to save aluno');
    
    // Reset form and update list
    alunoForm.reset();
    formTitle.textContent = 'Adicionar Aluno';
    cancelEditBtn.style.display = 'none';
    editAlunoId = null;
    
    await listarAlunos();
    alert('Aluno salvo com sucesso!');
  } catch (error) {
    console.error('Error saving aluno:', error);
    alert('Erro ao salvar aluno. Por favor, tente novamente.');
  }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', init);