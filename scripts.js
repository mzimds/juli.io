// Dados vazios para inicialização
const dados = {
    pacientes: [],
    historico: []
};

// Elementos DOM
const DOM = {
    patientList: document.getElementById('patientList'),
    globalSearch: document.getElementById('globalSearch'),
    mobileGlobalSearch: document.getElementById('mobileGlobalSearch'),
    autocompleteContainer: document.getElementById('autocompleteContainer'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    newPacienteModal: document.getElementById('newPacienteModal'),
    pacienteName: document.getElementById('pacienteName'),
    pacienteNameError: document.getElementById('pacienteNameError'),
    pacienteAtendimento: document.getElementById('pacienteAtendimento'),
    pacienteSexo: document.getElementById('pacienteSexo'),
    pacienteIdade: document.getElementById('pacienteIdade'),
    pacienteLeito: document.getElementById('pacienteLeito'),
    pacienteLeitoError: document.getElementById('pacienteLeitoError'),
    pacienteSetor: document.getElementById('pacienteSetor'),
    btnCancelPaciente: document.getElementById('btnCancelPaciente'),
    btnSavePaciente: document.getElementById('btnSavePaciente'),
    passPlantaoModal: document.getElementById('passPlantaoModal'),
    btnFinalizarPlantao: document.getElementById('btnFinalizarPlantao'),
    btnCancelPass: document.getElementById('btnCancelPass'),
    btnConfirmPass: document.getElementById('btnConfirmPass'),
    medicoRecebe: document.getElementById('medicoRecebe'),
    medicoRecebeError: document.getElementById('medicoRecebeError'),
    assinatura: document.getElementById('assinatura'),
    noteInput: document.getElementById('noteInput'),
    btnSendNote: document.getElementById('btnSendNote'),
    resumoPacientes: document.getElementById('resumoPacientes'),
    resumoAnotacoes: document.getElementById('resumoAnotacoes'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    confirmDeleteModal: document.getElementById('confirmDeleteModal'),
    patientNameToDelete: document.getElementById('patientNameToDelete'),
    btnCancelDelete: document.getElementById('btnCancelDelete'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),
    confirmDeleteInput: document.getElementById('confirmDeleteInput'),
    confirmDeleteError: document.getElementById('confirmDeleteError'),
    historyScreen: document.getElementById('historyScreen'),
    historyList: document.getElementById('historyListContent'),
    editPacienteModal: document.getElementById('editPacienteModal'),
    editPacienteName: document.getElementById('editPacienteName'),
    editPacienteNameError: document.getElementById('editPacienteNameError'),
    editPacienteAtendimento: document.getElementById('editPacienteAtendimento'),
    editPacienteSexo: document.getElementById('editPacienteSexo'),
    editPacienteIdade: document.getElementById('editPacienteIdade'),
    editPacienteLeito: document.getElementById('editPacienteLeito'),
    editPacienteLeitoError: document.getElementById('editPacienteLeitoError'),
    editPacienteSetor: document.getElementById('editPacienteSetor'),
    btnCancelEdit: document.getElementById('btnCancelEdit'),
    btnUpdatePaciente: document.getElementById('btnUpdatePaciente'),
    hamburgerMenu: document.getElementById('hamburgerMenu'),
    mobileMenu: document.getElementById('mobileMenu'),
    noteEditor: document.getElementById('noteEditor'),
    btnNewPacienteFab: document.getElementById('btnNewPacienteFab'),
    searchToggle: document.getElementById('searchToggle'),
    container: document.querySelector('.container'),
    searchContainer: document.getElementById('searchContainer'),
    filters: document.getElementById('filters'),
    btnFinalizarPlantaoMobile: document.getElementById('btnFinalizarPlantaoMobile')
};

// Estado da aplicação
let state = {
    currentPaciente: null,
    currentDoctor: "Dr. Carlos Silva",
    lastEdit: new Date().toISOString(),
    currentFilter: "active",
    editingPacienteId: null
};

// Inicialização
function init() {
    renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
    setupEventListeners();
    updateResumoPlantao();
    
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    document.getElementById('historyDateFilter').value = formattedToday;
    
    if (state.currentFilter === 'active') {
        DOM.noteEditor.style.display = 'block';
        document.querySelector('.fab-container').style.display = 'block';
        DOM.container.classList.add('active-screen');
    }
}

// Renderizar lista de pacientes
function renderPatientList() {
    DOM.patientList.innerHTML = '';
    
    let filteredPacientes = dados.pacientes.filter(paciente => 
        paciente.status === state.currentFilter
    );
    
    filteredPacientes.sort((a, b) => 
        new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
    
    if (filteredPacientes.length === 0) {
        DOM.patientList.innerHTML = `
            <div class="empty-state">
                <div class="empty-content">
                    <p>Nenhum paciente encontrado</p>
                </div>
            </div>
        `;
        return;
    }
    
    filteredPacientes.forEach(paciente => {
        const lastNote = paciente.anotacoes.length > 0 
            ? paciente.anotacoes[paciente.anotacoes.length - 1] 
            : null;
        
        const pacienteCard = document.createElement('div');
        pacienteCard.className = `paciente-card ${state.currentPaciente === paciente.id ? 'active' : ''}`;
        pacienteCard.setAttribute('data-id', paciente.id);
        
        let lastNoteHTML = '';
        if (lastNote) {
            const showToggle = lastNote.texto.length > 100;
            const truncatedText = showToggle ? lastNote.texto.substring(0, 100) + '...' : lastNote.texto;
            
            lastNoteHTML = `
            <div class="last-note">
                <div class="note-text">${showToggle ? truncatedText : lastNote.texto}</div>
                ${showToggle ? '<div class="toggle-note">Ver mais</div>' : ''}
                <div class="note-meta">
                    <span>${formatDateTimeFull(lastNote.timestamp)}</span>
                    <span>${lastNote.medico}</span>
                </div>
            </div>
            `;
        }
        
        pacienteCard.innerHTML = `
            <div class="paciente-header">
                <div class="paciente-info">
                    <div class="paciente-name">${paciente.nome}</div>
                    <div class="paciente-leito">${paciente.leito}</div>
                </div>
                <div class="paciente-status">
                    ${paciente.status === 'discharged' ? 
                        `<span class="status-badge alta">Alta</span>` : ''}
                </div>
            </div>
            
            <div class="paciente-tags">
                <span class="tag">${paciente.setor || 'Geral'}</span>
            </div>
            
            ${lastNoteHTML}
            
            <div class="paciente-actions">
                ${paciente.status !== 'discharged' ? `
                <button class="btn-action edit" data-id="${paciente.id}" aria-label="Editar paciente">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ` : ''}
                <button class="btn-action delete" data-id="${paciente.id}" aria-label="Excluir paciente">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ${paciente.status !== 'discharged' ? `
                <button class="btn-action alta" data-id="${paciente.id}" aria-label="Registrar alta">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 10L12 13L22 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ` : ''}
            </div>
        `;
        
        DOM.patientList.appendChild(pacienteCard);
        
        if (lastNote && lastNote.texto.length > 100) {
            const toggleBtn = pacienteCard.querySelector('.toggle-note');
            const noteText = pacienteCard.querySelector('.note-text');
            
            if (toggleBtn && noteText) {
                toggleBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (noteText.textContent.length > 100) {
                        noteText.textContent = lastNote.texto;
                        this.textContent = 'Ver menos';
                    } else {
                        noteText.textContent = lastNote.texto.substring(0, 100) + '...';
                        this.textContent = 'Ver mais';
                    }
                });
            }
        }
    });
    
    // Adicionar eventos aos cards
    document.querySelectorAll('.paciente-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Verificar se o clique foi em um elemento clicável
            const isActionElement = e.target.closest('.btn-action') || 
                                    e.target.classList.contains('toggle-note') ||
                                    e.target.tagName === 'INPUT' || 
                                    e.target.tagName === 'TEXTAREA' || 
                                    e.target.tagName === 'SELECT';
            
            if (!isActionElement) {
                const pacienteId = parseInt(card.getAttribute('data-id'));
                selectPaciente(pacienteId);
            }
        });
    });
    
    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.btn-action.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pacienteId = parseInt(btn.getAttribute('data-id'));
            openEditPacienteModal(pacienteId);
        });
    });
    
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pacienteId = parseInt(btn.getAttribute('data-id'));
            openDeleteConfirmationModal(pacienteId);
        });
    });
    
    document.querySelectorAll('.btn-action.alta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const pacienteId = parseInt(btn.getAttribute('data-id'));
            registerAlta(pacienteId);
        });
    });
}

