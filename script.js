const tabs = document.querySelectorAll('.tab');
const patientList = document.getElementById('patientList');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('addPatientBtn');
const salvarBtn = document.getElementById('salvarPaciente');
const fecharBtn = document.getElementById('fecharModal');
const toast = document.getElementById('toast');

const nomeInput = document.getElementById('nomePaciente');
const setorInput = document.getElementById('setorPaciente');
const statusInput = document.getElementById('statusPaciente');
const descInput = document.getElementById('descricaoPaciente');

let pacientes = [
  { nome: "João da Silva", status: "ativos", setor: "Clínica Médica" },
  { nome: "Maria Souza", status: "altas", setor: "UTI" },
  { nome: "Carlos Lima", status: "historico", setor: "Ortopedia" }
];

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
      ${p.status === "ativos" ? `<button class="btn-alta" onclick="darAlta('${p.nome}')">Dar Alta</button>` : ""}
    `;
    patientList.appendChild(card);
  });
}

function darAlta(nome) {
  const paciente = pacientes.find(p => p.nome === nome && p.status === "ativos");
  if (paciente) {
    paciente.status = "altas";
    const tabAtiva = document.querySelector(".tab.active").dataset.tab;
    renderPatients(tabAtiva, searchInput.value);
    showToast("Paciente transferido para alta.");
  }
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

fecharBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

salvarBtn.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const setor = setorInput.value.trim();
  const status = statusInput.value;
  const desc = descInput.value.trim();

  if (!nome || !setor) return alert("Preencha todos os campos obrigatórios.");

  pacientes.push({ nome, status, setor, descricao: desc });
  modal.style.display = "none";
  nomeInput.value = setorInput.value = descInput.value = "";
  const abaAtual = document.querySelector(".tab.active").dataset.tab;
  renderPatients(abaAtual, searchInput.value);
  showToast("Paciente adicionado.");
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const tabKey = tab.dataset.tab;
    renderPatients(tabKey, searchInput.value);
  });
});

searchInput.addEventListener("input", () => {
  const aba = document.querySelector(".tab.active").dataset.tab;
  renderPatients(aba, searchInput.value);
});

// Inicialização
renderPatients("ativos");
