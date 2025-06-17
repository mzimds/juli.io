// View Management Module
const ViewManager = {
    // Switch between views
    switchView(view) {
        // Hide all views
        document.querySelectorAll('.view-content').forEach(v => {
            v.classList.add('hidden');
        });
        
        // Show selected view
        document.getElementById(`${view}-view`).classList.remove('hidden');
        
        // Update active nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });
    },
    
    // Initialize view navigation
    init() {
        // Set up navigation items
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
        
        // Initialize dashboard view
        this.switchView('dashboard');
    }
};

// Initialize view manager
document.addEventListener('DOMContentLoaded', () => ViewManager.init());