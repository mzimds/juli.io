let perfil = null;
let pacientes = [];
let logs = [];
let plantaoHistorico = [];
let editando = null;
let anotando = null;

const tabs = document.querySelectorAll('.tab');
const patientList = document.getElementById('patientList');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('addPatientBtn');
const salvarBtn = document.getElementById('salvarPaciente');
const fecharBtn = document.getElementById('fecharModal');
const fab = document.getElementById('addPatientBtn');
const fabEncerrar = document.getElementById('encerrarBtn');
const toast = document.getElementById('toast');
const tabsNav = document.getElementById('tabs');
const searchContainer = document.getElementById('searchContainer');
const modalTitulo = document.getElementById('modalTitulo');

const nomeInput = document.getElementById('nomePaciente');
const setorInput = document.getElementById('setorPaciente');
const statusInput = document.getElementById('statusPaciente');
const descInput = document.getElementById('descricaoPaciente');

const modalNota = document.getElementById('modalNota');
const salvarNota = document.getElementById('salvarNota');
const novaNota = document.getElementById('novaNota');

const modalEncerrar = document.getElementById('modalEncerrar');
const checkPendencias = document.getElementById('checkPendencias');
const checkObservacoes = document.getElementById('checkObservacoes');
const medicoDestino = document.getElementById('medicoDestino');
const assinaturaUser = document.getElementById('assinaturaUser');

function login(tipo) {
  perfil = tipo;
  document.querySelector('.login-select').classList.add('hidden');
  tabsNav.classList.remove('hidden');
  searchContainer.classList.remove('hidden');
  fab.classList.remove('hidden');
  if (perfil === 'medico') fabEncerrar.classList.remove('hidden');
  renderPatients("ativos");
}

function renderPatients(status, filter = "") {
  patientList.innerHTML = "";
  if (status === "historico") {
    if (plantaoHistorico.length === 0) {
      patientList.innerHTML = "<p>Nenhum plantão encerrado ainda.</p>";
      return;
    }
    plantaoHistorico.forEach((plantao, idx) => {
      const bloco = document.createElement("div");
      bloco.className = "card";
      bloco.innerHTML = `<h2>Plantão #${idx + 1} — ${plantao.data}</h2>`;
      plantao.pacientes.forEach(p => {
        bloco.innerHTML += `
          <hr>
          <p><strong>${p.nome}</strong> - ${p.setor}</p>
          <p>${p.descricao}</p>
          <ul>${plantao.logs
            .filter(l => l.includes(p.nome))
            .map(l => `<li>${l}</li>`)
            .join("")}</ul>
        `;
      });
      patientList.appendChild(bloco);
    });
    return;
  }

  const lista = pacientes.filter(p =>
    p.status === status &&
    p.nome.toLowerCase().includes(filter.toLowerCase())
  );
  if (lista.length === 0) {
    patientList.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p><span class="tag">${p.setor}</span></p>
      <p>${p.descricao}</p>
      ${p.status === "ativos" && perfil === "medico" ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button class="btn-alta" onclick="darAlta('${p.nome}')">Dar Alta</button>
      ` : ""}
    `;
    patientList.appendChild(card);
  });
}

function dataAgora() {
  return new Date().toLocaleString("pt-BR");
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

function editarPaciente(nome) {
  const paciente = pacientes.find(p => p.nome === nome && p.status === "ativos");
  if (!paciente) return;
  editando = paciente;
  nomeInput.value = paciente.nome;
  setorInput.value = paciente.setor;
  statusInput.value = paciente.status;
  descInput.value = paciente.descricao;
  modalTitulo.textContent = "Editar Paciente";
  modal.style.display = "flex";
}

function abrirNota(nome) {
  anotando = pacientes.find(p => p.nome === nome);
  novaNota.value = "";
  modalNota.style.display = "flex";
}

function fecharNota() {
  modalNota.style.display = "none";
}

salvarNota.addEventListener("click", () => {
  const texto = novaNota.value.trim();
  if (texto && anotando) {
    anotando.descricao += "\n🔹 " + texto;
    logs.push(`Anotação adicionada em ${dataAgora()} para ${anotando.nome}`);
    renderPatients("ativos");
    modalNota.style.display = "none";
    showToast("Anotação salva");
  }
});

salvarBtn.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const setor = setorInput.value.trim();
  const status = statusInput.value;
  const desc = descInput.value.trim();

  if (!nome || !setor || !desc) return alert("Preencha todos os campos obrigatórios.");

  if (editando) {
    editando.nome = nome;
    editando.setor = setor;
    editando.status = status;
    editando.descricao = desc;
    logs.push(`Paciente ${nome} editado em ${dataAgora()}`);
    editando = null;
  } else {
    pacientes.push({ nome, status, setor, descricao: desc });
    logs.push(`Paciente ${nome} adicionado em ${dataAgora()}`);
  }

  modal.style.display = "none";
  nomeInput.value = setorInput.value = descInput.value = "";
  renderCurrentTab();
  showToast("Paciente salvo");
});

addBtn.addEventListener("click", () => {
  modalTitulo.textContent = "Novo Paciente";
  nomeInput.value = setorInput.value = descInput.value = "";
  editando = null;
  modal.style.display = "flex";
});

fecharBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderCurrentTab();
  });
});

searchInput.addEventListener("input", () => {
  renderCurrentTab();
});

function renderCurrentTab() {
  const aba = document.querySelector(".tab.active").dataset.tab;
  renderPatients(aba, searchInput.value);
}

function darAlta(nome) {
  const paciente = pacientes.find(p => p.nome === nome);
  if (paciente) {
    paciente.status = "altas";
    logs.push(`Alta dada em ${dataAgora()} para ${paciente.nome}`);
    renderCurrentTab();
    showToast("Paciente em alta");
  }
}

fabEncerrar.addEventListener("click", () => {
  assinaturaUser.textContent = "Dr. Login (" + perfil + ")";
  checkPendencias.checked = false;
  checkObservacoes.checked = false;
  modalEncerrar.style.display = "flex";
});

function fecharEncerrar() {
  modalEncerrar.style.display = "none";
}

function confirmarEncerramento() {
  if (!checkPendencias.checked || !checkObservacoes.checked) {
    alert("Checklist incompleto");
    return;
  }

  const pacientesDoPlantao = pacientes.filter(p => p.status === "ativos");
  if (pacientesDoPlantao.length === 0) return alert("Nenhum paciente ativo");

  pacientesDoPlantao.forEach(p => p.status = "historico");

  plantaoHistorico.push({
    data: dataAgora(),
    medico: perfil,
    pacientes: JSON.parse(JSON.stringify(pacientesDoPlantao)),
    logs: [...logs]
  });

  logs.push(`Plantão encerrado por ${perfil} e passado para ${medicoDestino.value} em ${dataAgora()}`);

  modalEncerrar.style.display = "none";
  renderCurrentTab();
  showToast("Plantão encerrado");
}
