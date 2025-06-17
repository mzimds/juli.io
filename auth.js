// Authentication Module
const Auth = {
    // User database
    users: {
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
    },
    
    // Current user state
    currentUser: null,
    currentSector: 'UTI Adulto',
    currentShift: 'Plantão Diurno (07:00 - 19:00)',
    
    // DOM elements
    elements: {
        loginScreen: null,
        appContainer: null,
        usernameInput: null,
        passwordInput: null,
        errorMessage: null,
        currentUserEl: null,
        userRoleEl: null,
        currentSectorEl: null,
        currentShiftEl: null
    },
    
    // Initialize authentication
    init() {
        this.elements = {
            loginScreen: document.getElementById('login-screen'),
            appContainer: document.getElementById('app-container'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            errorMessage: document.getElementById('error-message'),
            currentUserEl: document.getElementById('current-user'),
            userRoleEl: document.getElementById('user-role'),
            currentSectorEl: document.getElementById('current-sector'),
            currentShiftEl: document.getElementById('current-shift')
        };
        
        // Set up event listeners
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        this.elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
    },
    
    // Login function
    login() {
        const username = this.elements.usernameInput.value;
        const password = this.elements.passwordInput.value;
        
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = this.users[username];
            
            // Update UI
            this.elements.currentUserEl.textContent = this.currentUser.name;
            this.elements.userRoleEl.textContent = this.currentUser.role;
            this.elements.currentSectorEl.textContent = this.currentSector;
            this.elements.currentShiftEl.textContent = this.currentShift;
            
            // Show app and hide login
            this.elements.loginScreen.style.display = 'none';
            this.elements.appContainer.style.display = 'flex';
            
            // Hide error message
            this.elements.errorMessage.style.display = 'none';
            
            // Hide admin menu if not admin
            if (this.currentUser.role !== 'Administrador') {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'none';
                });
            }
            
            // Show welcome toast
            UI.showToast(i18n.t('toast.welcome', { username: this.currentUser.name }), 'success');
        } else {
            // Show error message
            this.elements.errorMessage.style.display = 'block';
        }
    },
    
    // Logout function
    logout() {
        this.currentUser = null;
        this.elements.loginScreen.style.display = 'flex';
        this.elements.appContainer.style.display = 'none';
        this.elements.usernameInput.value = '';
        this.elements.passwordInput.value = '';
        
        // Reset sidebar state
        document.getElementById('sidebar').classList.remove('active');
    }
};

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => Auth.init());