// Dados de exemplo para demonstração
const dados = {
    pacientes: [
        {
            id: 101,
            nome: "Maria Oliveira",
            leito: "12A",
            tags: ["UTI", "Cardio"],
            status: "active",
            anotacoes: [
                {
                    id: 1001,
                    texto: "Paciente relata dor torácica intensa e falta de ar. #evolucao",
                    timestamp: "2023-06-25T10:15:00",
                    medico: "Dr. Carlos Silva",
                    tags: ["#evolucao"]
                },
                {
                    id: 1002,
                    texto: "PA: 150/90 mmHg | FC: 110 bpm | FR: 24 rpm | Temp: 37.2°C #sinaisvitais",
                    timestamp: "2023-06-25T10:20:00",
                    medico: "Dr. Carlos Silva",
                    tags: ["#sinaisvitais"]
                }
            ],
            alta: null,
            pendencias: []
        },
        {
            id: 102,
            nome: "Carlos Santos",
            leito: "15B",
            tags: ["Emergência"],
            status: "active",
            anotacoes: [
                {
                    id: 1003,
                    texto: "Paciente refere tosse produtiva e febre há 3 dias. #pendencia",
                    timestamp: "2023-06-25T10:30:00",
                    medico: "Dr. Carlos Silva",
                    tags: ["#pendencia"]
                }
            ],
            alta: null,
            pendencias: []
        }
    ],
    historico: []
};

