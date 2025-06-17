// Admin Management Module
const AdminManager = {
    // Initialize admin functionality
    init() {
        // Set up sector selector
        const sectorSelect = document.getElementById('sector-select');
        if (sectorSelect) {
            // Populate sector selector
            const sectors = DataService.getSectors();
            sectors.forEach(sector => {
                const option = document.createElement('option');
                option.value = sector.id;
                option.textContent = sector.name;
                sectorSelect.appendChild(option);
            });
            
            // Handle sector change
            sectorSelect.addEventListener('change', function() {
                const sector = DataService.getSectorById(this.value);
                Auth.currentSector = sector.name;
                document.getElementById('current-sector').textContent = sector.name;
            });
        }
        
        // Set up copy link functionality
        document.querySelector('.copy-link')?.addEventListener('click', () => {
            const sector = DataService.getSectors()[0]; // Get first sector for demo
            UI.copyToClipboard(sector.invitationLink);
        });
        
        // Set up resolve buttons
        document.querySelectorAll('.resolve-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.card');
                card.classList.add('resolved');
                this.disabled = true;
                UI.showToast(i18n.t('toast.pendingResolved'), 'success');
            });
        });
    }
};

// Initialize admin manager
document.addEventListener('DOMContentLoaded', () => AdminManager.init());