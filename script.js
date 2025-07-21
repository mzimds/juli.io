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
  { nome: "Dr. Ana", tipo: "medico", aprovado: true, crm: "12345", especialidade: "Cardiologia", email: "ana@hospital.com", telefone: "(11) 9999-8888" },
  { nome: "Admin", tipo: "gestor", aprovado: true, email: "admin@hospital.com", telefone: "(11) 7777-6666" },
  { nome: "Dr. Bruno", tipo: "medico", aprovado: false, crm: "54321", especialidade: "Ortopedia", email: "bruno@hospital.com", telefone: "(11) 5555-4444" }
];

// Alternar entre login e cadastro
document.querySelectorAll(".toggle-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".toggle-option").forEach(opt => 
      opt.classList.remove("active"));
    option.classList.add("active");
    
    if(option.dataset.option === "login") {
      document.getElementById("loginForm").classList.remove("hidden");
      document.getElementById("signupForm").classList.add("hidden");
    } else {
      document.getElementById("signupForm").classList.remove("hidden");
      document.getElementById("loginForm").classList.add("hidden");
    }
  });
});

// Mostrar/ocultar CRM para médicos
document.getElementById("userTypeSignup").addEventListener("change", function() {
  document.getElementById("signupCRM").classList.toggle("hidden", this.value !== "medico");
});

// Login
function login() {
  const nome = document.getElementById("loginName").value.trim();
  const tipo = document.getElementById("userTypeLogin").value;
  
  const user = medicos.find(m => m.nome === nome && m.tipo === tipo);
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

  // Atualizar menu lateral
  document.getElementById("sidebarUserName").textContent = usuario;
  if(perfil === "gestor") {
    document.getElementById("menuSignature").classList.remove("hidden");
  }

  updateBadges();
  renderPatients("ativos");
}

// Cadastro
function signup() {
  const nome = document.getElementById("signupName").value.trim();
  const tipo = document.getElementById("userTypeSignup").value;
  const crm = tipo === "medico" ? document.getElementById("signupCRM").value.trim() : "";
  const email = document.getElementById("signupEmail").value.trim();
  const telefone = document.getElementById("signupPhone").value.trim();

  if (!nome || !email) return alert("Preencha os campos obrigatórios.");
  if (tipo === "medico" && !crm) return alert("CRM é obrigatório para médicos.");

  // Verificar se usuário já existe
  if(medicos.some(m => m.nome === nome)) {
    return alert("Usuário já cadastrado.");
  }

  medicos.push({
    nome,
    tipo,
    crm: tipo === "medico" ? crm : undefined,
    email,
    telefone,
    aprovado: tipo === "gestor" // Gestores são aprovados automaticamente
  });

  showToast(tipo === "gestor" ? "Conta criada com sucesso!" : "Solicitação enviada para aprovação.");
  
  // Voltar para login
  document.querySelector('[data-option="login"]').click();
  document.getElementById("loginName").value = nome;
  document.getElementById("userTypeLogin").value = tipo;
}

// Alternar tema claro/escuro
function alternarTema() {
  temaAtual = temaAtual === "light" ? "dark" : "light";
  document.body.className = temaAtual;
  renderPatients("config");
}

