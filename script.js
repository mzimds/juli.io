let perfil = null;
let usuario = null;
let temaAtual = "light";
let usuarioAtual = null;

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
  { 
    nome: "Dr. Ana", 
    tipo: "medico", 
    email: "ana@exemplo.com", 
    senha: "senha123", 
    crm: "12345", 
    especialidade: "Cardiologia", 
    telefone: "(11) 9999-8888", 
    aprovado: true 
  },
  { 
    nome: "Admin", 
    tipo: "gestor", 
    email: "admin@exemplo.com", 
    senha: "admin123", 
    telefone: "(11) 7777-6666", 
    aprovado: true,
    codigoConvite: "G8H3K9P2" // Código gerado automaticamente
  }
];

// Funções de Login e Conta
function mostrarCriarConta() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("criarContaForm").classList.remove("hidden");
  // Resetar campos
  document.getElementById("nomeCompleto").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("inviteCode").value = "";
  document.getElementById("crm").value = "";
  document.getElementById("especialidade").value = "";
  toggleRoleFields(true);
}

function mostrarLogin() {
  document.getElementById("criarContaForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  // Resetar campos
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

function toggleRoleFields(isMedico) {
  document.getElementById("medicoFields").classList.toggle("hidden", !isMedico);
  document.getElementById("conviteContainer").classList.toggle("hidden", !isMedico);
}

// Gerar código único para gestor
function gerarCodigoConvite() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

function criarConta() {
  const nome = document.getElementById("nomeCompleto").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value.trim();
  const tipo = document.querySelector('input[name="role"]:checked').value;
  const telefone = document.getElementById("telefone").value.trim();
  
  // Campos obrigatórios comuns
  if (!nome || !email || !senha || !telefone) {
    return showToast("Preencha todos os campos obrigatórios");
  }
  
  let novoUsuario = {
    nome,
    email,
    senha,
    tipo,
    telefone,
    aprovado: tipo === "gestor" // Gestores são aprovados automaticamente
  };
  
  if (tipo === "medico") {
    const crm = document.getElementById("crm").value.trim();
    const especialidade = document.getElementById("especialidade").value.trim();
    const codigo = document.getElementById("inviteCode").value.trim();
    
    if (!crm || !especialidade || !codigo) {
      return showToast("Preencha todos os campos obrigatórios");
    }
    
    // Verificar se o código é válido
    const gestorValido = medicos.some(m => m.tipo === "gestor" && m.codigoConvite === codigo);
    if (!gestorValido) {
      return showToast("Código de convite inválido");
    }
    
    novoUsuario.crm = crm;
    novoUsuario.especialidade = especialidade;
  } else if (tipo === "gestor") {
    // Gerar código único para novo gestor
    novoUsuario.codigoConvite = gerarCodigoConvite();
  }
  
  medicos.push(novoUsuario);
  showToast(tipo === "gestor" ? 
    "Conta de gestor criada com sucesso!" : 
    "Conta criada com sucesso! Aguarde aprovação."
  );
  mostrarLogin();
}

function fazerLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginPassword").value.trim();
  
  if (!email || !senha) {
    return showToast("Preencha email e senha");
  }
  
  const user = medicos.find(u => u.email === email && u.senha === senha);
  
  if (!user) return showToast("Credenciais inválidas");
  if (!user.aprovado) return showToast("Aguardando aprovação do gestor");
  
  perfil = user.tipo;
  usuario = user.nome;
  usuarioAtual = user;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("tabs").classList.remove("hidden");
  document.getElementById("searchContainer").classList.remove("hidden");
  document.getElementById("addPatientBtn").classList.remove("hidden");
  
  if (perfil === "medico" || perfil === "gestor") {
    document.getElementById("encerrarBtn").classList.remove("hidden");
  }
  
  document.getElementById("sidebarUserName").textContent = usuario;
  document.querySelectorAll(".gestor-only").forEach(el => {
    el.classList.toggle("hidden", perfil !== "gestor");
  });

  renderPatients("ativos");
  updateBadges();
}

function logout() {
  perfil = null;
  usuario = null;
  usuarioAtual = null;
  
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("tabs").classList.add("hidden");
  document.getElementById("searchContainer").classList.add("hidden");
  document.getElementById("addPatientBtn").classList.add("hidden");
  document.getElementById("encerrarBtn").classList.add("hidden");
  
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("criarContaForm").classList.add("hidden");
  
  document.getElementById("sidebar").classList.remove("open");
}

// Menu lateral
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// Alternar tema claro/escuro
function alternarTema() {
  temaAtual = temaAtual === "light" ? "dark" : "light";
  document.body.className = temaAtual;
  renderPatients("config");
}

// Atualizar badges
function updateBadges() {
  const ativos = pacientes.filter(p => p.status === "ativos").length;
  const altas = pacientes.filter(p => p.status === "altas").length;
  
  document.getElementById("badgeAtivos").textContent = ativos;
  document.getElementById("badgeAltas").textContent = altas;
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
      container.innerHTML = "<p class='no-results'>Nenhum plantão encerrado.</p>";
      return;
    }

    plantaoHistorico.forEach((plantao, i) => {
      const bloco = document.createElement("div");
      bloco.className = "card";
      bloco.innerHTML = `
        <h2>Plantão #${i + 1} - ${plantao.data}</h2>
        <p><strong>Médico:</strong> ${plantao.medico}</p>
        <p><strong>Recebido por:</strong> ${plantao.destino}</p>
        <button class="btn-detalhes" onclick="verDetalhesPlantao(${i})">Ver detalhes</button>
      `;
      container.appendChild(bloco);
    });
    return;
  }

  const termoBusca = document.getElementById("searchInput").value.toLowerCase();
  let lista = pacientes
    .filter(p => p.status === tab)
    .sort((a, b) => b.criadoEm - a.criadoEm);

  // Filtro de busca aprimorado
  if (termoBusca) {
    lista = lista.filter(p => 
      p.nome.toLowerCase().includes(termoBusca) || 
      p.setor.toLowerCase().includes(termoBusca) ||
      p.descricao.toLowerCase().includes(termoBusca) ||
      p.anotacoes.some(a => 
        a.texto.toLowerCase().includes(termoBusca) || 
        a.autor.toLowerCase().includes(termoBusca)
      )
    );
  }

  if (lista.length === 0) {
    container.innerHTML = "<p class='no-results'>Nenhum paciente encontrado.</p>";
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
  
  updateBadges();
}

