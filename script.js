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

let medicos = [
  { nome: "Dr. Ana", tipo: "medico", aprovado: true },
  { nome: "Admin", tipo: "gestor", aprovado: true },
  { nome: "Dr. Bruno", tipo: "medico", aprovado: false }
];

// Login com validação de aprovação
function login(nome, tipo) {
  const user = medicos.find((m) => m.nome === nome && m.tipo === tipo);
  if (!user) return alert("Usuário não encontrado.");
  if (!user.aprovado) return alert("Acesso pendente de aprovação.");

  perfil = user.tipo;
  usuario = user.nome;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("tabs").classList.remove("hidden");
  document.getElementById("searchContainer").classList.remove("hidden");
  document.getElementById("addPatientBtn").classList.remove("hidden");
  if (perfil === "medico" || perfil === "gestor")
    document.getElementById("encerrarBtn").classList.remove("hidden");

  renderPatients("ativos");
}

// Alternar tema claro/escuro
function alternarTema() {
  temaAtual = temaAtual === "light" ? "dark" : "light";
  document.body.className = temaAtual;
  renderPatients("config");
}

// Renderização principal por aba
function renderPatients(tab) {
  const container = document.getElementById("patientList");
  container.innerHTML = "";

 // Mostra ou esconde a barra de busca conforme a aba
  const showSearch = tab !== "config";
  document.getElementById("searchContainer").classList.toggle("hidden", !showSearch);

  if (tab === "config") return renderConfig();

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
        p.status === "ativos" && (perfil === "medico" || perfil === "gestor")
          ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button onclick="darAlta('${p.nome}')">Dar Alta</button>
      `
          : ""
      }
    `;
    container.appendChild(card);
  });
}

// Tabs
document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.remove("active")
    );
    tab.classList.add("active");
    renderPatients(tab.dataset.tab);
  })
);

// Buscar pacientes
document.getElementById("searchInput").addEventListener("input", () => {
  renderPatients(document.querySelector(".tab.active").dataset.tab);
});

// Modal paciente
document.getElementById("addPatientBtn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
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
  renderPatients("ativos");
  showToast("Paciente salvo com sucesso.");
});

// Modal anotação
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
  renderPatients("ativos");
  showToast("Anotação salva.");
});

// Editar paciente
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

// Alta
function darAlta(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  paciente.status = "altas";
  paciente.criadoEm = Date.now();
  renderPatients("ativos");
  showToast("Paciente em alta.");
}

// Encerrar plantão
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
  const destino = document.getElementById("medicoDestino").value;

  if (!pend || !obs) return alert("Checklist incompleto");

  const altas = pacientes.filter((p) => p.status === "altas");
  plantaoHistorico.push({
    data: new Date().toLocaleString("pt-BR"),
    medico: usuario,
    altas: JSON.parse(JSON.stringify(altas))
  });

  pacientes = pacientes.filter((p) => p.status !== "altas");

  document.getElementById("modalEncerrar").style.display = "none";
  renderPatients("ativos");
  showToast("Plantão encerrado.");
}

// Toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

// Painel de configurações
function renderConfig() {
  const c = document.getElementById("patientList");
  c.innerHTML = "";

  const divLink = document.createElement("div");
  divLink.className = "config-link";
  divLink.innerHTML = `
    <input id="inviteLink" readonly value="memo.com/SETOR123/login"/>
    <button onclick="copiarLink()">📋</button>
    <button onclick="compartilhar()">🔗</button>
  `;
  c.appendChild(divLink);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h2>${usuario} (${perfil})</h2><button onclick="alternarTema()">Tema: ${temaAtual}</button>`;
  c.appendChild(card);

  if (perfil === "gestor") {
    const ul = document.createElement("ul");
    ul.className = "user-list";
    medicos.forEach((m, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${m.nome} [${m.tipo}] - ${m.aprovado ? "✔️" : "⏳"}</span>
        <span class="user-actions">
          ${!m.aprovado ? `<button onclick="aprovar(${i})">Aprovar</button>` : ""}
          <button onclick="toggleRole(${i})">Role</button>
          <button onclick="remover(${i})">Excluir</button>
        </span>`;
      ul.appendChild(li);
    });
    c.appendChild(ul);
  }
}

function aprovar(i) {
  medicos[i].aprovado = true;
  renderConfig();
  showToast("Médico aprovado");
}
function toggleRole(i) {
  medicos[i].tipo = medicos[i].tipo === "medico" ? "gestor" : "medico";
  renderConfig();
  showToast("Função alterada");
}
function remover(i) {
  if (medicos[i].nome === usuario) return alert("Você não pode se excluir.");
  medicos.splice(i, 1);
  renderConfig();
  showToast("Médico excluído");
}

// Copiar e compartilhar
function copiarLink() {
  const txt = document.getElementById("inviteLink");
  txt.select();
  document.execCommand("copy");
  showToast("Link copiado!");
}
function compartilhar() {
  const url = document.getElementById("inviteLink").value;
  navigator.share?.({ title: "Convite MEMO", url }) ||
    alert("Navegador não suporta compartilhamento.");
}

// Inicialização
document.body.className = temaAtual;
