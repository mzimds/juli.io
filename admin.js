// Admin Management Module
const AdminManager = {
    init() {
        // Set up copy link functionality
        document.querySelectorAll('.copy-link').forEach(button => {
            button.addEventListener('click', () => {
                UI.copyToClipboard('https://juli.app/convite/uti-adulto');
            });
        });
        
        // Set up resolve buttons
        document.querySelectorAll('.resolve-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.card');
                card.classList.add('resolved');
                this.disabled = true;
                UI.showToast('Pendência resolvida com sucesso!', 'success');
            });
        });
    }
};

// Initialize admin manager
document.addEventListener('DOMContentLoaded', () => AdminManager.init());