// Atualizar contadores
function updateBadges() {
  document.getElementById("ativosBadge").textContent = 
    pacientes.filter(p => p.status === "ativos").length;
    
  document.getElementById("altasBadge").textContent = 
    pacientes.filter(p => p.status === "altas").length;
    
  document.getElementById("historicoBadge").textContent = 
    plantaoHistorico.length;
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
      bloco.innerHTML = `
        <h2>Plantão #${i + 1} - ${plantao.data}</h2>
        <p><strong>Médico:</strong> ${plantao.medico}</p>
        <p><strong>Recebido por:</strong> ${plantao.destino}</p>
        <button class="ver-detalhes" data-index="${i}">Ver detalhes</button>
      `;
      container.appendChild(bloco);
    });
    
    // Adicionar eventos para ver detalhes
    document.querySelectorAll(".ver-detalhes").forEach(btn => {
      btn.addEventListener("click", function() {
        const index = parseInt(this.dataset.index);
        const plantao = plantaoHistorico[index];
        const detalhes = plantao.altas.map(p => `
          <div class="card">
            <h2>${p.nome}</h2>
            <p><strong>Setor:</strong> ${p.setor}</p>
            <p><strong>Descrição:</strong> ${p.descricao}</p>
            <h3>Anotações:</h3>
            <ul>
              ${p.anotacoes.map(a => `
                <li><strong>${a.autor}</strong> (${a.data}): ${a.texto}</li>
              `).join("")}
            </ul>
          </div>
        `).join("");
        
        container.innerHTML = `
          <div class="historico-header">
            <button onclick="renderPatients('historico')">← Voltar</button>
            <h2>Detalhes do Plantão #${index + 1}</h2>
          </div>
          <div class="plantao-info">
            <p><strong>Data:</strong> ${plantao.data}</p>
            <p><strong>Médico:</strong> ${plantao.medico}</p>
            <p><strong>Recebido por:</strong> ${plantao.destino}</p>
          </div>
          <h3>Pacientes com alta:</h3>
          ${detalhes}
        `;
      });
    });
    return;
  }

  const lista = pacientes
    .filter(p => p.status === tab)
    .sort((a, b) => b.criadoEm - a.criadoEm);

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const anotacoesHTML = p.anotacoes
      .map(a => `
        <div class="anotacoes">📝 <strong>${a.autor}</strong> (${a.data})<br/>${a.texto}</div>
      `).join("");
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p><span class="tag">${p.setor}</span></p>
      <div class="card-descricao">${p.descricao}</div>
      ${anotacoesHTML}
      ${p.status === "ativos" && (perfil === "medico" || perfil === "gestor") ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button onclick="darAlta('${p.nome}')">Dar Alta</button>
      ` : ""}
    `;
    container.appendChild(card);
  });
}

// Tabs
document.querySelectorAll(".tab").forEach(tab =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => 
      t.classList.remove("active"));
    tab.classList.add("active");
    renderPatients(tab.dataset.tab);
  })
);

// Buscar pacientes
document.getElementById("searchInput").addEventListener("input", function() {
  const termo = this.value.toLowerCase();
  const tabAtiva = document.querySelector(".tab.active").dataset.tab;
  
  if(tabAtiva === "historico") {
    // Implementar busca no histórico se necessário
    return;
  }
  
  const pacientesFiltrados = pacientes.filter(p => 
    p.status === tabAtiva && (
      p.nome.toLowerCase().includes(termo) ||
      p.setor.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo) ||
      p.anotacoes.some(a => 
        a.texto.toLowerCase().includes(termo) || 
        a.autor.toLowerCase().includes(termo))
    );
  
  const container = document.getElementById("patientList");
  container.innerHTML = "";
  
  if(pacientesFiltrados.length === 0) {
    container.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }
  
  pacientesFiltrados.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    const anotacoesHTML = p.anotacoes
      .map(a => `
        <div class="anotacoes">📝 <strong>${a.autor}</strong> (${a.data})<br/>${a.texto}</div>
      `).join("");
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p><span class="tag">${p.setor}</span></p>
      <div class="card-descricao">${p.descricao}</div>
      ${anotacoesHTML}
      ${p.status === "ativos" && (perfil === "medico" || perfil === "gestor") ? `
        <button onclick="abrirNota('${p.nome}')">Nova Anotação</button>
        <button onclick="editarPaciente('${p.nome}')">Editar</button>
        <button onclick="darAlta('${p.nome}')">Dar Alta</button>
      ` : ""}
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

  if (!nome) return alert("Nome é obrigatório.");

  pacientes.push({
    nome,
    setor,
    status,
    descricao: desc,
    criadoEm: Date.now(),
    anotacoes: []
  });

  document.getElementById("modal").style.display = "none";
  updateBadges();
  renderPatients("ativos");
  showToast("Paciente salvo com sucesso.");
});

// Modal anotação
function abrirNota(nome) {
  const paciente = pacientes.find(p => p.nome === nome);
  if (!paciente) return;
  window.anotando = paciente;
  
  document.getElementById("anotacaoNomePaciente").textContent = nome;
  document.getElementById("anotacaoData").textContent = new Date().toLocaleString("pt-BR");
  document.getElementById("anotacaoMedico").textContent = `Médico: ${usuario}`;
  
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
  const paciente = pacientes.find(p => p.nome === nome);
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
  const paciente = pacientes.find(p => p.nome === nome);
  if (!paciente) return;
  
  paciente.status = "altas";
  paciente.criadoEm = Date.now();
  
  updateBadges();
  renderPatients("ativos");
  showToast("Paciente em alta.");
}