// Selecionar paciente
function selectPaciente(pacienteId) {
    state.currentPaciente = pacienteId;
    
    document.querySelectorAll('.paciente-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`.paciente-card[data-id="${pacienteId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
        
        if (window.innerWidth < 768) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    DOM.btnSendNote.disabled = !pacienteId;
    
    if (state.currentFilter === 'active') {
        setTimeout(() => {
            DOM.noteInput.focus();
        }, 100);
    }
}

// Formatar data/hora completa
function formatDateTimeFull(datetime) {
    const date = new Date(datetime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de status
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.currentFilter = this.dataset.status;
            
            if (state.currentFilter === 'active') {
                DOM.container.classList.add('active-screen');
            } else {
                DOM.container.classList.remove('active-screen');
            }
            
            if (state.currentFilter === 'history') {
                DOM.patientList.style.display = 'none';
                DOM.historyScreen.style.display = 'flex';
                renderHistory();
                DOM.noteEditor.style.display = 'none';
                document.querySelector('.fab-container').style.display = 'none';
            } else {
                DOM.patientList.style.display = 'grid';
                DOM.historyScreen.style.display = 'none';
                renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
                
                if (state.currentFilter === 'active') {
                    DOM.noteEditor.style.display = 'block';
                    document.querySelector('.fab-container').style.display = 'block';
                } else {
                    DOM.noteEditor.style.display = 'none';
                    document.querySelector('.fab-container').style.display = 'none';
                }
            }
        });
    });
    
    // Novo paciente (FAB)
    DOM.btnNewPacienteFab.addEventListener('click', openNewPacienteModal);
    
    // Modal novo paciente
    DOM.btnCancelPaciente.addEventListener('click', () => {
        DOM.newPacienteModal.classList.remove('active');
    });
    
    DOM.btnSavePaciente.addEventListener('click', () => {
        hideAllErrors();
        
        const nome = DOM.pacienteName.value.trim();
        const leito = DOM.pacienteLeito.value.trim();
        const idade = parseInt(DOM.pacienteIdade.value) || null;
        const setor = DOM.pacienteSetor.value.trim();
        const atendimento = DOM.pacienteAtendimento.value.trim();
        const sexo = DOM.pacienteSexo.value;
        
        if (!nome) {
            showError(DOM.pacienteNameError, 'Informe o nome do paciente');
            DOM.pacienteName.focus();
            return;
        }
        
        if (!leito) {
            showError(DOM.pacienteLeitoError, 'Informe o número do leito');
            DOM.pacienteLeito.focus();
            return;
        }
        
        const novoPaciente = {
            id: Date.now(),
            nome,
            atendimento,
            sexo,
            idade,
            leito,
            setor,
            status: "active",
            anotacoes: [],
            alta: null,
            lastUpdated: new Date().toISOString()
        };
        
        dados.pacientes.unshift(novoPaciente);
        renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
        DOM.newPacienteModal.classList.remove('active');
        
        DOM.pacienteName.value = '';
        DOM.pacienteAtendimento.value = '';
        DOM.pacienteSexo.value = '';
        DOM.pacienteIdade.value = '';
        DOM.pacienteLeito.value = '';
        DOM.pacienteSetor.value = '';
        
        showToast(`Paciente "${nome}" adicionado com sucesso!`, 'success');
        
        dados.historico.push({
            id: Date.now(),
            tipo: "novo_paciente",
            texto: `Novo paciente ${nome} adicionado no leito ${leito}`,
            timestamp: new Date().toISOString(),
            medico: state.currentDoctor,
            paciente: nome,
            setor: setor || 'Geral'
        });
        
        selectPaciente(novoPaciente.id);
    });
    
    // Finalizar plantão
    DOM.btnFinalizarPlantao.addEventListener('click', openPassPlantaoModal);
    DOM.btnFinalizarPlantaoMobile.addEventListener('click', openPassPlantaoModal);
    
    DOM.btnCancelPass.addEventListener('click', () => {
        DOM.passPlantaoModal.classList.remove('active');
    });
    
    DOM.btnConfirmPass.addEventListener('click', () => {
        const medicoRecebe = DOM.medicoRecebe.value.trim();
        if (!medicoRecebe) {
            showError(DOM.medicoRecebeError, 'Selecione um médico');
            return;
        }
        
        DOM.btnConfirmPass.innerHTML = '<span class="loader"></span> Processando...';
        DOM.btnConfirmPass.disabled = true;
        
        setTimeout(() => {
            showToast(`Plantão finalizado e passado para ${medicoRecebe} com sucesso!`, 'success');
            
            dados.pacientes = dados.pacientes.filter(p => p.status === 'active');
            renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
            
            dados.historico.push({
                id: Date.now(),
                tipo: "passagem_plantao",
                texto: `Plantão finalizado e passado para ${medicoRecebe}`,
                timestamp: new Date().toISOString(),
                medico: state.currentDoctor,
                paciente: '',
                setor: 'Todos'
            });
            
            DOM.passPlantaoModal.classList.remove('active');
            DOM.btnConfirmPass.innerHTML = 'Confirmar';
            DOM.btnConfirmPass.disabled = false;
            DOM.medicoRecebe.value = '';
        }, 1500);
    });
    
    // Envio de anotações
    DOM.btnSendNote.addEventListener('click', sendNote);
    
    DOM.noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendNote();
        }
    });

    DOM.noteInput.addEventListener('input', function() {
        const hasText = this.value.trim() !== '';
        DOM.btnSendNote.disabled = !hasText || !state.currentPaciente;
        
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });
    
    // Modal de exclusão de paciente
    DOM.btnCancelDelete.addEventListener('click', () => {
        DOM.confirmDeleteModal.classList.remove('active');
    });
    
    DOM.btnConfirmDelete.addEventListener('click', deletePaciente);
    
    DOM.confirmDeleteInput.addEventListener('input', function() {
        const confirmText = this.value.trim().toLowerCase();
        const isConfirmed = confirmText === 'excluir';
        
        DOM.btnConfirmDelete.disabled = !isConfirmed;
        
        if (isConfirmed) {
            DOM.btnConfirmDelete.classList.remove('btn-delete-disabled');
            DOM.btnConfirmDelete.classList.add('btn-delete');
        } else {
            DOM.btnConfirmDelete.classList.remove('btn-delete');
            DOM.btnConfirmDelete.classList.add('btn-delete-disabled');
        }
        
        if (confirmText !== '' && !isConfirmed) {
            DOM.confirmDeleteError.style.display = 'block';
        } else {
            DOM.confirmDeleteError.style.display = 'none';
        }
    });
    
    // Busca global
    DOM.globalSearch.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        performSearch(searchTerm);
    });
    
    DOM.mobileGlobalSearch.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        performSearch(searchTerm);
    });
    
    // Toggle de busca mobile
    DOM.searchToggle.addEventListener('click', function() {
        DOM.searchContainer.classList.toggle('active');
        if (DOM.searchContainer.classList.contains('active')) {
            DOM.globalSearch.focus();
        }
    });
    
    // Filtros do histórico
    document.getElementById('historyDateFilter').addEventListener('change', renderHistory);
    document.getElementById('historyMedicoFilter').addEventListener('change', renderHistory);
    document.getElementById('historySetorFilter').addEventListener('change', renderHistory);
    
    // Modal editar paciente
    DOM.btnCancelEdit.addEventListener('click', () => {
        DOM.editPacienteModal.classList.remove('active');
    });
    
    DOM.btnUpdatePaciente.addEventListener('click', updatePaciente);
    
    // Menu mobile
    DOM.hamburgerMenu.addEventListener('click', (e) => {
        DOM.hamburgerMenu.classList.toggle('open');
        e.stopPropagation();
        DOM.mobileMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!DOM.mobileMenu.contains(e.target) && 
            !DOM.hamburgerMenu.contains(e.target)) {
            DOM.mobileMenu.classList.remove('active');
        DOM.hamburgerMenu.classList.remove('open');
        }
    });
    
    // Fechar busca ao clicar fora
    document.addEventListener('click', (e) => {
        if (!DOM.searchContainer.contains(e.target) && 
            !DOM.searchToggle.contains(e.target)) {
            DOM.searchContainer.classList.remove('active');
        }
    });
}

