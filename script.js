const tabs = document.querySelectorAll('.tab');
const patientList = document.getElementById('patientList');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const addBtn = document.getElementById('addPatientBtn');
const salvarBtn = document.getElementById('salvarPaciente');
const fecharBtn = document.getElementById('fecharModal');
const fab = document.getElementById('addPatientBtn');
const toast = document.getElementById('toast');

const nomeInput = document.getElementById('nomePaciente');
const setorInput = document.getElementById('setorPaciente');
const statusInput = document.getElementById('statusPaciente');
const descInput = document.getElementById('descricaoPaciente');

const historicoModal = document.getElementById('modalHistorico');
const logList = document.getElementById('logList');
const fecharHistorico = document.getElementById('fecharHistorico');

const modalNota = document.getElementById('modalNota');
const salvarNota = document.getElementById('salvarNota');
const novaNota = document.getElementById('novaNota');

let pacientes = [
  { nome: "João da Silva", status: "ativos", setor: "Clínica Médica", descricao: "Paciente com queixa de dor abdominal crônica." },
  { nome: "Maria Souza", status: "altas", setor: "UTI", descricao: "Pós-operatório estável. Alta prevista." },
  { nome: "Carlos Lima", status: "historico", setor: "Ortopedia", descricao: "Tratamento de fratura finalizado." }
];

let logs = [];
let editando = null;
let anotando = null;

function renderPatients(status, filter = "") {
  patientList.innerHTML = "";
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
      ${p.status === "ativos" ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button class="btn-alta" onclick="darAlta('${p.nome}')">Dar Alta</button>
      ` : ""}
    `;
    patientList.appendChild(card);
  });

  fab.classList.toggle('hidden', status === 'historico');
}

function darAlta(nome) {
  const paciente = pacientes.find(p => p.nome === nome && p.status === "ativos");
  if (paciente) {
    paciente.status = "altas";
    logs.push(`Alta registrada para ${nome} em ${dataAgora()}`);
    showToast("Paciente transferido para alta.");
    renderCurrentTab();
  }
}

function editarPaciente(nome) {
  const paciente = pacientes.find(p => p.nome === nome && p.status === "ativos");
  if (!paciente) return;

  editando = paciente;
  modalTitulo.textContent = "Editar Paciente";
  nomeInput.value = paciente.nome;
  setorInput.value = paciente.setor;
  statusInput.value = paciente.status;
  descInput.value = paciente.descricao;
  modal.style.display = "flex";
}

function abrirNota(nome) {
  anotando = pacientes.find(p => p.nome === nome && p.status === "ativos");
  if (anotando) {
    novaNota.value = "";
    modalNota.style.display = "flex";
  }
}

function fecharNota() {
  modalNota.style.display = "none";
}

salvarNota.addEventListener("click", () => {
  const texto = novaNota.value.trim();
  if (texto && anotando) {
    anotando.descricao += "\n🔹 " + texto;
    logs.push(`Nova anotação para ${anotando.nome} em ${dataAgora()}`);
    modalNota.style.display = "none";
    renderCurrentTab();
    showToast("Anotação adicionada.");
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
    logs.push(`Edição do paciente ${nome} em ${dataAgora()}`);
    editando = null;
  } else {
    pacientes.push({ nome, status, setor, descricao: desc });
    logs.push(`Novo paciente ${nome} adicionado em ${dataAgora()}`);
  }

  modal.style.display = "none";
  nomeInput.value = setorInput.value = descInput.value = "";
  renderCurrentTab();
  showToast("Salvo com sucesso.");
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

fecharHistorico.addEventListener("click", () => {
  historicoModal.style.display = "none";
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const current = tab.dataset.tab;
    if (current === "historico") {
      renderLogs();
      historicoModal.style.display = "flex";
    } else {
      renderPatients(current, searchInput.value);
    }
  });
});

searchInput.addEventListener("input", () => {
  renderCurrentTab();
});

function renderCurrentTab() {
  const aba = document.querySelector(".tab.active").dataset.tab;
  renderPatients(aba, searchInput.value);
}

function renderLogs() {
  logList.innerHTML = logs.map(entry => `<li>${entry}</li>`).join("");
}

function dataAgora() {
  const d = new Date();
  return d.toLocaleString("pt-BR");
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

renderPatients("ativos");
