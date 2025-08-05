// main.js - Inicialização e eventos gerais
import { initAuth } from './auth.js';
import { initModalPaciente } from './modalPaciente.js';
import { initPlantao } from './plantao.js';
import { renderPatients, darAlta, abrirNota, salvarNota, verHistoricoCompleto } from './historico.js';
import { aprovar, toggleRole, remover, renderConfig } from './config.js';
import { copiarCodigo } from './utils.js';

// Variáveis globais
export let perfil = null;
export let usuario = null;
export let currentUser = null;
export let inicioPlantao = Date.now();

// Inicialização do sistema
document.addEventListener("DOMContentLoaded", function() {
  // Inicializar módulos
  initAuth();
  initModalPaciente();
  initPlantao();
  
  // Eventos de tabs
  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) =>
        t.classList.remove("active")
      );
      tab.classList.add("active");
      const tabName = tab.dataset.tab;
      if (tabName === 'config') {
        renderConfig();
      } else {
        renderPatients(tabName);
      }
    })
  );

  // Buscar pacientes
  document.getElementById("searchInput").addEventListener("input", () => {
    const tabName = document.querySelector(".tab.active").dataset.tab;
    if (tabName !== 'config') {
      renderPatients(tabName);
    }
  });
  
  // Evento para fechar nota
  document.getElementById("fecharNota").addEventListener("click", () => {
    document.getElementById("modalNota").style.display = "none";
  });
  
  // Evento para salvar nota
  document.getElementById("salvarNota").addEventListener("click", () => {
    salvarNota();
  });
});

// Exportar funções para uso em HTML
window.editarPaciente = editarPaciente;
window.darAlta = darAlta;
window.abrirNota = abrirNota;
window.verHistoricoCompleto = verHistoricoCompleto;
window.verDetalhesPlantao = verDetalhesPlantao;
window.copiarCodigo = copiarCodigo;
window.aprovar = aprovar;
window.toggleRole = toggleRole;
window.remover = remover;