// auth.js - Autenticação e registro
import { showToast, validarEmail, validarSenha, limparFormularios } from './utils.js';
import { login, register } from './api.js';

export function initAuth() {
  // Elementos
  const loginCard = document.getElementById('loginCard');
  const registerCard = document.getElementById('registerCard');
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const registerRole = document.getElementById('registerRole');
  const codeField = document.getElementById('codeField');

  // Mostrar formulário de registro
  showRegisterBtn.addEventListener('click', () => {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
  });

  // Voltar para login
  backToLoginBtn.addEventListener('click', () => {
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
  });

  // Mostrar campo de código se a função for gestor
  registerRole.addEventListener('change', () => {
    codeField.classList.toggle('hidden', registerRole.value !== 'gestor');
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!validarEmail(email)) {
      return showToast('E-mail inválido', 'error');
    }

    if (!validarSenha(password)) {
      return showToast('Senha deve ter pelo menos 6 caracteres', 'error');
    }

    try {
      const usuario = await login(email, password);
      // Simulação: definir usuário logado
      window.currentUser = usuario;
      window.usuario = usuario.nome;
      window.perfil = usuario.tipo;
      document.getElementById('authContainer').classList.add('hidden');
      document.getElementById('appContainer').classList.remove('hidden');
      document.getElementById('userInfo').classList.remove('hidden');
      document.getElementById('userAvatar').textContent = usuario.nome.charAt(0);
      document.getElementById('userName').textContent = usuario.nome;
      showToast(`Bem-vindo(a), ${usuario.nome}!`, 'success');
      // Renderizar a tab ativa (ativos)
      renderPatients('ativos');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  // Registro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const senha = document.getElementById('registerPassword').value.trim();
    const confirmarSenha = document.getElementById('registerConfirmPassword').value.trim();
    const tipo = document.getElementById('registerRole').value;
    const codigoSetor = document.getElementById('registerCode').value.trim();

    if (!nome) {
      return showToast('Nome é obrigatório', 'error');
    }

    if (!validarEmail(email)) {
      return showToast('E-mail inválido', 'error');
    }

    if (!validarSenha(senha)) {
      return showToast('Senha deve ter pelo menos 6 caracteres', 'error');
    }

    if (senha !== confirmarSenha) {
      return showToast('As senhas não coincidem', 'error');
    }

    if (!tipo) {
      return showToast('Selecione uma função', 'error');
    }

    if (tipo === 'gestor' && !codigoSetor) {
      return showToast('Código do setor é obrigatório para gestores', 'error');
    }

    try {
      const usuario = {
        id: Date.now(),
        nome,
        email,
        senha,
        tipo,
        codigoSetor: tipo === 'gestor' ? codigoSetor : null,
        aprovado: tipo === 'gestor' // gestor é aprovado automaticamente
      };

      await register(usuario);
      showToast('Conta criada com sucesso! Aguarde aprovação.', 'success');
      limparFormularios();
      registerCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}