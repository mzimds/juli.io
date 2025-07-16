let perfil = null;
let usuario = null;

let pacientes = [
  {
    nome: "João da Silva",
    status: "ativos",
    setor: "Clínica Médica",
    descricao: "Dor abdominal crônica.",
    criadoEm: Date.now() - 60000,
    anotacoes: []
  },
  {
    nome: "Maria Souza",
    status: "altas",
    setor: "UTI",
    descricao: "Alta após cirurgia cardíaca.",
    criadoEm: Date.now() - 300000,
    anotacoes: [
      {
        texto: "Paciente em recuperação, retirar pontos amanhã.",
        autor: "Dr. Ana",
        data: new Date(Date.now() - 290000).toLocaleString("pt-BR")
      }
    ]
  }
];

let logs = [];
let plantaoHistorico = [];
let editando = null;
let anotando = null;

const tabs = document.querySelectorAll(".tab");
const patientList = document.getElementById("patientList");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalNota = document.getElementById("modalNota");
const novaNota = document.getElementById("novaNota");
const salvarNota = document.getElementById("salvarNota");
const toast = document.getElementById("toast");

function login(nome, tipo) {
  perfil = tipo;
  usuario = nome;
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("tabs").classList.remove("hidden");
  document.getElementById("searchContainer").classList.remove("hidden");
  document.getElementById("addPatientBtn").classList.remove("hidden");
  if (perfil === "medico")
    document.getElementById("encerrarBtn").classList.remove("hidden");
  renderPatients("ativos");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
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

function renderPatients(status, filtro = "") {
  patientList.innerHTML = "";

  if (status === "historico") {
    if (plantaoHistorico.length === 0) {
      patientList.innerHTML = "<p>Nenhum plantão encerrado.</p>";
      return;
    }
    plantaoHistorico.forEach((plantao, i) => {
      const bloco = document.createElement("div");
      bloco.className = "card";
      bloco.innerHTML = `<h2>Plantão #${i + 1} - ${plantao.data}</h2>`;
      plantao.altas.forEach((p) => {
        bloco.innerHTML += `
          <p><strong>${p.nome}</strong> - ${p.setor}</p>
          <p>${p.descricao}</p>
          <ul>
            ${p.anotacoes
              .map(
                (a) =>
                  `<li><strong>${a.autor}</strong> em ${a.data}: ${a.texto}</li>`
              )
              .join("")}
          </ul>
        `;
      });
      patientList.appendChild(bloco);
    });
    return;
  }

  if (status === "config") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>Perfil do Usuário</h2>
      <p><strong>Nome:</strong> ${usuario}</p>
      <p><strong>Tipo:</strong> ${perfil}</p>
      <hr />
      <h3>Preferências</h3>
      <p>Tema: Claro (mock)</p>
    `;
    patientList.appendChild(card);
    return;
  }

  const lista = pacientes
    .filter(
      (p) =>
        p.status === status &&
        p.nome.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => b.criadoEm - a.criadoEm);

  if (lista.length === 0) {
    patientList.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }

  lista.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    const anotacoesHTML = p.anotacoes
      .map(
        (a) =>
          `<div class="anotacoes">📝 <strong>${a.autor}</strong> (${a.data})<br/>${a.texto}</div>`
      )
      .join("");
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p><span class="tag">${p.setor}</span></p>
      <div class="card-descricao">${p.descricao}</div>
      ${anotacoesHTML}
      ${
        p.status === "ativos" && perfil === "medico"
          ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button class="btn-alta" onclick="darAlta('${p.nome}')">Dar Alta</button>
      `
          : ""
      }
    `;
    patientList.appendChild(card);
  });
}

document.getElementById("addPatientBtn").addEventListener("click", () => {
  document.getElementById("modalTitulo").textContent = "Novo Paciente";
  modal.style.display = "flex";
  editando = null;
  document.getElementById("nomePaciente").value = "";
  document.getElementById("setorPaciente").value = "";
  document.getElementById("statusPaciente").value = "ativos";
  document.getElementById("descricaoPaciente").value = "";
});

document.getElementById("fecharModal").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("salvarPaciente").addEventListener("click", () => {
  const nome = document.getElementById("nomePaciente").value.trim();
  const setor = document.getElementById("setorPaciente").value.trim();
  const status = document.getElementById("statusPaciente").value;
  const desc = document.getElementById("descricaoPaciente").value.trim();

  if (!nome || !setor || !desc) return alert("Preencha todos os campos.");

  if (editando) {
    editando.nome = nome;
    editando.setor = setor;
    editando.status = status;
    editando.descricao = desc;
    editando.criadoEm = Date.now();
  } else {
    pacientes.push({
      nome,
      setor,
      status,
      descricao: desc,
      criadoEm: Date.now(),
      anotacoes: []
    });
  }

  modal.style.display = "none";
  renderCurrentTab();
  showToast("Paciente salvo com sucesso.");
});

function editarPaciente(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  editando = paciente;
  document.getElementById("modalTitulo").textContent = "Editar Paciente";
  document.getElementById("nomePaciente").value = paciente.nome;
  document.getElementById("setorPaciente").value = paciente.setor;
  document.getElementById("statusPaciente").value = paciente.status;
  document.getElementById("descricaoPaciente").value = paciente.descricao;
  modal.style.display = "flex";
}

function abrirNota(nome) {
  anotando = pacientes.find((p) => p.nome === nome);
  novaNota.value = "";
  modalNota.style.display = "flex";
}

function fecharNota() {
  modalNota.style.display = "none";
}

salvarNota.addEventListener("click", () => {
  const texto = novaNota.value.trim();
  if (!texto || !anotando) return;
  anotando.anotacoes.push({
    texto,
    autor: usuario,
    data: new Date().toLocaleString("pt-BR")
  });
  anotando.criadoEm = Date.now();
  modalNota.style.display = "none";
  renderCurrentTab();
  showToast("Anotação salva.");
});

function darAlta(nome) {
  const p = pacientes.find((p) => p.nome === nome);
  if (!p) return;
  p.status = "altas";
  p.criadoEm = Date.now();
  renderCurrentTab();
  showToast("Paciente em alta.");
}

document.getElementById("encerrarBtn").addEventListener("click", () => {
  document.getElementById("assinaturaUser").textContent = usuario;
  document.getElementById("modalEncerrar").style.display = "flex";
});

function fecharEncerrar() {
  document.getElementById("modalEncerrar").style.display = "none";
}

function confirmarEncerramento() {
  const pend = document.getElementById("checkPendencias").checked;
  const obs = document.getElementById("checkObservacoes").checked;
  const medicoDestino = document.getElementById("medicoDestino").value;

  if (!pend || !obs) {
    alert("Checklist incompleto.");
    return;
  }

  const altas = pacientes.filter((p) => p.status === "altas");
  plantaoHistorico.push({
    data: new Date().toLocaleString("pt-BR"),
    medico: usuario,
    altas: JSON.parse(JSON.stringify(altas))
  });

  // Remove os pacientes de "altas", mas mantém os "ativos"
  pacientes = pacientes.filter((p) => p.status !== "altas");

  document.getElementById("modalEncerrar").style.display = "none";
  renderCurrentTab();
  showToast("Plantão encerrado e passado para " + medicoDestino);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

// Inicialização
renderPatients("ativos");
