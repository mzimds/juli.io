const App = {
    init() {
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar.contains(e.target) && 
                !document.getElementById('menu-toggle').contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
        
        document.getElementById('close-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });
        
        document.querySelectorAll('.plantao-card').forEach(card => {
            card.addEventListener('click', () => {
                ViewManager.switchView('plantao-detail');
            });
        });
        
        document.getElementById('back-to-history')?.addEventListener('click', () => {
            ViewManager.switchView('historico');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());