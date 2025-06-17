// UI Components Module
const UI = {
    // Show animated toast notification
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
        
        // Animate progress bar
        const progress = toast.querySelector('.toast-progress');
        progress.style.animation = `progress ${duration}ms linear forwards`;
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    // Copy text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                UI.showToast(i18n.t('toast.linkCopied'), 'success');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                UI.showToast('Erro ao copiar', 'error');
            });
    }
};