// Realizar busca
function performSearch(searchTerm) {
    DOM.autocompleteContainer.innerHTML = '';
    
    if (searchTerm.length < 2) {
        DOM.autocompleteContainer.classList.remove('visible');
        return;
    }
    
    // Busca em pacientes
    dados.pacientes.forEach(paciente => {
        if (paciente.nome.toLowerCase().includes(searchTerm)) {
            addAutocompleteItem(paciente.nome, 'paciente', paciente.id, DOM.autocompleteContainer);
        } else if (paciente.leito.toLowerCase().includes(searchTerm)) {
            addAutocompleteItem(`Leito ${paciente.leito}: ${paciente.nome}`, 'leito', paciente.id, DOM.autocompleteContainer);
        } else if (paciente.setor && paciente.setor.toLowerCase().includes(searchTerm)) {
            addAutocompleteItem(`${paciente.nome} (${paciente.setor})`, 'setor', paciente.id, DOM.autocompleteContainer);
        }
        
        // Busca em anotações
        paciente.anotacoes.forEach(anotacao => {
            if (anotacao.texto.toLowerCase().includes(searchTerm)) {
                addAutocompleteItem(anotacao.texto, 'anotacao', paciente.id, DOM.autocompleteContainer, anotacao.id);
            }
        });
    });
    
    // Busca em histórico
    if (state.currentFilter === 'history') {
        dados.historico.forEach(item => {
            if (item.texto.toLowerCase().includes(searchTerm) ||
                item.medico.toLowerCase().includes(searchTerm) ||
                item.setor.toLowerCase().includes(searchTerm) ||
                item.paciente.toLowerCase().includes(searchTerm)) {
                addAutocompleteItem(item.texto, 'historico', null, DOM.autocompleteContainer);
            }
        });
    }
    
    if (DOM.autocompleteContainer.children.length > 0) {
        DOM.autocompleteContainer.classList.add('visible');
    } else {
        DOM.autocompleteContainer.classList.remove('visible');
    }
}

