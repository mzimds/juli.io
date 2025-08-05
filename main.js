// main.js - Inicialização e eventos gerais
import { initAuth } from './auth.js';
import { initModalPaciente } from './modalPaciente.js';
import { initPlantao } from './plantao.js';
import { renderPatients } from './historico.js';

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
      renderPatients(tab.dataset.tab);
    })
  );

  // Buscar pacientes
  document.getElementById("searchInput").addEventListener("input", () => {
    renderPatients(document.querySelector(".tab.active").dataset.tab);
  });
  
  // Evento para fechar nota
  document.getElementById("fecharNota").addEventListener("click", () => {
    document.getElementById("modalNota").style.display = "none";
  });
  
  // Evento para salvar nota
  document.getElementById("salvarNota").addEventListener("click", () => {
    // Função definida em historico.js
    salvarNota();
  });
});

// Variáveis globais (temporárias)
let perfil = null;
let usuario = null;
let currentUser = null;
let inicioPlantao = Date.now();

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