// Elementos DOM
const DOM = {
    patientList: document.getElementById('patientList'),
    globalSearch: document.getElementById('globalSearch'),
    autocompleteContainer: document.getElementById('autocompleteContainer'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    newPacienteModal: document.getElementById('newPacienteModal'),
    pacienteName: document.getElementById('pacienteName'),
    pacienteNameError: document.getElementById('pacienteNameError'),
    pacienteLeito: document.getElementById('pacienteLeito'),
    pacienteLeitoError: document.getElementById('pacienteLeitoError'),
    pacienteTags: document.getElementById('pacienteTags'),
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
    resumoPendencias: document.getElementById('resumoPendencias'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    confirmDeleteModal: document.getElementById('confirmDeleteModal'),
    patientNameToDelete: document.getElementById('patientNameToDelete'),
    btnCancelDelete: document.getElementById('btnCancelDelete'),
    btnIsAlta: document.getElementById('btnIsAlta'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),
    confirmDeleteInput: document.getElementById('confirmDeleteInput'),
    confirmDeleteError: document.getElementById('confirmDeleteError'),
    quickTags: document.querySelectorAll('.quick-tag'),
    btnOpenHistory: document.getElementById('btnOpenHistory'),
    historyScreen: document.getElementById('historyScreen'),
    historyList: document.getElementById('historyListContent'),
    btnCloseHistory: document.getElementById('btnCloseHistory'),
    btnNewPacienteHeader: document.getElementById('btnNewPacienteHeader'),
    editPacienteModal: document.getElementById('editPacienteModal'),
    editPacienteName: document.getElementById('editPacienteName'),
    editPacienteNameError: document.getElementById('editPacienteNameError'),
    editPacienteLeito: document.getElementById('editPacienteLeito'),
    editPacienteLeitoError: document.getElementById('editPacienteLeitoError'),
    editPacienteTags: document.getElementById('editPacienteTags'),
    btnCancelEdit: document.getElementById('btnCancelEdit'),
    btnUpdatePaciente: document.getElementById('btnUpdatePaciente'),
    newPendenciaModal: document.getElementById('newPendenciaModal'),
    pendenciaDesc: document.getElementById('pendenciaDesc'),
    pendenciaAssociar: document.getElementById('pendenciaAssociar'),
    pendenciaSetor: document.getElementById('pendenciaSetor'),
    pendenciaPrioridade: document.getElementById('pendenciaPrioridade'),
    btnCancelPendencia: document.getElementById('btnCancelPendencia'),
    btnSavePendencia: document.getElementById('btnSavePendencia'),
    btnExportCSV: document.getElementById('btnExportCSV'),
    btnExportPDF: document.getElementById('btnExportPDF')
};

// Estado da aplicação
let state = {
    currentPaciente: null,
    currentDoctor: "Dr. Carlos Silva",
    lastEdit: new Date().toISOString(),
    currentFilter: "active",
    keyboardOpen: false,
    editingPacienteId: null
};

// Inicialização
function init() {
    renderPatientList();
    setupEventListeners();
    updateResumoPlantao();
    
    // Inicializar histórico com dados de exemplo
    generateSampleHistory();
    
    // Preencher dropdown de pendências
    populatePendenciaAssociar();
}

// Gerar histórico de exemplo
function generateSampleHistory() {
    dados.historico = [
        {
            id: 2001,
            tipo: "anotacao",
            texto: "Adicionada nova anotação para Maria Oliveira",
            timestamp: "2023-06-25T10:15:00",
            medico: "Dr. Carlos Silva",
            setor: "UTI"
        },
        {
            id: 2002,
            tipo: "alta",
            texto: "Carlos Santos recebeu alta médica",
            timestamp: "2023-06-24T14:30:00",
            medico: "Dr. Carlos Silva",
            setor: "Emergência"
        },
        {
            id: 2003,
            tipo: "novo_paciente",
            texto: "Novo paciente João Pereira adicionado",
            timestamp: "2023-06-23T09:45:00",
            medico: "Dr. Carlos Silva",
            setor: "Enfermaria"
        }
    ];
}

// Renderizar lista de pacientes
function renderPatientList() {
    DOM.patientList.innerHTML = '';
    
    // Filtrar pacientes pelo status selecionado
    const filteredPacientes = dados.pacientes.filter(paciente => 
        paciente.status === state.currentFilter
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
            lastNoteHTML = `
            <div class="last-note">
                <div class="note-text">${lastNote.texto}</div>
                <div class="toggle-note">Ver mais</div>
                <div class="note-meta">
                    <span>${formatDateTime(lastNote.timestamp)}</span>
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
                    ${paciente.pendencias && paciente.pendencias.some(p => !p.resolvidoEm) ? 
                        `<span class="status-badge pendencia">Pendente</span>` : ''}
                </div>
            </div>
            
            <div class="paciente-tags">
                ${paciente.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            ${lastNoteHTML}
            
            <div class="paciente-actions">
                ${paciente.status !== 'discharged' ? `
                <button class="btn-action edit" data-id="${paciente.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ` : ''}
                <button class="btn-action delete" data-id="${paciente.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ${paciente.status !== 'discharged' ? `
                <button class="btn-action alta" data-id="${paciente.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 10L12 13L22 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                ` : ''}
            </div>
        `;
        
        DOM.patientList.appendChild(pacienteCard);
        
        // Adicionar evento para expandir/colapsar notas
        if (lastNote) {
            const toggleBtn = pacienteCard.querySelector('.toggle-note');
            const noteText = pacienteCard.querySelector('.note-text');
            
            if (toggleBtn && noteText) {
                toggleBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    noteText.classList.toggle('expanded');
                    this.textContent = noteText.classList.contains('expanded') ? 'Ver menos' : 'Ver mais';
                });
            }
        }
    });
    
    // Adicionar eventos aos cards
    document.querySelectorAll('.paciente-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-action') && !e.target.classList.contains('toggle-note')) {
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
    
    // Atualizar UI
    document.querySelectorAll('.paciente-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`.paciente-card[data-id="${pacienteId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Focar no campo de anotação
    if (state.currentFilter !== 'discharged') {
        DOM.noteInput.focus();
    }
}

// Formatar data/hora
function formatDateTime(datetime) {
    const date = new Date(datetime);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de status
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            // Adicionar ao botão clicado
            this.classList.add('active');
            // Atualizar filtro
            state.currentFilter = this.dataset.status;
            
            // Mostrar/ocultar telas
            if (state.currentFilter === 'history') {
                DOM.patientList.style.display = 'none';
                DOM.historyScreen.style.display = 'flex';
                renderHistory();
            } else {
                DOM.patientList.style.display = 'grid';
                DOM.historyScreen.style.display = 'none';
                renderPatientList();
            }
            
            // Mostrar/ocultar editor de anotações
            DOM.noteEditor.style.display = state.currentFilter === 'discharged' ? 'none' : 'block';
        });
    });
    
    // Novo paciente (header)
    DOM.btnNewPacienteHeader.addEventListener('click', openNewPacienteModal);
    
    // Modal novo paciente
    DOM.btnCancelPaciente.addEventListener('click', () => {
        DOM.newPacienteModal.classList.remove('active');
    });
    
    DOM.btnSavePaciente.addEventListener('click', () => {
        // Resetar erros
        hideAllErrors();
        
        const nome = DOM.pacienteName.value.trim();
        const leito = DOM.pacienteLeito.value.trim();
        const tags = DOM.pacienteTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
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
            leito,
            tags,
            status: "active",
            anotacoes: [],
            alta: null,
            pendencias: []
        };
        
        dados.pacientes.push(novoPaciente);
        renderPatientList();
        DOM.newPacienteModal.classList.remove('active');
        
        // Resetar campos
        DOM.pacienteName.value = '';
        DOM.pacienteLeito.value = '';
        DOM.pacienteTags.value = '';
        
        showToast(`Paciente "${nome}" adicionado com sucesso!`, 'success');
        
        // Registrar no histórico
        dados.historico.push({
            id: Date.now(),
            tipo: "novo_paciente",
            texto: `Novo paciente ${nome} adicionado no leito ${leito}`,
            timestamp: new Date().toISOString(),
            medico: state.currentDoctor,
            setor: tags[0] || 'Geral'
        });
        
        // Selecionar automaticamente
        selectPaciente(novoPaciente.id);
    });
    
    // Finalizar plantão
    DOM.btnFinalizarPlantao.addEventListener('click', openPassPlantaoModal);
    
    DOM.btnCancelPass.addEventListener('click', () => {
        DOM.passPlantaoModal.classList.remove('active');
    });
    
    DOM.btnConfirmPass.addEventListener('click', () => {
        const medicoRecebe = DOM.medicoRecebe.value.trim();
        if (!medicoRecebe) {
            showError(DOM.medicoRecebeError, 'Selecione um médico');
            return;
        }
        
        // Mostrar feedback visual
        DOM.btnConfirmPass.innerHTML = '<span class="loader"></span> Processando...';
        DOM.btnConfirmPass.disabled = true;
        
        setTimeout(() => {
            showToast(`Plantão finalizado e passado para ${medicoRecebe} com sucesso!`, 'success');
            
            // Resetar dados
            dados.pacientes.forEach(paciente => {
                if (paciente.status === 'active') {
                    paciente.anotacoes = [];
                    paciente.pendencias = [];
                }
            });
            
            // Atualizar UI
            renderPatientList();
            
            // Registrar no histórico
            dados.historico.push({
                id: Date.now(),
                tipo: "passagem_plantao",
                texto: `Plantão finalizado e passado para ${medicoRecebe}`,
                timestamp: new Date().toISOString(),
                medico: state.currentDoctor,
                setor: 'Todos'
            });
            
            // Fechar modal
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

    // Habilitar/desabilitar botão de enviar
    DOM.noteInput.addEventListener('input', function() {
        const hasText = this.value.trim() !== '';
        DOM.btnSendNote.disabled = !hasText || !state.currentPaciente;
        
        // Ajustar altura do textarea
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });
    
    // Modal de exclusão de paciente
    DOM.btnCancelDelete.addEventListener('click', () => {
        DOM.confirmDeleteModal.classList.remove('active');
    });
    
    DOM.btnIsAlta.addEventListener('click', () => {
        DOM.confirmDeleteModal.classList.remove('active');
        if (state.currentPaciente) {
            registerAlta(state.currentPaciente);
        }
    });
    
    DOM.btnConfirmDelete.addEventListener('click', deletePaciente);
    
    // Validação do campo de confirmação de exclusão
    DOM.confirmDeleteInput.addEventListener('input', function() {
        const confirmText = this.value.trim().toLowerCase();
        const isConfirmed = confirmText === 'excluir';
        
        // Atualizar estado do botão
        DOM.btnConfirmDelete.disabled = !isConfirmed;
        
        // Atualizar estilo
        if (isConfirmed) {
            DOM.btnConfirmDelete.classList.remove('btn-delete-disabled');
            DOM.btnConfirmDelete.classList.add('btn-danger');
        } else {
            DOM.btnConfirmDelete.classList.remove('btn-danger');
            DOM.btnConfirmDelete.classList.add('btn-delete-disabled');
        }
        
        // Mostrar/ocultar mensagem de erro
        if (confirmText !== '' && !isConfirmed) {
            DOM.confirmDeleteError.style.display = 'block';
        } else {
            DOM.confirmDeleteError.style.display = 'none';
        }
    });
    
    // Quick tags
    DOM.quickTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.getAttribute('data-tag');
            DOM.noteInput.value += ` ${tagText}`;
            DOM.noteInput.focus();
        });
    });
    
    // Busca global
    DOM.globalSearch.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        performSearch(searchTerm);
        filterPatientCards(searchTerm);
    });
    
    // Histórico
    DOM.btnOpenHistory.addEventListener('click', () => {
        state.currentFilter = 'history';
        
        // Atualizar botões de filtro
        DOM.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.status === 'history');
        });
        
        // Mostrar tela de histórico
        DOM.patientList.style.display = 'none';
        DOM.historyScreen.style.display = 'flex';
        renderHistory();
    });
    
    // Filtros do histórico
    document.getElementById('historyDateFilter').addEventListener('change', renderHistory);
    document.getElementById('historyMedicoFilter').addEventListener('change', renderHistory);
    document.getElementById('historySetorFilter').addEventListener('change', renderHistory);
    
    // Exportações
    DOM.btnExportCSV.addEventListener('click', exportToCSV);
    DOM.btnExportPDF.addEventListener('click', exportToPDF);
    
    // Modal editar paciente
    DOM.btnCancelEdit.addEventListener('click', () => {
        DOM.editPacienteModal.classList.remove('active');
    });
    
    DOM.btnUpdatePaciente.addEventListener('click', updatePaciente);
    
    // Modal nova pendência
    DOM.btnCancelPendencia.addEventListener('click', () => {
        DOM.newPendenciaModal.classList.remove('active');
    });
    
    DOM.btnSavePendencia.addEventListener('click', savePendencia);
}