// Filtrar cards de pacientes
function filterPatientCards(searchTerm) {
    const cards = document.querySelectorAll('.paciente-card');
    
    cards.forEach(card => {
        const pacienteId = parseInt(card.getAttribute('data-id'));
        const paciente = dados.pacientes.find(p => p.id === pacienteId);
        
        if (!paciente) return;
        
        const match = 
            paciente.nome.toLowerCase().includes(searchTerm) ||
            paciente.leito.toLowerCase().includes(searchTerm) ||
            (paciente.setor && paciente.setor.toLowerCase().includes(searchTerm)) ||
            paciente.anotacoes.some(anotacao => 
                anotacao.texto.toLowerCase().includes(searchTerm)
            );
        
        card.style.display = match ? 'flex' : 'none';
    });
}

// Filtrar histórico
function filterHistory(searchTerm) {
    if (!searchTerm) {
        renderHistory();
        return;
    }
    
    const filteredHistory = dados.historico.filter(item => 
        item.texto.toLowerCase().includes(searchTerm) ||
        item.medico.toLowerCase().includes(searchTerm) ||
        item.setor.toLowerCase().includes(searchTerm) ||
        item.paciente.toLowerCase().includes(searchTerm)
    );
    
    renderHistory(filteredHistory);
}

// Adicionar item ao autocomplete
function addAutocompleteItem(text, type, pacienteId, container, anotacaoId = null) {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.innerHTML = text;
    item.addEventListener('click', () => {
        if (pacienteId) {
            selectPaciente(pacienteId);
        }
        container.classList.remove('visible');
        DOM.globalSearch.value = '';
        DOM.mobileGlobalSearch.value = '';
        container.parentElement.classList.remove('active');
    });
    container.appendChild(item);
}