// Ver detalhes do plantão
function verDetalhesPlantao(index) {
  const plantao = plantaoHistorico[index];
  const container = document.getElementById("patientList");
  container.innerHTML = "";
  
  const bloco = document.createElement("div");
  bloco.className = "card";
  bloco.innerHTML = `<h2>Plantão #${index + 1} - ${plantao.data}</h2>`;
  
  bloco.innerHTML += `
    <p><strong>Médico:</strong> ${plantao.medico}</p>
    <p><strong>Recebido por:</strong> ${plantao.destino}</p>
    <h3>Pacientes com alta:</h3>
  `;
  
  plantao.altas.forEach((p) => {
    bloco.innerHTML += `
      <div class="paciente-alta">
        <h4>${p.nome} - ${p.setor}</h4>
        <p>${p.descricao}</p>
        <ul>
          ${p.anotacoes
            .map(
              (a) =>
                `<li><strong>${a.autor}</strong> (${a.data}): ${a.texto}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  });
  
  container.appendChild(bloco);
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

  if (!nome || !setor || !desc) return showToast("Preencha todos os campos obrigatórios.");

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
  
  document.getElementById("notaPacienteNome").textContent = paciente.nome;
  document.getElementById("notaData").textContent = new Date().toLocaleString("pt-BR");
  document.getElementById("notaMedico").textContent = usuario;
  
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
  document.getElementById("dataEncerramento").textContent = new Date().toLocaleString("pt-BR");
  
  // Popular dropdown de médicos
  const select = document.getElementById("medicoDestino");
  select.innerHTML = "";
  medicos
    .filter(m => m.tipo === "medico" && m.aprovado && m.nome !== usuario)
    .forEach(m => {
      const option = document.createElement("option");
      option.value = m.nome;
      option.textContent = m.nome;
      select.appendChild(option);
    });
  
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

  if (!pend || !obs || !laudos) return showToast("Checklist incompleto");

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

  const card = document.createElement("div");
  card.className = "card config-card";
  card.innerHTML = `
    <h2>${usuario} (${perfil})</h2>
    <button class="btn-config" onclick="abrirPerfil()">Editar Perfil</button>
    <div class="tema-switch">
      <label>Modo Escuro</label>
      <label class="switch">
        <input type="checkbox" ${temaAtual === 'dark' ? 'checked' : ''} onchange="alternarTema()">
        <span class="slider"></span>
      </label>
    </div>
  `;
  c.appendChild(card);

  // Mostrar código de convite se for gestor
  if (perfil === "gestor" && usuarioAtual.codigoConvite) {
    const divCodigo = document.createElement("div");
    divCodigo.className = "config-link";
    divCodigo.innerHTML = `
      <h3>Código de Convite do Setor</h3>
      <input id="inviteLink" readonly value="${usuarioAtual.codigoConvite}"/>
      <button onclick="copiarCodigo()">📋 Copiar</button>
      <button onclick="compartilharCodigo()">🔗 Compartilhar</button>
    `;
    c.appendChild(divCodigo);
  }

  if (perfil === "gestor") {
    const h3 = document.createElement("h3");
    h3.textContent = "Gerenciar Usuários";
    c.appendChild(h3);
    
    const ul = document.createElement("ul");
    ul.className = "user-list";
    medicos.forEach((m, i) => {
      // Não mostrar o próprio usuário
      if (m.email === usuarioAtual.email) return;
      
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="user-info">
          <span class="user-name">${m.nome}</span>
          <span class="user-role">${m.tipo} - ${m.aprovado ? "✔️ Aprovado" : "⏳ Pendente"}</span>
          ${m.crm ? `<span class="user-crm">CRM: ${m.crm}</span>` : ''}
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

function copiarCodigo() {
  const txt = document.getElementById("inviteLink");
  txt.select();
  document.execCommand("copy");
  showToast("Código copiado!");
}

function compartilharCodigo() {
  const codigo = document.getElementById("inviteLink").value;
  const texto = `Junte-se ao meu setor no MEMO usando o código: ${codigo}`;
  if (navigator.share) {
    navigator.share({
      title: "Convite MEMO",
      text: texto
    });
  } else {
    showToast("Copie o código e compartilhe manualmente");
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

// Perfil do usuário
function abrirPerfil() {
  document.getElementById("modalPerfil").style.display = "flex";
  
  document.getElementById("perfilNome").value = usuarioAtual.nome;
  document.getElementById("perfilEmail").value = usuarioAtual.email;
  document.getElementById("perfilTelefone").value = usuarioAtual.telefone;
  
  const medicoFields = document.getElementById("perfilMedicoFields");
  if (usuarioAtual.tipo === "medico") {
    medicoFields.classList.remove("hidden");
    document.getElementById("perfilCRM").value = usuarioAtual.crm;
    document.getElementById("perfilEspecialidade").value = usuarioAtual.especialidade;
  } else {
    medicoFields.classList.add("hidden");
  }
}

function fecharPerfil() {
  document.getElementById("modalPerfil").style.display = "none";
}

document.getElementById("salvarPerfil").addEventListener("click", () => {
  const nome = document.getElementById("perfilNome").value.trim();
  const email = document.getElementById("perfilEmail").value.trim();
  const telefone = document.getElementById("perfilTelefone").value.trim();
  
  if (!nome || !email || !telefone) {
    return showToast("Preencha todos os campos obrigatórios");
  }
  
  usuarioAtual.nome = nome;
  usuarioAtual.email = email;
  usuarioAtual.telefone = telefone;
  
  if (usuarioAtual.tipo === "medico") {
    const crm = document.getElementById("perfilCRM").value.trim();
    const especialidade = document.getElementById("perfilEspecialidade").value.trim();
    
    if (!crm || !especialidade) {
      return showToast("Preencha CRM e Especialidade");
    }
    
    usuarioAtual.crm = crm;
    usuarioAtual.especialidade = especialidade;
  }
  
  usuario = nome;
  document.getElementById("sidebarUserName").textContent = nome;
  
  showToast("Perfil atualizado com sucesso");
  fecharPerfil();
});

// Assinatura
function abrirAssinatura() {
  // Atualizar código de convite no modal
  if (usuarioAtual.codigoConvite) {
    document.getElementById("codigoConvite").textContent = usuarioAtual.codigoConvite;
  }
  document.getElementById("modalAssinatura").style.display = "flex";
}

function fecharAssinatura() {
  document.getElementById("modalAssinatura").style.display = "none";
}

function abrirPlanos() {
  document.getElementById("planosContainer").classList.remove("hidden");
}

function copiarCodigo() {
  const codigo = document.getElementById("codigoConvite").textContent;
  navigator.clipboard.writeText(codigo);
  showToast("Código copiado!");
}

// Inicialização
document.body.className = temaAtual;
document.getElementById("perfilMedicoFields").classList.add("hidden");