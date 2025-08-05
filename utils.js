// utils.js - Funções utilitárias

// Exibir notificação toast
export function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Copiar código para área de transferência
export function copiarCodigo(codigo) {
  navigator.clipboard.writeText(codigo);
  const msg = document.getElementById("copiedMessage");
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 2000);
}

// Validar e-mail
export function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Formatar data
export function formatarData(timestamp) {
  return new Date(timestamp).toLocaleString("pt-BR");
}

// Limpar formulários
export function limparFormularios() {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";
  document.getElementById("registerConfirmPassword").value = "";
  document.getElementById("registerRole").value = "";
  document.getElementById("registerCode").value = "";
  document.getElementById("codeField").classList.add("hidden");
}

// Validar paciente único
export function validarPacienteUnico(nome, setor, pacientes) {
  return !pacientes.some(p => 
    p.nome.toLowerCase() === nome.toLowerCase() && 
    p.setor.toLowerCase() === setor.toLowerCase()
  );
}

// Validar senha
export function validarSenha(senha) {
  return senha.length >= 6;
}