// Atualizar resumo do plantão
function updateResumoPlantao() {
    const pacientesAtendidos = dados.pacientes.filter(p => p.status === 'active').length;
    const anotacoesRealizadas = dados.pacientes.reduce((total, p) => total + p.anotacoes.length, 0);
    
    DOM.resumoPacientes.textContent = pacientesAtendidos;
    DOM.resumoAnotacoes.textContent = anotacoesRealizadas;
}

// Abrir modal novo paciente
function openNewPacienteModal() {
    DOM.newPacienteModal.classList.add('active');
    DOM.pacienteName.focus();
    DOM.mobileMenu.classList.remove('active');
        DOM.hamburgerMenu.classList.remove('open');
    DOM.searchContainer.classList.remove('active');
}

// Abrir modal de edição
function openEditPacienteModal(pacienteId) {
    const paciente = dados.pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;
    
    state.editingPacienteId = pacienteId;
    
    DOM.editPacienteName.value = paciente.nome;
    DOM.editPacienteAtendimento.value = paciente.atendimento || '';
    DOM.editPacienteSexo.value = paciente.sexo || '';
    DOM.editPacienteIdade.value = paciente.idade || '';
    DOM.editPacienteLeito.value = paciente.leito;
    DOM.editPacienteSetor.value = paciente.setor || '';
    
    DOM.editPacienteModal.classList.add('active');
    DOM.editPacienteName.focus();
    DOM.searchContainer.classList.remove('active');
}

