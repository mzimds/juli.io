// Main Application Module
const App = {
    // Initialize the application
    init() {
        // Set up mobile menu toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar.contains(e.target) && 
                !document.getElementById('menu-toggle').contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
        
        // Close sidebar button
        document.getElementById('close-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });
        
        // Set up plantão card navigation
        document.querySelectorAll('.plantao-card').forEach(card => {
            card.addEventListener('click', () => {
                ViewManager.switchView('plantao-detail');
            });
        });
        
        // Back to history button
        document.getElementById('back-to-history')?.addEventListener('click', () => {
            ViewManager.switchView('historico');
        });
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => App.init());