// Encerrar plantão
document.getElementById("encerrarBtn").addEventListener("click", () => {
  document.getElementById("assinaturaUser").textContent = usuario;
  document.getElementById("assinaturaData").textContent = new Date().toLocaleString("pt-BR");
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

  if (!pend || !obs || !laudos) return alert("Checklist incompleto");

  const altas = pacientes.filter(p => p.status === "altas");
  
  plantaoHistorico.push({
    data: new Date().toLocaleString("pt-BR"),
    medico: usuario,
    destino: destino,
    altas: JSON.parse(JSON.stringify(altas))
  });

  pacientes = pacientes.filter(p => p.status !== "altas");
  
  document.getElementById("modalEncerrar").style.display = "none";
  updateBadges();
  renderPatients("ativos");
  showToast("Plantão encerrado.");
}

// Menu lateral
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
});

document.getElementById("menuLogout").addEventListener("click", () => {
  perfil = null;
  usuario = null;
  
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("tabs").classList.add("hidden");
  document.getElementById("searchContainer").classList.add("hidden");
  document.getElementById("addPatientBtn").classList.add("hidden");
  document.getElementById("encerrarBtn").classList.add("hidden");
  document.getElementById("sidebar").classList.remove("active");
});

document.getElementById("menuProfile").addEventListener("click", () => {
  const user = medicos.find(m => m.nome === usuario);
  if (!user) return;
  
  document.getElementById("perfilNome").value = user.nome;
  document.getElementById("perfilCRM").value = user.crm || "";
  document.getElementById("perfilEspecialidade").value = user.especialidade || "";
  document.getElementById("perfilEmail").value = user.email || "";
  document.getElementById("perfilTelefone").value = user.telefone || "";
  
  document.getElementById("modalPerfil").style.display = "flex";
});

document.getElementById("menuSignature").addEventListener("click", () => {
  document.getElementById("modalAssinatura").style.display = "flex";
});

function fecharPerfil() {
  document.getElementById("modalPerfil").style.display = "none";
}

function salvarPerfil() {
  const userIndex = medicos.findIndex(m => m.nome === usuario);
  if (userIndex === -1) return;
  
  medicos[userIndex].nome = document.getElementById("perfilNome").value.trim();
  medicos[userIndex].crm = document.getElementById("perfilCRM").value.trim();
  medicos[userIndex].especialidade = document.getElementById("perfilEspecialidade").value.trim();
  medicos[userIndex].email = document.getElementById("perfilEmail").value.trim();
  medicos[userIndex].telefone = document.getElementById("perfilTelefone").value.trim();
  
  usuario = medicos[userIndex].nome;
  document.getElementById("sidebarUserName").textContent = usuario;
  
  fecharPerfil();
  showToast("Perfil atualizado!");
}

function gerenciarAssinatura() {
  document.getElementById("pagamentoSection").classList.remove("hidden");
}

function cancelarAssinatura() {
  if(confirm("Tem certeza que deseja cancelar sua assinatura?")) {
    showToast("Assinatura cancelada com sucesso.");
    document.getElementById("modalAssinatura").style.display = "none";
  }
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
    <button onclick="copiarLink()">📋 Copiar</button>
    <button onclick="compartilhar()">🔗 Compartilhar</button>
  `;
  c.appendChild(divLink);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${usuario} (${perfil})</h2>
    <button onclick="alternarTema()">Alternar Tema (${temaAtual === 'light' ? 'Escuro' : 'Claro'})</button>
  `;
  c.appendChild(card);

  if (perfil === "gestor") {
    const ul = document.createElement("ul");
    ul.className = "user-list";
    medicos.forEach((m, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${m.nome}</strong> [${m.tipo}]
          <div>${m.email || ''} ${m.telefone || ''}</div>
          <div class="user-status">${m.aprovado ? "✔️ Aprovado" : "⏳ Pendente"}</div>
        </div>
        <div class="user-actions">
          ${!m.aprovado ? `<button onclick="aprovar(${i})">Aprovar</button>` : ""}
          <button onclick="toggleRole(${i})">Mudar Função</button>
          <button onclick="remover(${i})">Excluir</button>
        </div>
      `;
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
updateBadges();