// Atualizar paciente
function updatePaciente() {
    const paciente = dados.pacientes.find(p => p.id === state.editingPacienteId);
    if (!paciente) return;
    
    hideAllErrors();
    
    const nome = DOM.editPacienteName.value.trim();
    const leito = DOM.editPacienteLeito.value.trim();
    const idade = parseInt(DOM.editPacienteIdade.value) || null;
    const setor = DOM.editPacienteSetor.value.trim();
    const atendimento = DOM.editPacienteAtendimento.value.trim();
    const sexo = DOM.editPacienteSexo.value;
    
    if (!nome) {
        showError(DOM.editPacienteNameError, 'Informe o nome do paciente');
        DOM.editPacienteName.focus();
        return;
    }
    
    if (!leito) {
        showError(DOM.editPacienteLeitoError, 'Informe o número do leito');
        DOM.editPacienteLeito.focus();
        return;
    }
    
    paciente.nome = nome;
    paciente.leito = leito;
    paciente.idade = idade;
    paciente.setor = setor;
    paciente.atendimento = atendimento;
    paciente.sexo = sexo;
    paciente.lastUpdated = new Date().toISOString();
    
    renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
    DOM.editPacienteModal.classList.remove('active');
    
    showToast(`Paciente "${nome}" atualizado com sucesso!`, 'success');
    
    dados.historico.push({
        id: Date.now(),
        tipo: "edicao_paciente",
        texto: `Dados do paciente ${nome} atualizados`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        paciente: nome,
        setor: setor || 'Geral'
    });
}

// Abrir modal de finalização de plantão
function openPassPlantaoModal() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    DOM.assinatura.value = `${state.currentDoctor} - ${dateStr} ${timeStr}`;
    
    updateResumoPlantao();
    
    DOM.passPlantaoModal.classList.add('active');
    DOM.medicoRecebe.focus();
    DOM.mobileMenu.classList.remove('active');
        DOM.hamburgerMenu.classList.remove('open');
    DOM.searchContainer.classList.remove('active');
}

// Registrar alta
function registerAlta(pacienteId) {
    const paciente = dados.pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;
    
    paciente.status = 'discharged';
    paciente.alta = {
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor
    };
    paciente.lastUpdated = new Date().toISOString();
    
    paciente.anotacoes.push({
        id: Date.now(),
        texto: "Alta médica registrada",
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor
    });
    
    renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
    showToast('Alta registrada com sucesso', 'success');
    
    dados.historico.push({
        id: Date.now(),
        tipo: "alta",
        texto: `Alta médica registrada para ${paciente.nome}`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        paciente: paciente.nome,
        setor: paciente.setor || 'Geral'
    });
}

