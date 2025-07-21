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
  { nome: "Dr. Ana", tipo: "medico", aprovado: true, email: "ana@exemplo.com", senha: "123", crm: "12345", especialidade: "Cardiologia", telefone: "(11) 9999-9999" },
  { nome: "Admin", tipo: "gestor", aprovado: true, email: "admin@exemplo.com", senha: "123", telefone: "(11) 8888-8888" },
  { nome: "Dr. Bruno", tipo: "medico", aprovado: false, email: "bruno@exemplo.com", senha: "123", crm: "67890", especialidade: "Pediatria", telefone: "(11) 7777-7777" }
];

// Login com e-mail e senha
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  
  const user = medicos.find((m) => m.email === email && m.senha === senha);
  if (!user) return showToast("E-mail ou senha incorretos.");
  if (!user.aprovado) return showToast("Acesso pendente de aprovação.");

  perfil = user.tipo;
  usuario = user.nome;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("tabs").classList.remove("hidden");
  document.getElementById("searchContainer").classList.remove("hidden");
  document.getElementById("addPatientBtn").classList.remove("hidden");
  document.getElementById("menuBtn").classList.remove("hidden");
  document.getElementById("menuUserName").textContent = usuario;
  
  if (perfil === "medico" || perfil === "gestor") {
    document.getElementById("encerrarBtn").classList.remove("hidden");
  }
  
  if (perfil === "gestor") {
    document.querySelector(".gestor-only").classList.remove("hidden");
  }

  renderPatients("ativos");
  atualizarBadges();
});

// Menu lateral
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("sideMenu").classList.toggle("hidden");
});

document.getElementById("menuSair").addEventListener("click", () => {
  perfil = null;
  usuario = null;
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("tabs").classList.add("hidden");
  document.getElementById("searchContainer").classList.add("hidden");
  document.getElementById("addPatientBtn").classList.add("hidden");
  document.getElementById("encerrarBtn").classList.add("hidden");
  document.getElementById("sideMenu").classList.add("hidden");
  document.getElementById("menuBtn").classList.add("hidden");
});

document.getElementById("menuPerfil").addEventListener("click", (e) => {
  e.preventDefault();
  abrirPerfil();
});

document.getElementById("menuAssinatura").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("modalAssinatura").style.display = "flex";
});

// Alternar tema claro/escuro
function alternarTema() {
  temaAtual = temaAtual === "light" ? "dark" : "light";
  document.body.className = temaAtual;
  renderPatients("config");
}

// Atualizar badges
function atualizarBadges() {
  const ativos = pacientes.filter(p => p.status === 'ativos').length;
  const altas = pacientes.filter(p => p.status === 'altas').length;
  const historico = plantaoHistorico.length;

  document.getElementById("badgeAtivos").textContent = ativos;
  document.getElementById("badgeAltas").textContent = altas;
  document.getElementById("badgeHistorico").textContent = historico;
}

// Renderização principal por aba
function renderPatients(tab) {
  const container = document.getElementById("patientList");
  container.innerHTML = "";

  // Mostra ou esconde a barra de busca conforme a aba
  const showSearch = tab !== "config";
  document.getElementById("searchContainer").classList.toggle("hidden", !showSearch);

  if (tab === "config") return renderConfig();
  if (tab === "historico") return renderHistorico();

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
          `<div class="anotacao">📝 <strong>${a.autor}</strong> (${a.data})<br/>${a.texto}</div>`
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
        <div class="card-actions">
          <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
          <button onclick="editarPaciente('${p.nome}')">Editar</button>
          <button onclick="darAlta('${p.nome}')">Dar Alta</button>
        </div>
      `
          : ""
      }
    `;
    container.appendChild(card);
  });
}

// Renderizar histórico de plantões
function renderHistorico() {
  const container = document.getElementById("patientList");
  container.innerHTML = "";

  if (plantaoHistorico.length === 0) {
    container.innerHTML = "<p>Nenhum plantão encerrado.</p>";
    return;
  }

  plantaoHistorico.forEach((plantao, i) => {
    const bloco = document.createElement("div");
    bloco.className = "card";
    bloco.innerHTML = `
      <h2>Plantão #${i + 1} - ${plantao.data}</h2>
      <p>Médico: ${plantao.medico}</p>
      <p>Recebido por: ${plantao.destino}</p>
      <button class="btn-detalhes" onclick="verDetalhesPlantao(${i})">Ver detalhes</button>
    `;
    container.appendChild(bloco);
  });
}

