const i18n = {
    translations: {
        'pt-BR': {
            'app.name': 'Juli',
            'login.subtitle': 'Segurança e continuidade das informações clínicas',
            'login.username': 'Usuário',
            'login.password': 'Senha',
            'login.usernamePlaceholder': 'Digite seu usuário',
            'login.passwordPlaceholder': 'Digite sua senha',
            'login.button': 'Entrar no Sistema',
            'login.error': 'Usuário ou senha incorretos. Tente novamente.',
            'login.testTitle': 'Credenciais de Teste',
            'login.testUser': 'Usuário:',
            'login.testPassword': 'Senha:',
            'login.testAdmin': 'Admin:',
            'nav.dashboard': 'Dashboard',
            'nav.discharges': 'Altas',
            'nav.incidents': 'Intercorrências',
            'nav.pending': 'Pendências',
            'nav.history': 'Histórico',
            'nav.admin': 'Administração',
            'nav.logout': 'Sair',
            'toast.welcome': 'Bem-vindo, {username}!',
            'toast.linkCopied': 'Link copiado para a área de transferência!',
            'toast.pendingResolved': 'Pendência resolvida com sucesso!',
            'toast.addDischarge': 'Adicionar alta médica',
            'toast.addIncident': 'Adicionar intercorrência',
            'toast.addPending': 'Adicionar pendência',
            'admin.sectorLink': 'Compartilhe este link via WhatsApp para médicos se cadastrarem neste setor'
        },
        'en': {
            'app.name': 'Juli',
            'login.subtitle': 'Safety and continuity of clinical information',
            'login.username': 'Username',
            'login.password': 'Password',
            'login.usernamePlaceholder': 'Enter your username',
            'login.passwordPlaceholder': 'Enter your password',
            'login.button': 'Log In',
            'login.error': 'Incorrect username or password. Please try again.',
            'login.testTitle': 'Test Credentials',
            'login.testUser': 'User:',
            'login.testPassword': 'Password:',
            'login.testAdmin': 'Admin:',
            'nav.dashboard': 'Dashboard',
            'nav.discharges': 'Discharges',
            'nav.incidents': 'Incidents',
            'nav.pending': 'Pending',
            'nav.history': 'History',
            'nav.admin': 'Administration',
            'nav.logout': 'Logout',
            'toast.welcome': 'Welcome, {username}!',
            'toast.linkCopied': 'Link copied to clipboard!',
            'toast.pendingResolved': 'Pending issue resolved successfully!',
            'toast.addDischarge': 'Add medical discharge',
            'toast.addIncident': 'Add incident',
            'toast.addPending': 'Add pending task',
            'admin.sectorLink': 'Share this link via WhatsApp for doctors to register in this sector'
        }
    },
    
    currentLang: 'pt-BR',
    
    init() {
        const savedLang = localStorage.getItem('userLang');
        const browserLang = navigator.language.split('-')[0] === 'pt' ? 'pt-BR' : 'en';
        this.currentLang = savedLang || browserLang;
        
        document.querySelectorAll('#language-select, #app-language-select').forEach(select => {
            select.value = this.currentLang;
            select.addEventListener('change', (e) => this.setLanguage(e.target.value));
        });
        
        this.applyTranslations();
    },
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('userLang', lang);
        this.applyTranslations();
    },
    
    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    },
    
    t(key, params = {}) {
        let translation = this.translations[this.currentLang][key] || key;
        
        for (const [param, value] of Object.entries(params)) {
            translation = translation.replace(`{${param}}`, value);
        }
        
        return translation;
    }
};

document.addEventListener('DOMContentLoaded', () => i18n.init());