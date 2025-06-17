// UI Components Module
const UI = {
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">${message}</div>
            <div class="toast-progress"></div>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                UI.showToast('Link copiado para a área de transferência!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                UI.showToast('Erro ao copiar', 'error');
            });
    }
};