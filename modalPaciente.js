// modalPaciente.js - Controle de modais de pacientes
import { showToast, validarPacienteUnico } from './utils.js';
import { fetchPacientes, savePaciente, updatePaciente } from './api.js';

// Dados globais
let pacienteEditando = null;

// Inicialização dos eventos
export function initModalPaciente() {
  document.getElementById("addPatientBtn").addEventListener("click", () => {
    pacienteEditando = null;
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitulo").textContent = "Novo Paciente";
    document.getElementById("nomePaciente").value = "";
    document.getElementById("setorPaciente").value = "";
    document.getElementById("sexoPaciente").value = "";
    document.getElementById("leitoPaciente").value = "";
    document.getElementById("atendimentoPaciente").value = "";
    document.getElementById("statusPaciente").value = "ativos";
    document.getElementById("descricaoPaciente").value = "";
  });

  document.querySelectorAll(".btn-close").forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });

  document.getElementById("fecharModal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    pacienteEditando = null;
  });

  document.getElementById("salvarPaciente").addEventListener("click", async () => {
    const nome = document.getElementById("nomePaciente").value.trim();
    const setor = document.getElementById("setorPaciente").value.trim();
    const sexo = document.getElementById("sexoPaciente").value;
    const leito = document.getElementById("leitoPaciente").value.trim();
    const atendimento = document.getElementById("atendimentoPaciente").value.trim();
    const status = document.getElementById("statusPaciente").value;
    const desc = document.getElementById("descricaoPaciente").value.trim();

    if (!nome || !setor || !sexo || !leito || !atendimento) {
      return showToast("Preencha todos os campos obrigatórios", "error");
    }

    try {
      const pacientes = await fetchPacientes();
      
      if (pacienteEditando === null && !validarPacienteUnico(nome, setor, pacientes)) {
        return showToast("Já existe um paciente com este nome no mesmo setor", "error");
      }

      const pacienteData = {
        nome,
        setor,
        sexo,
        leito,
        atendimento,
        status,
        descricao: desc,
        criadoEm: Date.now(),
        anotacoes: []
      };

      if (pacienteEditando !== null) {
        await updatePaciente(pacienteEditando.id, pacienteData);
        showToast("Paciente atualizado com sucesso", "success");
      } else {
        await savePaciente(pacienteData);
        showToast("Paciente adicionado com sucesso", "success");
      }

      document.getElementById("modal").style.display = "none";
      pacienteEditando = null;
      // Em produção: atualizar lista de pacientes
    } catch (error) {
      showToast("Erro ao salvar paciente: " + error.message, "error");
    }
  });
}

// Editar paciente
export async function editarPaciente(id) {
  try {
    const pacientes = await fetchPacientes();
    pacienteEditando = pacientes.find(p => p.id === id);
    
    if (!pacienteEditando) return;
    
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitulo").textContent = "Editar Paciente";
    document.getElementById("nomePaciente").value = pacienteEditando.nome;
    document.getElementById("setorPaciente").value = pacienteEditando.setor;
    document.getElementById("sexoPaciente").value = pacienteEditando.sexo || "";
    document.getElementById("leitoPaciente").value = pacienteEditando.leito || "";
    document.getElementById("atendimentoPaciente").value = pacienteEditando.atendimento || "";
    document.getElementById("statusPaciente").value = pacienteEditando.status;
    document.getElementById("descricaoPaciente").value = pacienteEditando.descricao;
  } catch (error) {
    showToast("Erro ao carregar paciente: " + error.message, "error");
  }
}