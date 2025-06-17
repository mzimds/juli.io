// Patient Management Module
const PatientManager = {
    // Initialize patient functionality
    init() {
        // Set up action buttons
        this.setupActionButtons();
    },
    
    // Setup action buttons for patient cards
    setupActionButtons() {
        // Add discharge button
        document.getElementById('add-alta')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addDischarge'), 'info');
        });
        
        // Add incident button
        document.getElementById('add-intercorrencia')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addIncident'), 'info');
        });
        
        // Add pending button
        document.getElementById('add-pendencia')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addPending'), 'info');
        });
        
        // Card action buttons
        document.querySelectorAll('.card-actions .icon-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.title;
                UI.showToast(`${i18n.t('toast.action')}: ${action}`, 'info');
            });
        });
    }
};

// Initialize patient manager
document.addEventListener('DOMContentLoaded', () => PatientManager.init());