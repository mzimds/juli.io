const ViewManager = {
    switchView(view) {
        document.querySelectorAll('.view-content').forEach(v => {
            v.classList.add('hidden');
        });
        
        document.getElementById(`${view}-view`).classList.remove('hidden');
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });
    },
    
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                if (view === 'logout') {
                    Auth.logout();
                } else {
                    this.switchView(view);
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });
        
        this.switchView('dashboard');
    }
};

document.addEventListener('DOMContentLoaded', () => ViewManager.init());