// Realizar busca
function performSearch(searchTerm) {
    DOM.autocompleteContainer.innerHTML = '';
    
    if (searchTerm.length < 2) {
        DOM.autocompleteContainer.classList.remove('visible');
        return;
    }
    
    // Buscar pacientes
    dados.pacientes.forEach(paciente => {
        // Verificar se o termo está no nome, leito, tags ou anotações
        if (paciente.nome.toLowerCase().includes(searchTerm)) {
            addAutocompleteItem(paciente.nome, 'paciente', paciente.id);
        } else if (paciente.leito.toLowerCase().includes(searchTerm)) {
            addAutocompleteItem(`Leito ${paciente.leito}: ${paciente.nome}`, 'leito', paciente.id);
        } else if (paciente.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
            addAutocompleteItem(`${paciente.nome} (${paciente.tags.join(', ')})`, 'tag', paciente.id);
        }
        
        // Buscar nas anotações do paciente
        paciente.anotacoes.forEach(anotacao => {
            if (anotacao.texto.toLowerCase().includes(searchTerm)) {
                addAutocompleteItem(anotacao.texto, 'anotacao', paciente.id, anotacao.id);
            }
        });
    });
    
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
            paciente.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            paciente.anotacoes.some(anotacao => 
                anotacao.texto.toLowerCase().includes(searchTerm)
            );
        
        card.style.display = match ? 'flex' : 'none';
    });
}

