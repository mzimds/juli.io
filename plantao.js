// plantao.js - Lógica de encerramento de plantão
import { showToast } from './utils.js';
import { savePlantao, exportarPlantaoCSV } from './api.js';

// Inicialização dos eventos
export function initPlantao() {
  document.getElementById("encerrarBtn").addEventListener("click", () => {
    document.getElementById("assinaturaUser").textContent = usuario;
    document.getElementById("modalEncerrar").style.display = "flex";
  });
  
  document.getElementById("fecharEncerrar").addEventListener("click", () => {
    document.getElementById("modalEncerrar").style.display = "none";
  });
  
  document.getElementById("confirmarEncerramento").addEventListener("click", async () => {
    const destino = document.getElementById("medicoDestino").value;
    const checklist = {
      revisao: document.getElementById("checklist1").checked,
      pendencias: document.getElementById("checklist2").checked,
      documentacao: document.getElementById("checklist3").checked
    };
    
    if (!checklist.revisao || !checklist.pendencias || !checklist.documentacao) {
      return showToast("Complete o checklist antes de encerrar", "warning");
    }

    try {
      // Em produção: buscar pacientes da API
      const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
      const pacientesAtivos = pacientes.filter(p => p.status === "ativos");
      const pacientesAlta = pacientes.filter(p => p.status === "altas");
      const pacientesPlantao = [...pacientesAtivos, ...pacientesAlta];
      
      // Em produção: buscar log de ações da API
      const logAcoes = JSON.parse(localStorage.getItem('logAcoes')) || [];
      
      const plantao = {
        id: Date.now(),
        timestamp: Date.now(),
        data: new Date().toLocaleString("pt-BR"),
        medico: usuario,
        destino: destino,
        pacientes: pacientesPlantao,
        altas: pacientesAlta.length,
        log: logAcoes.filter(a => a.timestamp >= inicioPlantao),
        checklist: checklist
      };
      
      await savePlantao(plantao);
      
      // Exportar para CSV
      exportarPlantaoCSV(plantao);
      
      // Em produção: remover pacientes com alta via API
      pacientes = pacientes.filter(p => p.status !== "altas");
      localStorage.setItem('pacientes', JSON.stringify(pacientes));
      
      // Limpar log local
      logAcoes = [];
      localStorage.setItem('logAcoes', JSON.stringify(logAcoes));
      
      document.getElementById("modalEncerrar").style.display = "none";
      showToast("Plantão encerrado com sucesso. CSV exportado.", "success");
      
      // Reiniciar contador do plantão
      inicioPlantao = Date.now();
      
      // Em produção: atualizar lista de pacientes
    } catch (error) {
      showToast("Erro ao encerrar plantão: " + error.message, "error");
    }
  });
}

// Visualizar detalhes do plantão
export async function verDetalhesPlantao(id) {
  try {
    // Em produção: buscar plantão específico da API
    const plantoes = JSON.parse(localStorage.getItem('plantaoHistorico')) || [];
    const plantao = plantoes.find(p => p.id === id);
    
    if (!plantao) return;
    
    const modal = document.getElementById("modalPlantao");
    document.getElementById("plantaoData").textContent = plantao.data;
    document.getElementById("plantaoMedico").textContent = plantao.medico;
    document.getElementById("plantaoDestino").textContent = plantao.destino;
    document.getElementById("plantaoPacientesCount").textContent = plantao.pacientes.length;
    document.getElementById("plantaoAltasCount").textContent = plantao.altas;
    
    // Preencher pacientes
    const pacientesContainer = document.getElementById("plantaoPacientes");
    pacientesContainer.innerHTML = "";
    
    plantao.pacientes.forEach(paciente => {
      const pacienteEl = document.createElement("div");
      pacienteEl.className = "plantao-paciente";
      pacienteEl.innerHTML = `
        <div class="plantao-paciente-header">
          <h3>${paciente.nome}</h3>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </div>
        <div class="plantao-paciente-content">
          <div class="info-grid">
            <div>Setor:</div>
            <div>${paciente.setor || 'N/A'}</div>
            <div>Leito:</div>
            <div>${paciente.leito || 'N/A'}</div>
            <div>Atendimento:</div>
            <div>${paciente.atendimento || 'N/A'}</div>
            <div>Sexo:</div>
            <div>${paciente.sexo || 'N/A'}</div>
            <div>Status:</div>
            <div>${paciente.status === 'ativos' ? 'Ativo' : 'Alta'}</div>
          </div>
          
          <div class="mt-3">
            <h4>Resumo Clínico</h4>
            <p>${paciente.descricao || 'Nenhum resumo clínico.'}</p>
          </div>
          
          ${paciente.anotacoes && paciente.anotacoes.length > 0 ? `
            <div class="mt-3">
              <h4>Anotações</h4>
              <div class="notes-container">
                ${paciente.anotacoes.map(a => `
                  <div class="note">
                    <div class="note-header">
                      <span class="note-author">${a.autor}</span>
                      <span class="note-date">${a.data}</span>
                    </div>
                    <div class="note-content">${a.texto}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      
      // Accordion functionality
      const header = pacienteEl.querySelector(".plantao-paciente-header");
      header.addEventListener("click", () => {
        pacienteEl.classList.toggle("open");
      });
      
      pacientesContainer.appendChild(pacienteEl);
    });
    
    // Preencher log de ações
    const logContainer = document.getElementById("plantaoLog");
    logContainer.innerHTML = "";
    
    plantao.log.sort((a, b) => a.timestamp - b.timestamp).forEach(acao => {
      const logEl = document.createElement("div");
      logEl.className = "log-item";
      logEl.innerHTML = `
        <div class="log-header">
          <span class="log-type">${acao.tipo}</span>
          <span class="log-timestamp">${acao.data}</span>
        </div>
        <div class="log-details">
          <span class="log-paciente">${acao.paciente || 'Sistema'}:</span>
          ${acao.detalhes}
          <div><small>Por: ${acao.autor}</small></div>
        </div>
      `;
      logContainer.appendChild(logEl);
    });
    
    modal.style.display = "flex";
  } catch (error) {
    showToast("Erro ao carregar plantão: " + error.message, "error");
  }
}