// Enviar anotação
function sendNote() {
    if (!state.currentPaciente) {
        showToast('Selecione um paciente primeiro', 'error');
        return;
    }
    
    const noteText = DOM.noteInput.value.trim();
    if (!noteText) return;
    
    const paciente = dados.pacientes.find(p => p.id === state.currentPaciente);
    if (!paciente) return;
    
    const novaAnotacao = {
        id: Date.now(),
        texto: noteText,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor
    };
    
    paciente.anotacoes.push(novaAnotacao);
    paciente.lastUpdated = new Date().toISOString();
    
    renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
    updateResumoPlantao();
    
    dados.historico.push({
        id: Date.now(),
        tipo: "anotacao",
        texto: `Nova anotação para ${paciente.nome}: ${noteText}`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        paciente: paciente.nome,
        setor: paciente.setor || 'Geral'
    });
    
    DOM.noteInput.value = '';
    DOM.btnSendNote.disabled = true;
    DOM.noteInput.style.height = 'auto';
    
    showToast('Anotação registrada', 'success');
}

// Abrir modal de confirmação de exclusão
function openDeleteConfirmationModal(pacienteId) {
    const paciente = dados.pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;
    
    state.currentPaciente = pacienteId;
    DOM.patientNameToDelete.textContent = paciente.nome;
    
    DOM.confirmDeleteInput.value = '';
    DOM.btnConfirmDelete.disabled = true;
    DOM.confirmDeleteError.style.display = 'none';
    
    DOM.btnConfirmDelete.classList.remove('btn-delete');
    DOM.btnConfirmDelete.classList.add('btn-delete-disabled');
    
    DOM.confirmDeleteModal.classList.add('active');
    DOM.confirmDeleteInput.focus();
    DOM.searchContainer.classList.remove('active');
}

// Excluir paciente
function deletePaciente() {
    const paciente = dados.pacientes.find(p => p.id === state.currentPaciente);
    if (!paciente) return;
    
    const index = dados.pacientes.findIndex(p => p.id === state.currentPaciente);
    if (index !== -1) {
        dados.pacientes.splice(index, 1);
        renderPatientList();
    if (state.currentFilter !== 'active') DOM.noteEditor.style.display = 'none';
        DOM.confirmDeleteModal.classList.remove('active');
        state.currentPaciente = null;
        
        dados.historico.push({
            id: Date.now(),
            tipo: "exclusao",
            texto: `Paciente ${paciente.nome} excluído`,
            timestamp: new Date().toISOString(),
            medico: state.currentDoctor,
            paciente: paciente.nome,
            setor: paciente.setor || 'Geral'
        });
        
        showToast('Paciente excluído', 'success');
    }
}

// Renderizar histórico
function renderHistory(filteredItems = null) {
    DOM.historyList.innerHTML = '';
    
    const dateFilter = document.getElementById('historyDateFilter').value;
    const medicoFilter = document.getElementById('historyMedicoFilter').value;
    const setorFilter = document.getElementById('historySetorFilter').value;
    
    let historyToRender = filteredItems || dados.historico;
    
    historyToRender = historyToRender.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
        
        return (!dateFilter || itemDate === dateFilter) &&
               (!medicoFilter || item.medico === medicoFilter) &&
               (!setorFilter || item.setor === setorFilter);
    });
    
    historyToRender.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    if (historyToRender.length === 0) {
        DOM.historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-content">
                    <p>Nenhum registro encontrado</p>
                </div>
            </div>
        `;
        return;
    }
    
    historyToRender.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-type">${getHistoryTypeLabel(item.tipo)}</div>
            <div class="history-text">${item.texto}</div>
            <div class="history-meta">
                <span>${formatDateTimeFull(item.timestamp)}</span>
                <span>${item.medico}${item.paciente ? ' | ' + item.paciente : ''}</span>
            </div>
        `;
        DOM.historyList.appendChild(historyItem);
    });
}

// Obter label para tipo de histórico
function getHistoryTypeLabel(tipo) {
    const labels = {
        'anotacao': 'Anotação',
        'alta': 'Alta Médica',
        'novo_paciente': 'Novo Paciente',
        'exclusao': 'Exclusão',
        'passagem_plantao': 'Passagem de Plantão',
        'edicao_paciente': 'Edição de Paciente'
    };
    return labels[tipo] || tipo;
}

// Mostrar toast
function showToast(message, type = 'success') {
    DOM.toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.add('show');
    
    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3000);
}

// Mostrar erro
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Ocultar todos os erros
function hideAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', init);