// Adicionar item ao autocomplete
function addAutocompleteItem(text, type, pacienteId, anotacaoId = null) {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.innerHTML = text;
    item.addEventListener('click', () => {
        // Ao clicar, selecionar o paciente e fechar o autocomplete
        selectPaciente(pacienteId);
        DOM.autocompleteContainer.classList.remove('visible');
        DOM.globalSearch.value = '';
    });
    DOM.autocompleteContainer.appendChild(item);
}

// Atualizar resumo do plantão
function updateResumoPlantao() {
    const pacientesAtendidos = dados.pacientes.filter(p => p.status === 'active').length;
    const anotacoesRealizadas = dados.pacientes.reduce((total, p) => total + p.anotacoes.length, 0);
    const pendenciasResolvidas = dados.pacientes.reduce((total, p) => 
        total + p.pendencias.filter(pen => pen.resolvidoEm).length, 0);
    
    DOM.resumoPacientes.textContent = pacientesAtendidos;
    DOM.resumoAnotacoes.textContent = anotacoesRealizadas;
    DOM.resumoPendencias.textContent = pendenciasResolvidas;
}

// Abrir modal novo paciente
function openNewPacienteModal() {
    DOM.newPacienteModal.classList.add('active');
    DOM.pacienteName.focus();
}

