// historico.js - Gerenciamento de histórico e filtros
import { showToast, formatarData } from './utils.js';
import { fetchPacientes, fetchPlantaoHistorico } from './api.js';

// Renderizar pacientes
export async function renderPatients(tab) {
  const container = document.getElementById("patientList");
  container.innerHTML = "";
  
  const fabContainer = document.getElementById("fabContainer");
  if (tab === "config" || tab === "historico") {
    fabContainer.classList.add("hidden");
  } else {
    fabContainer.classList.remove("hidden");
  }

  const showSearch = tab !== "config";
  document.getElementById("searchContainer").classList.toggle("hidden", !showSearch);

  if (tab === "config") return;
  
  if (tab === "historico") {
    try {
      const plantaoHistorico = await fetchPlantaoHistorico();
      
      if (plantaoHistorico.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-history"></i>
            <h3>Nenhum plantão encerrado</h3>
            <p>Os plantões encerrados aparecerão aqui.</p>
          </div>
        `;
        return;
      }

      // Ordenar plantões por data (mais recente primeiro)
      const plantoesOrdenados = [...plantaoHistorico].sort((a, b) => b.timestamp - a.timestamp);
      
      plantoesOrdenados.forEach((plantao, i) => {
        const bloco = document.createElement("div");
        bloco.className = "card";
        bloco.innerHTML = `
          <div class="card-header">
            <h2 class="card-title">Plantão #${plantoesOrdenados.length - i}</h2>
            <span class="tag">${plantao.data}</span>
          </div>
          <p><strong>Médico:</strong> ${plantao.medico}</p>
          <p><strong>Destino:</strong> ${plantao.destino}</p>
          <p><strong>Pacientes:</strong> ${plantao.pacientes.length}</p>
          <p><strong>Altas:</strong> ${plantao.altas}</p>
          <div class="text-right mt-3">
            <button class="btn btn-sm btn-primary">Ver Detalhes</button>
          </div>
        `;
        
        // Botão para ver detalhes do plantão
        const btn = bloco.querySelector("button");
        btn.addEventListener("click", () => verDetalhesPlantao(plantao.id));
        
        container.appendChild(bloco);
      });
    } catch (error) {
      showToast("Erro ao carregar histórico: " + error.message, "error");
    }
    return;
  }

  try {
    const pacientes = await fetchPacientes();
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const lista = pacientes
      .filter((p) => p.status === tab && p.nome.toLowerCase().includes(searchTerm))
      .sort((a, b) => b.criadoEm - a.criadoEm);

    if (lista.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-user-injured"></i>
          <h3>Nenhum paciente encontrado</h3>
          <p>${tab === "ativos" ? "Adicione um novo paciente usando o botão +" : "Nenhum paciente nesta categoria"}</p>
        </div>
      `;
      return;
    }

    lista.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";
      
      const anotacoesOrdenadas = p.anotacoes.sort((a, b) => b.timestamp - a.timestamp);
      
      const anotacoesHTML = anotacoesOrdenadas.length > 0 ? `
        <div class="notes-container">
          <h3 class="notes-title">Anotações</h3>
          ${anotacoesOrdenadas.map(
            (a) => `
              <div class="note">
                <div class="note-header">
                  <span class="note-author">${a.autor}</span>
                  <span class="note-date">${a.data}</span>
                </div>
                <div class="note-content">${a.texto}</div>
              </div>
            `
          ).join("")}
        </div>
      ` : '';
      
      const actionsHTML = p.status === "ativos" && (perfil === "medico" || perfil === "gestor") ? `
        <div class="card-actions">
          <button class="btn btn-sm btn-outline" onclick="abrirNota('${p.nome}')">
            Anotação
          </button>
          <button class="btn btn-sm btn-outline" onclick="editarPaciente('${p.id}')">
            Editar
          </button>
          <button class="btn btn-sm btn-success" onclick="darAlta('${p.id}')">
            Alta
          </button>
        </div>
      ` : '';
      
      card.innerHTML = `
        <div class="card-header">
          <h2 class="card-title">${p.nome}</h2>
          <span class="tag ${tab === 'ativos' ? 'primary' : 'success'}">
            ${p.setor}
          </span>
        </div>
        <div class="card-subtitle">
          ${formatarData(p.criadoEm)}
        </div>
        <div class="card-content">${p.descricao}</div>
        ${anotacoesHTML}
        ${actionsHTML}
      `;
      container.appendChild(card);
    });
  } catch (error) {
    showToast("Erro ao carregar pacientes: " + error.message, "error");
  }
}

