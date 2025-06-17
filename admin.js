const AdminManager = {
    init() {
        const sectorSelect = document.getElementById('sector-select');
        if (sectorSelect) {
            const sectors = DataService.getSectors();
            sectors.forEach(sector => {
                const option = document.createElement('option');
                option.value = sector.id;
                option.textContent = sector.name;
                sectorSelect.appendChild(option);
            });
            
            sectorSelect.addEventListener('change', function() {
                const sector = DataService.getSectorById(this.value);
                Auth.currentSector = sector.name;
                document.getElementById('current-sector').textContent = sector.name;
            });
        }
        
        document.querySelector('.copy-link')?.addEventListener('click', () => {
            const sector = DataService.getSectors()[0];
            UI.copyToClipboard(sector.invitationLink);
        });
        
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

document.addEventListener('DOMContentLoaded', () => AdminManager.init());