// Ver detalhes do plantão
function verDetalhesPlantao(index) {
  const plantao = plantaoHistorico[index];
  const container = document.getElementById("patientList");
  container.innerHTML = `
    <button class="btn-voltar" onclick="renderPatients('historico')">← Voltar</button>
    <div class="card">
      <h2>Plantão #${index + 1} - ${plantao.data}</h2>
      <p>Médico: ${plantao.medico}</p>
      <p>Recebido por: ${plantao.destino}</p>
      <h3>Pacientes com alta:</h3>
  `;
  
  plantao.altas.forEach((p) => {
    container.innerHTML += `
      <div class="card">
        <h4>${p.nome}</h4>
        <p>Setor: ${p.setor}</p>
        <p>Descrição: ${p.descricao}</p>
        <h5>Anotações:</h5>
        <ul>
          ${p.anotacoes.map(a => `<li><strong>${a.autor}</strong> (${a.data}): ${a.texto}</li>`).join('')}
        </ul>
      </div>
    `;
  });
  
  container.innerHTML += `</div>`;
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
document.getElementById("searchInput").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const tabAtiva = document.querySelector(".tab.active").dataset.tab;
  
  if (tabAtiva === "historico") {
    renderHistorico();
    return;
  }
  
  const container = document.getElementById("patientList");
  container.innerHTML = "";
  
  const listaFiltrada = pacientes
    .filter(p => p.status === tabAtiva && (
      p.nome.toLowerCase().includes(termo) ||
      p.setor.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo)
    ))
    .sort((a, b) => b.criadoEm - a.criadoEm);
  
  if (listaFiltrada.length === 0) {
    container.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }
  
  listaFiltrada.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const anotacoesHTML = p.anotacoes
      .map(a => `<div class="anotacao">📝 <strong>${a.autor}</strong> (${a.data})<br/>${a.texto}</div>`)
      .join("");
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p><span class="tag">${p.setor}</span></p>
      <div class="card-descricao">${p.descricao}</div>
      ${anotacoesHTML}
      ${p.status === "ativos" && (perfil === "medico" || perfil === "gestor") ? `
        <div class="card-actions">
          <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
          <button onclick="editarPaciente('${p.nome}')">Editar</button>
          <button onclick="darAlta('${p.nome}')">Dar Alta</button>
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
});

// Modal paciente
document.getElementById("addPatientBtn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modalTitulo").textContent = "Novo Paciente";
  document.getElementById("nomePaciente").value = "";
  document.getElementById("setorPaciente").value = "";
  document.querySelector("input[name='status'][value='ativos']").checked = true;
  document.getElementById("descricaoPaciente").value = "";
});

document.getElementById("fecharModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("salvarPaciente").addEventListener("click", () => {
  const nome = document.getElementById("nomePaciente").value.trim();
  const setor = document.getElementById("setorPaciente").value.trim();
  const status = document.querySelector("input[name='status']:checked").value;
  const desc = document.getElementById("descricaoPaciente").value.trim();

  if (!nome || !setor || !desc) return showToast("Preencha todos os campos.");

  // Se estiver editando
  const pacienteExistente = pacientes.findIndex(p => p.nome === nome);
  if (pacienteExistente !== -1) {
    pacientes[pacienteExistente] = {
      ...pacientes[pacienteExistente],
      setor,
      status,
      descricao: desc,
      criadoEm: Date.now()
    };
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

  document.getElementById("modal").style.display = "none";
  renderPatients(status);
  atualizarBadges();
  showToast("Paciente salvo com sucesso.");
});

// Modal anotação
function abrirNota(nome) {
  const paciente = pacientes.find((p) => p.nome === nome);
  if (!paciente) return;
  window.anotando = paciente;
  document.getElementById("notaTitulo").textContent = `Anotação: ${nome}`;
  document.getElementById("notaInfo").textContent = `Data: ${new Date().toLocaleString("pt-BR")} | Médico: ${usuario}`;
  document.getElementById("novaNota").value = "";
  document.getElementById("modalNota").style.display = "flex";
}

function fecharNota() {
  document.getElementById("modalNota").style.display = "none";
}

document.getElementById("salvarNota").addEventListener("click", () => {
  const texto = document.getElementById("novaNota").value.trim();
  if (!texto || !window.anotando) return showToast("Digite uma anotação.");
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
  document.querySelector(`input[name='status'][value='${paciente.status}']`).checked = true;
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
  atualizarBadges();
  showToast("Paciente em alta.");
}

// Encerrar plantão
document.getElementById("encerrarBtn").addEventListener("click", () => {
  document.getElementById("assinaturaUser").textContent = usuario;
  document.getElementById("dataAssinatura").textContent = new Date().toLocaleString("pt-BR");
  document.getElementById("modalEncerrar").style.display = "flex";
});

function fecharEncerrar() {
  document.getElementById("modalEncerrar").style.display = "none";
}

function confirmarEncerramento() {
  const pend = document.getElementById("checkPendencias").checked;
  const obs = document.getElementById("checkObservacoes").checked;
  const laudos = document.getElementById("checkLaudos").checked;
  const destino = document.getElementById("medicoDestino").value;

  if (!pend || !obs || !laudos) return showToast("Complete o checklist.");

  const altas = pacientes.filter((p) => p.status === "altas");
  plantaoHistorico.push({
    data: new Date().toLocaleString("pt-BR"),
    medico: usuario,
    destino,
    altas: JSON.parse(JSON.stringify(altas))
  });

  pacientes = pacientes.filter((p) => p.status !== "altas");

  document.getElementById("modalEncerrar").style.display = "none";
  renderPatients("ativos");
  atualizarBadges();
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
  card.innerHTML = `
    <h2>${usuario} (${perfil})</h2>
    <button onclick="alternarTema()">Tema: ${temaAtual}</button>
  `;
  c.appendChild(card);

  if (perfil === "gestor") {
    const ul = document.createElement("ul");
    ul.className = "user-list";
    medicos.forEach((m, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${m.nome} [${m.tipo}] - ${m.aprovado ? "✔️" : "⏳"}</span>
        <span class="user-actions">
          ${!m.aprovado ? `<button onclick="aprovar(${i})">Aprovar</button>` : ""}
          <button onclick="toggleRole(${i})">Alterar Função</button>
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
  if (medicos[i].nome === usuario) return showToast("Você não pode se excluir.");
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

// Perfil
function abrirPerfil() {
  const user = medicos.find(m => m.nome === usuario);
  if (user) {
    document.getElementById("nomePerfil").value = user.nome;
    document.getElementById("crmPerfil").value = user.crm || '';
    document.getElementById("especialidadePerfil").value = user.especialidade || '';
    document.getElementById("emailPerfil").value = user.email || '';
    document.getElementById("telefonePerfil").value = user.telefone || '';
    document.getElementById("modalPerfil").style.display = "flex";
  }
}

function fecharPerfil() {
  document.getElementById("modalPerfil").style.display = "none";
}

document.getElementById("formPerfil").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nomePerfil").value.trim();
  const crm = document.getElementById("crmPerfil").value.trim();
  const especialidade = document.getElementById("especialidadePerfil").value.trim();
  const email = document.getElementById("emailPerfil").value.trim();
  const telefone = document.getElementById("telefonePerfil").value.trim();

  const userIndex = medicos.findIndex(m => m.nome === usuario);
  if (userIndex !== -1) {
    medicos[userIndex].nome = nome;
    medicos[userIndex].crm = crm;
    medicos[userIndex].especialidade = especialidade;
    medicos[userIndex].email = email;
    medicos[userIndex].telefone = telefone;
    usuario = nome;
    document.getElementById("menuUserName").textContent = nome;
    fecharPerfil();
    showToast("Perfil atualizado.");
  }
});

// Assinatura
function fecharAssinatura() {
  document.getElementById("modalAssinatura").style.display = "none";
}

function mostrarPlanos() {
  document.getElementById("planosContainer").classList.toggle("hidden");
}

// Canvas assinatura
const canvas = document.getElementById("canvasAssinatura");
const ctx = canvas.getContext("2d");
let desenhando = false;
let lastX = 0;
let lastY = 0;

ctx.strokeStyle = "#000";
ctx.lineWidth = 2;

canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", (e) => {
  if (!desenhando) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => desenhando = false);
canvas.addEventListener("mouseout", () => desenhando = false);

document.getElementById("limparAssinatura").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Inicialização
document.body.className = temaAtual;