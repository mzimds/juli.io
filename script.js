let perfil = null;
let usuario = null;
let temaAtual = "light";

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

let plantaoHistorico = [];

function login(nome, tipo) {
  usuario = nome;
  perfil = tipo;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("tabs").classList.remove("hidden");
  document.getElementById("searchContainer").classList.remove("hidden");
  document.getElementById("addPatientBtn").classList.remove("hidden");

  if (perfil === "medico") {
    document.getElementById("encerrarBtn").classList.remove("hidden");
  }

  renderPatients("ativos");
}

function renderPatients(tab) {
  const container = document.getElementById("patientList");
  container.innerHTML = "";

  if (tab === "config") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>Perfil do Usuário</h2>
      <p><strong>Nome:</strong> ${usuario}</p>
      <p><strong>Tipo:</strong> ${perfil}</p>
      <hr />
      <h3>Preferências</h3>
      <button onclick="alternarTema()">Tema: ${temaAtual === "dark" ? "🌙 Escuro" : "☀️ Claro"}</button>
    `;
    container.appendChild(card);
    return;
  }

  if (tab === "historico") {
    if (plantaoHistorico.length === 0) {
      container.innerHTML = "<p>Nenhum plantão encerrado.</p>";
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
                  `<li><strong>${a.autor}</strong> (${a.data}): ${a.texto}</li>`
              )
              .join("")}
          </ul>
        `;
      });
      container.appendChild(bloco);
    });
    return;
  }

  const lista = pacientes
    .filter((p) => p.status === tab)
    .sort((a, b) => b.criadoEm - a.criadoEm);

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum paciente encontrado.</p>";
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
    container.appendChild(card);
  });
}

function alternarTema() {
  temaAtual = temaAtual === "light" ? "dark" : "light";
  document.body.className = temaAtual;
  renderPatients("config");
}

function renderCurrentTab() {
  const aba = document.querySelector(".tab.active").dataset.tab;
  renderPatients(aba);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.remove("active")
    );
    tab.classList.add("active");
    renderCurrentTab();
  });
});

document.getElementById("searchInput").addEventListener("input", () => {
  renderCurrentTab();
});

document.getElementById("addPatientBtn").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  document.getElementById("modalTitulo").textContent = "Novo Paciente";
  document.getElementById("nomePaciente").value = "";
  document.getElementById("setorPaciente").value = "";
  document.getElementById("statusPaciente").value = "ativos";
  document.getElementById("descricaoPaciente").value = "";
});

document.getElementById("fecharModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("salvarPaciente").addEventListener("click", () => {
  const nome = document.getElementById("nomePaciente").value.trim();
  const setor = document.getElementById("setorPaciente").value.trim();
  const status = document.getElementById("statusPaciente").value;
  const desc = document.getElementById("descricaoPaciente").value.trim();

  if (!nome || !setor || !desc) return alert("Preencha todos os campos.");

  pacientes.push({
    nome,
    setor,
    status,
    descricao: desc,
    criadoEm: Date.now(),
    anotacoes: []
  });

  document.getElementById("modal").style.display = "none";
  renderCurrentTab();
  showToast("Paciente salvo com sucesso.");
});

function abrirNota(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  window.anotando = paciente;
  document.getElementById("novaNota").value = "";
  document.getElementById("modalNota").style.display = "flex";
}

function fecharNota() {
  document.getElementById("modalNota").style.display = "none";
}

document.getElementById("salvarNota").addEventListener("click", () => {
  const texto = document.getElementById("novaNota").value.trim();
  if (!texto || !window.anotando) return;
  window.anotando.anotacoes.push({
    texto,
    autor: usuario,
    data: new Date().toLocaleString("pt-BR")
  });
  window.anotando.criadoEm = Date.now();
  document.getElementById("modalNota").style.display = "none";
  renderCurrentTab();
  showToast("Anotação salva.");
});

function editarPaciente(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  document.getElementById("modalTitulo").textContent = "Editar Paciente";
  document.getElementById("nomePaciente").value = paciente.nome;
  document.getElementById("setorPaciente").value = paciente.setor;
  document.getElementById("statusPaciente").value = paciente.status;
  document.getElementById("descricaoPaciente").value = paciente.descricao;
  document.getElementById("modal").style.display = "flex";
}

function darAlta(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  paciente.status = "altas";
  paciente.criadoEm = Date.now();
  renderCurrentTab();
  showToast("Paciente em alta.");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
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

  pacientes = pacientes.filter((p) => p.status !== "altas");

  document.getElementById("modalEncerrar").style.display = "none";
  renderCurrentTab();
  showToast("Plantão encerrado e passado para " + medicoDestino);
}

document.body.className = temaAtual;
