// config.js - Configurações do usuário e gestão
import { showToast, copiarCodigo } from './utils.js';

// Renderizar configurações
export async function renderConfig() {
  const c = document.getElementById("patientList");
  c.innerHTML = "";
  
  const configContainer = document.createElement("div");
  configContainer.className = "config-container mt-6";
  
  const profileSection = document.createElement("div");
  profileSection.className = "config-section";
  
  const profileCard = document.createElement("div");
  profileCard.className = "card";
  profileCard.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${window.currentUser.nome.charAt(0)}</div>
      <h2 class="profile-name">${window.currentUser.nome}</h2>
      <span class="profile-role">${window.currentUser.tipo === "medico" ? "Médico" : "Gestor"}</span>
      
      ${window.currentUser.codigoSetor ? `
      <div class="mt-3">
        <div class="code-container" style="justify-content: center;">
          <div class="code-value">${window.currentUser.codigoSetor}</div>
          <button class="btn-copy" onclick="copiarCodigo('${window.currentUser.codigoSetor}')">
            <i class="fas fa-copy"></i>
          </button>
        </div>
        <p class="mt-2 text-center" style="font-size: 0.85rem;">Compartilhe este código com seus colegas</p>
      </div>
      ` : ''}
    </div>
    
    <div class="card-list">
      <div class="card-list-item">
        <div class="card-list-icon">
          <i class="fas fa-envelope"></i>
        </div>
        <div class="card-list-content">
          <div class="card-list-title">E-mail</div>
          <div class="card-list-subtitle">${window.currentUser.email}</div>
        </div>
      </div>
      
      <div class="card-list-item">
        <div class="card-list-icon">
          <i class="fas fa-user-tag"></i>
        </div>
        <div class="card-list-content">
          <div class="card-list-title">Função</div>
          <div class="card-list-subtitle">${window.currentUser.tipo === "medico" ? "Médico" : "Gestor"}</div>
        </div>
      </div>
      
      <div class="card-list-item">
        <div class="card-list-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="card-list-content">
          <div class="card-list-title">Status da Conta</div>
          <div class="card-list-subtitle">${window.currentUser.aprovado ? "Ativa" : "Aguardando aprovação"}</div>
        </div>
      </div>
    </div>
  `;
  
  profileSection.appendChild(profileCard);
  configContainer.appendChild(profileSection);

  if (window.perfil === "gestor") {
    const usersSection = document.createElement("div");
    usersSection.className = "config-section";
    
    const heading = document.createElement("h2");
    heading.className = "config-section-title";
    heading.textContent = "Gerenciar Usuários";
    usersSection.appendChild(heading);

    const ul = document.createElement("ul");
    ul.className = "card-list";
    
    // Em produção: buscar usuários via API
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    usuarios.forEach((m, i) => {
      if (m.codigoSetor !== window.currentUser.codigoSetor) return;
      
      const li = document.createElement("li");
      li.className = "card-list-item";
      li.innerHTML = `
        <div class="card-list-icon" style="background: var(--light-gray);">
          <i class="fas fa-user-md" style="color: var(--text);"></i>
        </div>
        <div class="card-list-content">
          <div class="card-list-title">
            ${m.nome}
            <span class="role-badge ${m.tipo === 'medico' ? 'role-medico' : 'role-gestor'}">
              ${m.tipo === "medico" ? "Médico" : "Gestor"}
            </span>
          </div>
          <div class="card-list-subtitle">
            ${m.email}
          </div>
        </div>
        <div class="card-actions">
          ${!m.aprovado ? `
            <button class="btn btn-icon" style="background: var(--light-gray);" onclick="aprovar(${i})" title="Aprovar">
              <i class="fas fa-check" style="color: var(--text);"></i>
            </button>
          ` : ''}
          <button class="btn btn-icon" style="background: var(--light-gray);" onclick="toggleRole(${i})" title="Alterar Função">
            <i class="fas fa-sync-alt" style="color: var(--text);"></i>
          </button>
          <button class="btn btn-icon" style="background: var(--light-gray);" onclick="remover(${i})" title="Excluir">
            <i class="fas fa-trash-alt" style="color: var(--text);"></i>
          </button>
        </div>
      `;
      ul.appendChild(li);
    });
    
    usersSection.appendChild(ul);
    configContainer.appendChild(usersSection);
  }
  
  c.appendChild(configContainer);
}

// Aprovar usuário
export function aprovar(i) {
  try {
    // Em produção: atualizar usuário via API
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios[i].aprovado = true;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderConfig();
    showToast("Médico aprovado", "success");
  } catch (error) {
    showToast("Erro ao aprovar usuário: " + error.message, "error");
  }
}

// Alterar função do usuário
export function toggleRole(i) {
  try {
    // Em produção: atualizar usuário via API
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios[i].id === window.currentUser.id) {
      return showToast("Você não pode alterar sua própria função", "error");
    }
    
    usuarios[i].tipo = usuarios[i].tipo === "medico" ? "gestor" : "medico";
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderConfig();
    showToast("Função alterada", "success");
  } catch (error) {
    showToast("Erro ao alterar função: " + error.message, "error");
  }
}

// Remover usuário
export function remover(i) {
  try {
    // Em produção: remover usuário via API
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios[i].id === window.currentUser.id) {
      return showToast("Você não pode excluir sua própria conta", "error");
    }
    
    usuarios.splice(i, 1);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderConfig();
    showToast("Usuário excluído", "success");
  } catch (error) {
    showToast("Erro ao remover usuário: " + error.message, "error");
  }
}