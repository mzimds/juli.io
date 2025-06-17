// Elementos DOM
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const navItems = document.querySelectorAll('.nav-item');
const viewContents = document.querySelectorAll('.view-content');
const currentUserEl = document.getElementById('current-user');
const userRoleEl = document.getElementById('user-role');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const currentSectorEl = document.getElementById('current-sector');
const currentShiftEl = document.getElementById('current-shift');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const plantaoCards = document.querySelectorAll('.plantao-card');
const backToHistoryBtn = document.getElementById('back-to-history');

// Dados de exemplo
const users = {
    'medico': { 
        password: 'juli123', 
        name: 'Dr. Silva', 
        role: 'Médico Plantonista', 
        sectors: ['UTI Adulto', 'Emergência'] 
    },
    'admin': { 
        password: 'admin123', 
        name: 'Admin Sistema', 
        role: 'Administrador', 
        sectors: ['UTI Adulto', 'UTI Pediátrica', 'Emergência', 'Enfermaria'] 
    }
};

// Estado da aplicação
let currentUser = null;
let currentSector = 'UTI Adulto';
let currentShift = 'Plantão Diurno (07:00 - 19:00)';

// Função para alternar entre views
function switchView(view) {
    // Esconder todas as views
    viewContents.forEach(v => v.classList.add('hidden'));
    
    // Mostrar a view selecionada
    document.getElementById(`${view}-view`).classList.remove('hidden');
    
    // Atualizar itens de navegação ativos
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === view) {
            item.classList.add('active');
        }
    });
}

// Função de login
function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        
        // Atualizar UI
        currentUserEl.textContent = currentUser.name;
        userRoleEl.textContent = currentUser.role;
        currentSectorEl.textContent = currentSector;
        currentShiftEl.textContent = currentShift;
        
        // Mostrar app e esconder login
        loginScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        
        // Esconder mensagem de erro
        errorMessage.style.display = 'none';
    } else {
        // Mostrar mensagem de erro
        errorMessage.style.display = 'block';
    }
}

// Atualizar indicador de setor
function updateSectorIndicator() {
    currentSectorEl.textContent = currentSector;
}

// Event Listeners
loginBtn.addEventListener('click', login);

// Permitir login com Enter
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});

// Menu toggle para mobile
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const view = item.dataset.view;
        
        if (view === 'logout') {
            // Fazer logout
            loginScreen.style.display = 'flex';
            appContainer.style.display = 'none';
            usernameInput.value = '';
            passwordInput.value = '';
            sidebar.classList.remove('active');
        } else {
            // Alternar para a view selecionada
            switchView(view);
            sidebar.classList.remove('active');
        }
    });
});

// Botões de adição
document.getElementById('add-alta').addEventListener('click', () => {
    alert('Formulário para adicionar nova alta será exibido');
});

document.getElementById('add-intercorrencia').addEventListener('click', () => {
    alert('Formulário para adicionar nova intercorrência será exibido');
});

document.getElementById('add-pendencia').addEventListener('click', () => {
    alert('Formulário para adicionar nova pendência será exibido');
});

document.getElementById('add-record').addEventListener('click', () => {
    alert('Selecionar tipo de registro a ser adicionado');
});

// Botão de copiar link
document.querySelector('.copy-link').addEventListener('click', () => {
    alert('Link copiado para a área de transferência!\n\nhttps://juli.app/convite/uti-pediatrica');
});

// Visualizar detalhes do plantão
plantaoCards.forEach(card => {
    card.addEventListener('click', () => {
        switchView('plantao-detail');
    });
});

// Voltar ao histórico
backToHistoryBtn.addEventListener('click', () => {
    switchView('historico');
});

// Inicialização
switchView('dashboard');