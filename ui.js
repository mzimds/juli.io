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
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
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

(function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .toast {
            min-width: 250px;
            color: white;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-info { background: #3b82f6; }
        .toast-success { background: #10b981; }
        .toast-warning { background: #f59e0b; }
        .toast-error { background: #ef4444; }
        
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            background: rgba(255,255,255,0.5);
            width: 100%;
            transform: scaleX(1);
            transform-origin: left;
            animation: progress 3s linear forwards;
        }
        
        @keyframes progress {
            to { transform: scaleX(0); }
        }
    `;
    document.head.appendChild(style);
})();