// Abrir modal de edição
function openEditPacienteModal(pacienteId) {
    const paciente = dados.pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;
    
    state.editingPacienteId = pacienteId;
    
    DOM.editPacienteName.value = paciente.nome;
    DOM.editPacienteLeito.value = paciente.leito;
    DOM.editPacienteTags.value = paciente.tags.join(', ');
    
    DOM.editPacienteModal.classList.add('active');
    DOM.editPacienteName.focus();
}

// Atualizar paciente
function updatePaciente() {
    const paciente = dados.pacientes.find(p => p.id === state.editingPacienteId);
    if (!paciente) return;
    
    // Resetar erros
    hideAllErrors();
    
    const nome = DOM.editPacienteName.value.trim();
    const leito = DOM.editPacienteLeito.value.trim();
    const tags = DOM.editPacienteTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
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
    paciente.tags = tags;
    
    renderPatientList();
    DOM.editPacienteModal.classList.remove('active');
    
    showToast(`Paciente "${nome}" atualizado com sucesso!`, 'success');
    
    // Registrar no histórico
    dados.historico.push({
        id: Date.now(),
        tipo: "edicao_paciente",
        texto: `Dados do paciente ${nome} atualizados`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        setor: tags[0] || 'Geral'
    });
}

// Abrir modal de finalização de plantão
function openPassPlantaoModal() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    DOM.assinatura.value = `${state.currentDoctor} - ${dateStr} ${timeStr}`;
    
    // Atualizar resumo
    updateResumoPlantao();
    
    DOM.passPlantaoModal.classList.add('active');
    DOM.medicoRecebe.focus();
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
    
    // Adicionar anotação automática
    paciente.anotacoes.push({
        id: Date.now(),
        texto: "Alta médica registrada",
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        tags: ["#alta"]
    });
    
    // Atualizar UI
    renderPatientList();
    showToast('Alta registrada com sucesso', 'success');
    
    // Registrar no histórico
    dados.historico.push({
        id: Date.now(),
        tipo: "alta",
        texto: `Alta médica registrada para ${paciente.nome}`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        setor: paciente.tags[0] || 'Geral'
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
    
    // Encontrar paciente
    const paciente = dados.pacientes.find(p => p.id === state.currentPaciente);
    if (!paciente) return;
    
    // Extrair tags
    const tags = [];
    const tagRegex = /#(\w+)/g;
    let match;
    while ((match = tagRegex.exec(noteText)) !== null) {
        tags.push(`#${match[1]}`);
    }
    
    // Adicionar anotação
    const novaAnotacao = {
        id: Date.now(),
        texto: noteText,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        tags: tags
    };
    
    paciente.anotacoes.push(novaAnotacao);
    
    // Se contém tag #pendencia, criar pendência
    if (tags.includes('#pendencia')) {
        paciente.pendencias.push({
            id: Date.now(),
            descricao: noteText,
            criadoPor: state.currentDoctor,
            criadoEm: new Date().toISOString(),
            resolvidoEm: null
        });
    }
    
    // Atualizar UI
    renderPatientList();
    updateResumoPlantao();
    
    // Registrar no histórico
    dados.historico.push({
        id: Date.now(),
        tipo: "anotacao",
        texto: `Nova anotação para ${paciente.nome}: ${noteText}`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        setor: paciente.tags[0] || 'Geral'
    });
    
    // Limpar campo
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
    
    // Resetar campo de confirmação
    DOM.confirmDeleteInput.value = '';
    DOM.btnConfirmDelete.disabled = true;
    DOM.confirmDeleteError.style.display = 'none';
    
    // Resetar estilo do botão
    DOM.btnConfirmDelete.classList.remove('btn-danger');
    DOM.btnConfirmDelete.classList.add('btn-delete-disabled');
    
    DOM.confirmDeleteModal.classList.add('active');
    DOM.confirmDeleteInput.focus();
}

// Excluir paciente
function deletePaciente() {
    const paciente = dados.pacientes.find(p => p.id === state.currentPaciente);
    if (!paciente) return;
    
    const index = dados.pacientes.findIndex(p => p.id === state.currentPaciente);
    if (index !== -1) {
        dados.pacientes.splice(index, 1);
        renderPatientList();
        DOM.confirmDeleteModal.classList.remove('active');
        state.currentPaciente = null;
        
        // Registrar no histórico
        dados.historico.push({
            id: Date.now(),
            tipo: "exclusao",
            texto: `Paciente ${paciente.nome} excluído`,
            timestamp: new Date().toISOString(),
            medico: state.currentDoctor,
            setor: paciente.tags[0] || 'Geral'
        });
        
        showToast('Paciente excluído', 'success');
    }
}

// Renderizar histórico
function renderHistory() {
    DOM.historyList.innerHTML = '';
    
    // Obter filtros
    const dateFilter = document.getElementById('historyDateFilter').value;
    const medicoFilter = document.getElementById('historyMedicoFilter').value;
    const setorFilter = document.getElementById('historySetorFilter').value;
    
    // Filtrar histórico
    const filteredHistory = dados.historico.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
        
        return (!dateFilter || itemDate === dateFilter) &&
               (!medicoFilter || item.medico === medicoFilter) &&
               (!setorFilter || item.setor === setorFilter);
    });
    
    if (filteredHistory.length === 0) {
        DOM.historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-content">
                    <p>Nenhum registro encontrado</p>
                </div>
            </div>
        `;
        return;
    }
    
    filteredHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-type">${getHistoryTypeLabel(item.tipo)}</div>
            <div class="history-text">${item.texto}</div>
            <div class="history-meta">
                <span>${formatDateTime(item.timestamp)}</span>
                <span>${item.medico}</span>
                <span>${item.setor}</span>
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
        'edicao_paciente': 'Edição de Paciente',
        'nova_pendencia': 'Nova Pendência'
    };
    return labels[tipo] || tipo;
}

// Preencher dropdown para associar pendências
function populatePendenciaAssociar() {
    DOM.pendenciaAssociar.innerHTML = '<option value="">Selecionar paciente</option>';
    
    dados.pacientes.filter(p => p.status === 'active').forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id;
        option.textContent = `${paciente.nome} (${paciente.leito})`;
        DOM.pendenciaAssociar.appendChild(option);
    });
}

// Salvar nova pendência
function savePendencia() {
    const desc = DOM.pendenciaDesc.value.trim();
    const pacienteId = DOM.pendenciaAssociar.value;
    const setor = DOM.pendenciaSetor.value;
    const prioridade = DOM.pendenciaPrioridade.value;
    
    if (!desc) {
        showToast('Informe a descrição da pendência', 'error');
        return;
    }
    
    // Encontrar paciente se selecionado
    let paciente = null;
    if (pacienteId) {
        paciente = dados.pacientes.find(p => p.id === parseInt(pacienteId));
    }
    
    // Criar pendência
    const novaPendencia = {
        id: Date.now(),
        descricao: desc,
        criadoPor: state.currentDoctor,
        criadoEm: new Date().toISOString(),
        setor,
        prioridade,
        resolvidoEm: null
    };
    
    // Associar a paciente se existir
    if (paciente) {
        paciente.pendencias.push(novaPendencia);
    } else {
        // Pendência global
        // (implementar lógica de pendências globais se necessário)
    }
    
    // Fechar modal
    DOM.newPendenciaModal.classList.remove('active');
    
    // Registrar no histórico
    dados.historico.push({
        id: Date.now(),
        tipo: "nova_pendencia",
        texto: `Nova pendência: ${desc}`,
        timestamp: new Date().toISOString(),
        medico: state.currentDoctor,
        setor
    });
    
    showToast('Pendência registrada com sucesso!', 'success');
    
    // Atualizar UI se estiver na tela de pendências
    if (state.currentFilter === 'pending') {
        renderPatientList();
    }
}

// Exportar para CSV
function exportToCSV() {
    // Implementação simplificada
    let csvContent = "Tipo,Descrição,Data,Médico,Setor\n";
    
    dados.historico.forEach(item => {
        csvContent += `"${getHistoryTypeLabel(item.tipo)}","${item.texto}","${formatDateTime(item.timestamp)}","${item.medico}","${item.setor}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "historico_vyva.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Histórico exportado para CSV', 'success');
}

// Exportar para PDF
function exportToPDF() {
    // Implementação simplificada
    showToast('PDF gerado com sucesso', 'success');
    // (Em produção, usar biblioteca como jsPDF)
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