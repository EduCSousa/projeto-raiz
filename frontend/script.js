const apiUrl = 'https://projeto-raiz-backend.onrender.com'; 

const alunosTableBody = document.querySelector('#alunosTable tbody');
const alunoForm = document.getElementById('alunoForm');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEdit');
const cursoSelect = document.getElementById('curso');

let editAlunoId = null;

async function carregarCursos() {
  try {
    const res = await fetch(`${apiUrl}/cursos`);
    if (!res.ok) throw new Error('Erro ao carregar cursos');
    const cursos = await res.json();
    cursoSelect.innerHTML = '';
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso._id || curso.id;
      option.textContent = curso.nomeDoCurso;
      cursoSelect.appendChild(option);
    });
  } catch (error) {
    alert('Erro ao carregar cursos');
    console.error(error);
  }
}

async function listarAlunos() {
  try {
    const res = await fetch(`${apiUrl}/alunos`);
    if (!res.ok) throw new Error('Erro ao listar alunos');
    const alunos = await res.json();
    alunosTableBody.innerHTML = '';
    alunos.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.apelido}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.anoCurricular}</td>
        <td>
          <button onclick="editarAluno('${aluno._id}')">Editar</button>
          <button onclick="apagarAluno('${aluno._id}')">Apagar</button>
        </td>
      `;
      alunosTableBody.appendChild(tr);
    });
  } catch (error) {
    alert('Erro ao listar alunos');
    console.error(error);
  }
}

async function apagarAluno(id) {
  if (!confirm('Tem certeza que quer apagar este aluno?')) return;
  try {
    const res = await fetch(`${apiUrl}/alunos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao apagar aluno');
    listarAlunos();
  } catch (error) {
    alert('Erro ao apagar aluno');
    console.error(error);
  }
}

async function editarAluno(id) {
  try {
    const res = await fetch(`${apiUrl}/alunos/${id}`);
    if (!res.ok) throw new Error('Erro ao carregar dados do aluno');
    const aluno = await res.json();
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('apelido').value = aluno.apelido;

    for(let i = 0; i < cursoSelect.options.length; i++) {
      if (cursoSelect.options[i].text === aluno.curso) {
        cursoSelect.selectedIndex = i;
        break;
      }
    }
    document.getElementById('anoCurricular').value = aluno.anoCurricular;
    formTitle.textContent = 'Editar Aluno';
    cancelEditBtn.style.display = 'inline';
    editAlunoId = id;
  } catch (error) {
    alert('Erro ao carregar dados do aluno');
    console.error(error);
  }
}

cancelEditBtn.onclick = () => {
  alunoForm.reset();
  formTitle.textContent = 'Adicionar Aluno';
  cancelEditBtn.style.display = 'none';
  editAlunoId = null;
};

alunoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const alunoData = {
    nome: document.getElementById('nome').value.trim(),
    apelido: document.getElementById('apelido').value.trim(),
    curso: cursoSelect.options[cursoSelect.selectedIndex].text,
    anoCurricular: Number(document.getElementById('anoCurricular').value)
  };

  try {
    if (editAlunoId) {
      const res = await fetch(`${apiUrl}/alunos/${editAlunoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
      if (!res.ok) throw new Error('Erro ao editar aluno');
    } else {
      const res = await fetch(`${apiUrl}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
      if (!res.ok) throw new Error('Erro ao adicionar aluno');
    }
    alunoForm.reset();
    formTitle.textContent = 'Adicionar Aluno';
    cancelEditBtn.style.display = 'none';
    editAlunoId = null;
    listarAlunos();
  } catch (error) {
    alert('Erro ao salvar aluno');
    console.error(error);
  }
});

carregarCursos().then(() => {
  listarAlunos();
});