// Dar alta ao paciente
export async function darAlta(id) {
  try {
    // Em produção: atualizar paciente via API
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(p => p.id === id);
    
    if (paciente) {
      paciente.status = "altas";
      paciente.criadoEm = Date.now();
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      showToast("Paciente recebeu alta", "success");
      renderPatients("ativos");
    }
  } catch (error) {
    showToast("Erro ao dar alta: " + error.message, "error");
  }
}

// Abrir nota
export function abrirNota(nome) {
  // Em produção: buscar paciente via API
  const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  const paciente = pacientes.find(p => p.nome === nome);
  
  if (!paciente) return;
  window.anotando = paciente;
  document.getElementById("novaNota").value = "";
  document.getElementById("modalNota").style.display = "flex";
}

// Salvar nota
export async function salvarNota() {
  const texto = document.getElementById("novaNota").value.trim();
  
  if (!texto || !window.anotando) {
    return showToast("Digite uma anotação", "error");
  }
  
  try {
    // Em produção: atualizar paciente via API
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacienteIndex = pacientes.findIndex(p => p.id === window.anotando.id);
    
    if (pacienteIndex !== -1) {
      pacientes[pacienteIndex].anotacoes.push({
        texto,
        autor: usuario,
        data: new Date().toLocaleString("pt-BR"),
        timestamp: Date.now()
      });
      
      pacientes[pacienteIndex].criadoEm = Date.now();
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      
      document.getElementById("modalNota").style.display = "none";
      renderPatients("ativos");
      showToast("Anotação salva", "success");
    }
  } catch (error) {
    showToast("Erro ao salvar anotação: " + error.message, "error");
  }
}

// Visualizar histórico completo do paciente
export function verHistoricoCompleto(paciente) {
  const modal = document.getElementById("modalHistorico");
  const nomeEl = document.getElementById("historicoNome");
  const setorEl = document.getElementById("historicoSetor");
  const leitoEl = document.getElementById("historicoLeito");
  const atendimentoEl = document.getElementById("historicoAtendimento");
  const sexoEl = document.getElementById("historicoSexo");
  const statusEl = document.getElementById("historicoStatus");
  const descricaoEl = document.getElementById("historicoDescricao");
  const anotacoesEl = document.getElementById("historicoAnotacoes");
  const anotacoesSection = document.getElementById("historicoAnotacoesSection");
  
  nomeEl.textContent = paciente.nome;
  setorEl.textContent = paciente.setor || 'N/A';
  leitoEl.textContent = paciente.leito || 'N/A';
  atendimentoEl.textContent = paciente.atendimento || 'N/A';
  sexoEl.textContent = paciente.sexo || 'N/A';
  statusEl.textContent = paciente.status === 'ativos' ? 'Ativo' : 'Alta';
  descricaoEl.textContent = paciente.descricao || 'Nenhum resumo clínico registrado.';
  
  if (paciente.anotacoes && paciente.anotacoes.length > 0) {
    anotacoesSection.style.display = 'block';
    anotacoesEl.innerHTML = '';
    
    const anotacoesOrdenadas = paciente.anotacoes.sort((a, b) => b.timestamp - a.timestamp);
    
    anotacoesOrdenadas.forEach(a => {
      anotacoesEl.innerHTML += `
        <div class="note">
          <div class="note-header">
            <span class="note-author">${a.autor}</span>
            <span class="note-date">${a.data}</span>
          </div>
          <div class="note-content">${a.texto}</div>
        </div>
      `;
    });
  } else {
    anotacoesSection.style.display = 'none';
  }
  
  modal.style.display = "flex";
}