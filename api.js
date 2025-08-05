// api.js - Módulo para comunicação com backend

// URL base da API (simulada para desenvolvimento)
const API_BASE_URL = 'https://api.memo-medico.com';

// Token de autenticação JWT (simulado)
let authToken = null;

// Configurar token de autenticação
export function setAuthToken(token) {
  authToken = token;
}

// Função genérica para requisições HTTP
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Adicionar token de autenticação se existir
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição API:', error);
    throw error;
  }
}

// Funções específicas para pacientes
export async function fetchPacientes() {
  // Em produção: return apiRequest('/pacientes');
  // Simulação com localStorage
  return JSON.parse(localStorage.getItem('pacientes')) || [];
}

export async function savePaciente(paciente) {
  // Em produção: return apiRequest('/pacientes', 'POST', paciente);
  const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  pacientes.push(paciente);
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  return paciente;
}

export async function updatePaciente(id, dados) {
  // Em produção: return apiRequest(`/pacientes/${id}`, 'PUT', dados);
  const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  const index = pacientes.findIndex(p => p.id === id);
  if (index !== -1) {
    pacientes[index] = { ...pacientes[index], ...dados };
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    return pacientes[index];
  }
  return null;
}

// Funções para autenticação
export async function login(email, password) {
  // Em produção: return apiRequest('/auth/login', 'POST', { email, password });
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === password);
  if (usuario) {
    // Simulando token JWT
    const token = btoa(JSON.stringify(usuario));
    setAuthToken(token);
    return usuario;
  }
  throw new Error('Credenciais inválidas');
}

export async function register(usuario) {
  // Em produção: return apiRequest('/auth/register', 'POST', usuario);
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push(usuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  return usuario;
}

// Funções para histórico de plantões
export async function fetchPlantaoHistorico() {
  // Em produção: return apiRequest('/plantao/historico');
  return JSON.parse(localStorage.getItem('plantaoHistorico')) || [];
}

export async function savePlantao(plantao) {
  // Em produção: return apiRequest('/plantao', 'POST', plantao);
  const historico = JSON.parse(localStorage.getItem('plantaoHistorico')) || [];
  historico.push(plantao);
  localStorage.setItem('plantaoHistorico', JSON.stringify(historico));
  return plantao;
}

// Função para exportar plantão para CSV
export function exportarPlantaoCSV(plantao) {
  let csvContent = "Nome,Setor,Leito,Atendimento,Sexo,Status,Resumo Clínico\n";
  
  plantao.pacientes.forEach(paciente => {
    const linha = [
      paciente.nome,
      paciente.setor,
      paciente.leito,
      paciente.atendimento,
      paciente.sexo,
      paciente.status,
      paciente.descricao.replace(/"/g, '""')
    ].map(field => `"${field}"`).join(',');
    
    csvContent += linha + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `plantao_${plantao.data.replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}