const PatientManager = {
    init() {
        document.getElementById('add-alta')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addDischarge'), 'info');
        });
        
        document.getElementById('add-intercorrencia')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addIncident'), 'info');
        });
        
        document.getElementById('add-pendencia')?.addEventListener('click', () => {
            UI.showToast(i18n.t('toast.addPending'), 'info');
        });
        
        document.querySelectorAll('.card-actions .icon-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.title;
                UI.showToast(`${i18n.t('toast.action')}: ${action}`, 'info');
            });
        });
        
        document.getElementById('add-patient')?.addEventListener('click', () => {
            UI.showToast('Novo paciente adicionado', 'success');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => PatientManager.init());