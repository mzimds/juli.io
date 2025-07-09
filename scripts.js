// Dados de exemplo para demonstração
        const dados = {
            setores: [
                {
                    id: 1,
                    nome: "UTI Adulto",
                    turnos: [
                        { nome: "Manhã", inicio: "07:00", fim: "12:00" },
                        { nome: "Tarde", inicio: "13:00", fim: "18:00" },
                        { nome: "Noite", inicio: "19:00", fim: "23:00" }
                    ],
                    pacientes: [
                        {
                            id: 101,
                            nome: "Maria Oliveira",
                            idade: 68,
                            sexo: "F",
                            leito: "12A",
                            atendimento: "2023001",
                            anotacoes: [
                                {
                                    id: 1001,
                                    texto: "Paciente relata dor torácica intensa e falta de ar.",
                                    timestamp: "2023-06-25T10:15:00",
                                    medico: "Dr. Carlos Silva",
                                    tipo: "texto"
                                },
                                {
                                    id: 1002,
                                    texto: "PA: 150/90 mmHg | FC: 110 bpm | FR: 24 rpm | Temp: 37.2°C",
                                    timestamp: "2023-06-25T10:20:00",
                                    medico: "Dr. Carlos Silva",
                                    tipo: "texto"
                                }
                            ],
                            alta: null,
                            pendencias: []
                        },
                        {
                            id: 102,
                            nome: "Carlos Santos",
                            idade: 55,
                            sexo: "M",
                            leito: "15B",
                            atendimento: "2023002",
                            anotacoes: [
                                {
                                    id: 1003,
                                    texto: "Paciente refere tosse produtiva e febre há 3 dias.",
                                    timestamp: "2023-06-25T10:30:00",
                                    medico: "Dr. Carlos Silva",
                                    tipo: "texto"
                                }
                            ],
                            alta: null,
                            pendencias: [
                                {
                                    id: 2001,
                                    titulo: "Exames pendentes",
                                    descricao: "Realizar tomografia de tórax",
                                    criadoPor: "Dr. Carlos Silva",
                                    criadoEm: "2023-06-25T10:35:00",
                                    resolvidoEm: null
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    nome: "Emergência",
                    turnos: [
                        { nome: "Manhã", inicio: "07:00", fim: "12:00" },
                        { nome: "Tarde", inicio: "13:00", fim: "18:00" },
                        { nome: "Noite", inicio: "19:00", fim: "23:00" }
                    ],
                    pacientes: [
                        {
                            id: 201,
                            nome: "João Pereira",
                            idade: 42,
                            sexo: "M",
                            leito: "5",
                            atendimento: "2023003",
                            anotacoes: [],
                            alta: null,
                            pendencias: []
                        }
                    ]
                }
            ],
            historico: []
        };

        // Elementos DOM
        const DOM = {
            sidebar: document.getElementById('sidebar'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            setoresList: document.getElementById('setoresList'),
            btnNewSetor: document.getElementById('btnNewSetor'),
            patientTitle: document.getElementById('patientTitle'),
            patientDetails: document.getElementById('patientDetails'),
            patientToggle: document.getElementById('patientToggle'),
            searchInput: document.getElementById('searchInput'),
            autocompleteContainer: document.getElementById('autocompleteContainer'),
            soapTabs: document.querySelectorAll('.soap-tab'),
            editorContents: document.querySelectorAll('.editor-content'),
            btnPassPlantaoSidebar: document.getElementById('btnPassPlantaoSidebar'),
            btnPassPlantaoHeader: document.getElementById('btnPassPlantaoHeader'),
            passPlantaoModal: document.getElementById('passPlantaoModal'),
            btnCancelPass: document.getElementById('btnCancelPass'),
            btnConfirmPass: document.getElementById('btnConfirmPass'),
            medicoRecebe: document.getElementById('medicoRecebe'),
            medicoRecebeError: document.getElementById('medicoRecebeError'),
            assinatura: document.getElementById('assinatura'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toast-message'),
            newSetorModal: document.getElementById('newSetorModal'),
            setorName: document.getElementById('setorName'),
            setorNameError: document.getElementById('setorNameError'),
            btnCancelSetor: document.getElementById('btnCancelSetor'),
            btnSaveSetor: document.getElementById('btnSaveSetor'),
            newPacienteModal: document.getElementById('newPacienteModal'),
            pacienteName: document.getElementById('pacienteName'),
            pacienteNameError: document.getElementById('pacienteNameError'),
            pacienteIdade: document.getElementById('pacienteIdade'),
            pacienteIdadeError: document.getElementById('pacienteIdadeError'),
            pacienteSexo: document.getElementById('pacienteSexo'),
            pacienteSexoError: document.getElementById('pacienteSexoError'),
            pacienteLeito: document.getElementById('pacienteLeito'),
            pacienteLeitoError: document.getElementById('pacienteLeitoError'),
            pacienteAtendimento: document.getElementById('pacienteAtendimento'),
            pacienteAtendimentoError: document.getElementById('pacienteAtendimentoError'),
            btnCancelPaciente: document.getElementById('btnCancelPaciente'),
            btnSavePaciente: document.getElementById('btnSavePaciente'),
            altaModal: document.getElementById('altaModal'),
            tipoAlta: document.getElementById('tipoAlta'),
            tipoAltaError: document.getElementById('tipoAltaError'),
            dataAlta: document.getElementById('dataAlta'),
            dataAltaError: document.getElementById('dataAltaError'),
            obsAlta: document.getElementById('obsAlta'),
            btnCancelAlta: document.getElementById('btnCancelAlta'),
            btnConfirmAlta: document.getElementById('btnConfirmAlta'),
            chatHistory: document.getElementById('chatHistory'),
            messageInput: document.getElementById('messageInput'),
            btnSendMessage: document.getElementById('btnSendMessage'),
            currentSetorCount: document.getElementById('currentSetorCount'),
            progressFill: document.getElementById('progressFill'),
            maxSetorMessage: document.getElementById('maxSetorMessage'),
            maxSetor: document.getElementById('maxSetor'),
            patientHeader: document.getElementById('patientHeader'),
            editorContainer: document.getElementById('editorContainer'),
            turnosContainer: document.getElementById('turnosContainer'),
            turnosError: document.getElementById('turnosError'),
            selectionModal: document.getElementById('selectionModal'),
            selectionModalContent: document.getElementById('selectionModalContent'),
            btnContextMenu: document.getElementById('btnContextMenu'),
            contextMenu: document.getElementById('contextMenu'),
            pendenciaModal: document.getElementById('pendenciaModal'),
            pendenciaTitulo: document.getElementById('pendenciaTitulo'),
            pendenciaTituloError: document.getElementById('pendenciaTituloError'),
            outraPendencia: document.getElementById('outraPendencia'),
            outraPendenciaGroup: document.getElementById('outraPendenciaGroup'),
            pendenciaDesc: document.getElementById('pendenciaDesc'),
            pendenciaDescError: document.getElementById('pendenciaDescError'),
            btnCancelPendencia: document.getElementById('btnCancelPendencia'),
            btnSavePendencia: document.getElementById('btnSavePendencia'),
            pendenciasContainer: document.getElementById('pendenciasContainer'),
            selectionModalContent: document.getElementById('selectionModalContent'),
            patientActions: document.getElementById('patientActions'),
            confirmDeleteModal: document.getElementById('confirmDeleteModal'),
            patientNameToDelete: document.getElementById('patientNameToDelete'),
            btnCancelDelete: document.getElementById('btnCancelDelete'),
            btnIsAlta: document.getElementById('btnIsAlta'),
            btnConfirmDelete: document.getElementById('btnConfirmDelete'),
            confirmDeleteInput: document.getElementById('confirmDeleteInput'),
            confirmDeleteError: document.getElementById('confirmDeleteError')
        };

        // Estado da aplicação
        let state = {
            currentSetor: null,
            currentPaciente: null,
            currentDoctor: "Dr. Carlos Silva",
            lastEdit: new Date().toISOString(),
            turnoCount: 0,
            keyboardOpen: false,
            resizeTimer: null
        };

        // Função para destacar termos de busca
        function highlightText(text, searchTerm) {
            if (!searchTerm) return text;
            
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        // Função para pesquisar pacientes e setores
        function searchContent(searchTerm) {
            const results = {
                setores: [],
                pacientes: []
            };
            
            if (!searchTerm) {
                return results;
            }
            
            const term = searchTerm.toLowerCase();
            
            // Procurar em setores
            dados.setores.forEach(setor => {
                if (setor.nome.toLowerCase().includes(term)) {
                    results.setores.push({
                        id: setor.id,
                        nome: setor.nome,
                        type: 'setor'
                    });
                }
                
                // Procurar em pacientes
                setor.pacientes.forEach(paciente => {
                    if (paciente.nome.toLowerCase().includes(term)) {
                        results.pacientes.push({
                            id: paciente.id,
                            nome: paciente.nome,
                            setorId: setor.id,
                            setorNome: setor.nome,
                            type: 'paciente'
                        });
                    }
                });
            });
            
            return results;
        }

        // Renderizar resultados do autocomplete
        function renderAutocomplete(results, searchTerm) {
            DOM.autocompleteContainer.innerHTML = '';
            
            if (results.pacientes.length === 0 && results.setores.length === 0) {
                DOM.autocompleteContainer.classList.remove('visible');
                return;
            }
            
            // Adicionar pacientes
            if (results.pacientes.length > 0) {
                results.pacientes.forEach(paciente => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.innerHTML = `
                        <div>
                            <div>${highlightText(paciente.nome, searchTerm)}</div>
                            <div style="font-size: 0.8rem; color: var(--gray);">${paciente.setorNome}</div>
                        </div>
                    `;
                    
                    item.addEventListener('click', () => {
                        DOM.searchInput.value = '';
                        DOM.autocompleteContainer.classList.remove('visible');
                        selectPaciente(paciente.id);
                    });
                    
                    DOM.autocompleteContainer.appendChild(item);
                });
            }
            
            // Adicionar setores
            if (results.setores.length > 0) {
                results.setores.forEach(setor => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.innerHTML = `
                        <div>${highlightText(setor.nome, searchTerm)}</div>
                    `;
                    
                    item.addEventListener('click', () => {
                        DOM.searchInput.value = '';
                        DOM.autocompleteContainer.classList.remove('visible');
                        state.currentSetor = setor.id;
                        renderSetores();
                    });
                    
                    DOM.autocompleteContainer.appendChild(item);
                });
            }
            
            DOM.autocompleteContainer.classList.add('visible');
        }

        // Inicialização
        function init() {
            renderSetores();
            setupEventListeners();
            updateTime();
            setInterval(updateTime, 60000);
            updateSetorProgress();
            setupKeyboardDetection();
            
            // Garantir que o botão do header esteja oculto em mobile inicialmente
            if (window.innerWidth <= 992) {
                DOM.btnPassPlantaoHeader.classList.add('hidden');
            }
            
            // Inicializar turnos
            addTurno();
            
            // Cenário 1: Se não houver setores, abrir modal de novo setor
            if (dados.setores.length === 0) {
                setTimeout(() => {
                    openNewSetorModal();
                }, 300);
            }
            
            // Cenário 2: Se mobile e não há paciente selecionado, abrir modal de seleção
            if (window.innerWidth <= 992 && !state.currentPaciente && dados.setores.length > 0) {
                setTimeout(() => {
                    openSelectionModal();
                }, 300);
            }
        }
        
        // Detectar quando o teclado virtual é aberto/fechado
        function setupKeyboardDetection() {
            // Para iOS
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', handleViewportResize);
            }
            
            // Eventos de foco para detectar quando o input está ativo
            DOM.messageInput.addEventListener('focus', () => {
                state.keyboardOpen = true;
                document.body.classList.add('keyboard-open');
                scrollToLatestMessage();
            });
            
            DOM.messageInput.addEventListener('blur', () => {
                setTimeout(() => {
                    state.keyboardOpen = false;
                    document.body.classList.remove('keyboard-open');
                }, 300);
            });
        }
        
        function handleViewportResize() {
            // iOS usa visualViewport para detectar mudanças no teclado
            const viewport = window.visualViewport;
            const keyboardHeight = window.innerHeight - viewport.height;
            
            if (keyboardHeight > 100) {
                state.keyboardOpen = true;
                document.body.classList.add('keyboard-open');
                scrollToLatestMessage();
            } else {
                state.keyboardOpen = false;
                document.body.classList.remove('keyboard-open');
            }
        }
        
        function scrollToLatestMessage() {
            if (DOM.chatHistory.children.length > 0) {
                const lastMessage = DOM.chatHistory.lastElementChild;
                lastMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
        }

        // Atualizar barra de progresso de setores
        function updateSetorProgress() {
            const count = dados.setores.length;
            const max = 5;
            const percentage = (count / max) * 100;
            
            DOM.currentSetorCount.textContent = count;
            DOM.maxSetor.textContent = max;
            
            DOM.progressFill.style.width = `${percentage}%`;
            
            if (count >= max) {
                DOM.maxSetorMessage.style.display = 'inline';
                DOM.btnNewSetor.disabled = true;
                DOM.btnNewSetor.classList.add('disabled');
            } else {
                DOM.maxSetorMessage.style.display = 'none';
                DOM.btnNewSetor.disabled = false;
                DOM.btnNewSetor.classList.remove('disabled');
            }
        }

        // Renderizar setores e pacientes
        function renderSetores(container = DOM.setoresList, isModal = false) {
            container.innerHTML = '';
            
            // Se não houver setores, mostrar mensagem
            if (dados.setores.length === 0) {
                container.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: var(--gray);">
                        <p>Nenhum setor criado</p>
                        ${isModal ? '' : `<button class="btn" style="margin-top: 15px;" id="btnFirstSetor">Criar Primeiro Setor</button>`}
                    </div>
                `;
                
                if (!isModal) {
                    document.getElementById('btnFirstSetor').addEventListener('click', openNewSetorModal);
                }
                return;
            }
            
            dados.setores.forEach(setor => {
                const isExpanded = state.currentSetor === setor.id;
                
                const setorEl = document.createElement('div');
                setorEl.className = `setor-item ${isExpanded ? 'expanded' : ''} ${state.currentSetor === setor.id ? 'active' : ''}`;
                setorEl.innerHTML = `
                    <div class="setor-name">
                        <span>${setor.nome}</span>
                        <span>${setor.pacientes.length}</span>
                    </div>
                    <div class="pacientes-container">
                        ${setor.pacientes.map(paciente => `
                            <div class="paciente-item ${state.currentPaciente === paciente.id ? 'active' : ''}" data-id="${paciente.id}">
                                <div class="paciente-info">
                                    <div class="paciente-header">
                                        <div class="paciente-name">${paciente.nome}</div>
                                        <div class="paciente-status">
                                            ${paciente.alta ? `<span class="status-badge alta">Alta</span>` : ''}
                                            ${paciente.pendencias && paciente.pendencias.some(p => !p.resolvidoEm) ? `<span class="badge pendencia-badge">Pendência</span>` : ''}
                                        </div>
                                    </div>
                                    <div class="paciente-details">
                                        <span>${paciente.idade} anos</span>
                                        <strong>${paciente.leito}</strong>
                                        <strong>${paciente.atendimento}</strong>
                                        ${paciente.alta ? `<span class="alta-item">${formatAltaType(paciente.alta.tipo)}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        ${isModal ? '' : `<button class="btn" style="margin-top: 10px; width: 100%;" data-setor="${setor.id}">Adicionar Paciente</button>`}
                    </div>
                `;
                
                setorEl.addEventListener('click', (e) => {
                    if (!e.target.closest('.paciente-item') && !e.target.closest('button')) {
                        if (state.currentSetor === setor.id) {
                            state.currentSetor = null;
                        } else {
                            state.currentSetor = setor.id;
                        }
                        renderSetores(container, isModal);
                    }
                });
                
                container.appendChild(setorEl);
                
                // Eventos para pacientes
                setorEl.querySelectorAll('.paciente-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const pacienteId = parseInt(item.getAttribute('data-id'));
                        selectPaciente(pacienteId);
                        if (isModal) {
                            DOM.selectionModal.classList.remove('active');
                        }
                    });
                });
                
                // Evento para botão de adicionar paciente
                if (!isModal) {
                    setorEl.querySelector('button').addEventListener('click', (e) => {
                        e.stopPropagation();
                        openNewPacienteModal(setor.id);
                    });
                }
            });
        }

        // Formatar tipo de alta
        function formatAltaType(tipo) {
            const tipos = {
                'melhora': 'Alta por melhora',
                'pedido': 'Alta a pedido',
                'domiciliar': 'Alta domiciliar',
                'retorno': 'Alta com retorno',
                'obito': 'Óbito',
                'transferencia': 'Transferência',
                'administrativa': 'Alta administrativa',
                'contra_indicacao': 'Alta contra indicação'
            };
            return tipos[tipo] || tipo;
        }
        
        // Formatar data
        function formatDate(datetime) {
            const date = new Date(datetime);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        
        // Formatar data/hora
        function formatDateTime(datetime) {
            const date = new Date(datetime);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Selecionar paciente
        function selectPaciente(pacienteId) {
            let paciente = null;
            let setor = null;
            
            // Encontrar paciente e setor
            for (const s of dados.setores) {
                paciente = s.pacientes.find(p => p.id === pacienteId);
                if (paciente) {
                    setor = s;
                    break;
                }
            }
            
            if (!paciente) return;
            
            state.currentSetor = setor.id;
            state.currentPaciente = paciente.id;
            
            // Marcar como paciente selecionado (para mostrar ícones)
            DOM.patientHeader.classList.add('patient-selected');
            
            // Atualizar header do paciente
            DOM.patientTitle.innerHTML = `
                <span>${paciente.nome}</span>
            `;
            
            let detailsHTML = `
                <div class="detail-item">${paciente.idade} anos, ${paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}</div>
                <div class="detail-item">Leito: ${paciente.leito}</div>
                <div class="detail-item">Atendimento: ${paciente.atendimento}</div>
            `;
            
            DOM.patientDetails.innerHTML = detailsHTML;
            
            // Mostrar ações do paciente
            DOM.patientActions.style.display = 'flex';
            
            // Renderizar pendências individuais
            renderPendencias(paciente);
            
            // Mostrar toggle de detalhes
            DOM.patientDetails.style.display = 'none';
            
            // Carregar histórico de mensagens
            renderChatHistory(paciente);
            
            // Atualizar sidebar
            renderSetores();
            
            // Fechar menu no mobile
            if (window.innerWidth <= 992) {
                DOM.sidebar.classList.remove('open');
                DOM.mobileMenuBtn.classList.remove('open');
            }
            
            // CORREÇÃO: Garantir que o editor seja exibido
            DOM.editorContainer.style.display = 'flex';
        }
        
        // Renderizar pendências
        function renderPendencias(paciente) {
            DOM.pendenciasContainer.innerHTML = '';
            
            if (!paciente.pendencias || paciente.pendencias.length === 0) {
                DOM.pendenciasContainer.style.display = 'none';
                return;
            }
            
            // Filtrar apenas pendências não resolvidas
            const pendenciasAtivas = paciente.pendencias.filter(p => !p.resolvidoEm);
            
            if (pendenciasAtivas.length === 0) {
                DOM.pendenciasContainer.style.display = 'none';
                return;
            }
            
            DOM.pendenciasContainer.style.display = 'block';
            
            pendenciasAtivas.forEach((pendencia) => {
                const pendenciaCard = document.createElement('div');
                pendenciaCard.className = 'pendencia-card';
                
                // Formatar data/hora
                const date = new Date(pendencia.criadoEm);
                const dateStr = date.toLocaleDateString('pt-BR');
                const timeStr = date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                
                pendenciaCard.innerHTML = `
                    <div class="pendencia-content">
                        <div class="pendencia-header" onclick="togglePendencia(this)">
                            <div class="pendencia-header-info">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--lavender)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="var(--lavender)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="var(--lavender)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <div>
                                    <div class="pendencia-title">${pendencia.titulo}</div>
                                    <div class="pendencia-meta">${pendencia.criadoPor} • ${dateStr} ${timeStr}</div>
                                </div>
                            </div>
                        </div>
                        <div class="pendencia-desc">${pendencia.descricao}</div>
                        <div class="pendencia-footer">
                            <button class="btn-resolver" data-id="${pendencia.id}">Resolver</button>
                        </div>
                    </div>
                `;
                
                // Evento para resolver pendência
                pendenciaCard.querySelector('.btn-resolver').addEventListener('click', function() {
                    const pendenciaId = this.getAttribute('data-id');
                    resolverPendencia(pendenciaId);
                });
                
                DOM.pendenciasContainer.appendChild(pendenciaCard);
            });
        }

        // Alternar visibilidade da pendência
        function togglePendencia(element) {
            const card = element.closest('.pendencia-card');
            card.classList.toggle('expanded');
        }

        // Atualizar estado vazio
        function updateEmptyState() {
            // Se houver setores mas nenhum paciente selecionado
            if (!state.currentPaciente) {
                DOM.patientTitle.innerHTML = '<span>Selecione um paciente</span>';
                DOM.patientDetails.style.display = 'none';
                DOM.patientHeader.classList.remove('patient-selected');
                DOM.patientActions.style.display = 'none';
                DOM.pendenciasContainer.style.display = 'none';
                DOM.chatHistory.innerHTML = '';
            } 
            // Se houver paciente selecionado
            else {
                // Garantir que o editor seja exibido
                DOM.editorContainer.style.display = 'flex';
            }
        }

        // Renderizar histórico de mensagens
        function renderChatHistory(paciente) {
            DOM.chatHistory.innerHTML = '';
            
            if (!paciente.anotacoes || paciente.anotacoes.length === 0) {
                DOM.chatHistory.innerHTML = '<div class="message message-system">Nenhuma anotação registrada</div>';
                return;
            }
            
            // Ordenar mensagens por data
            paciente.anotacoes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            paciente.anotacoes.forEach(msg => {
                const messageEl = document.createElement('div');
                const date = new Date(msg.timestamp);
                const timeString = date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                
                messageEl.className = `message ${msg.medico ? 'message-doctor' : 'message-system'}`;
                
                // Formatar a data para DD/MM/AAAA HH:MM
                const dateStr = date.toLocaleDateString('pt-BR');
                const timeStr = date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                
                messageEl.innerHTML = `
                    <div>${msg.texto}</div>
                    ${msg.medico ? 
                        `<div class="message-signature">${msg.medico} - ${dateStr} ${timeStr}</div>` : 
                        `<div class="message-timestamp">${timeString}</div>`
                    }
                `;
                
                DOM.chatHistory.appendChild(messageEl);
            });
            
            // Rolagem automática para o final
            setTimeout(() => {
                scrollToLatestMessage();
            }, 50);
        }

        // Configurar event listeners
        function setupEventListeners() {
            // Menu mobile
            DOM.mobileMenuBtn.addEventListener('click', () => {
                const wasOpen = DOM.sidebar.classList.contains('open');
                DOM.sidebar.classList.toggle('open');
                DOM.mobileMenuBtn.classList.toggle('open');

                if (wasOpen) {
                    // Se estava aberto e agora fechou, colapsar todos os setores
                    state.currentSetor = null;
                } else {
                    // Se estava fechado e agora abriu, renderizar os setores (já colapsados)
                    renderSetores();
                }
            });
            
            // Fechar menu lateral ao clicar fora (mobile)
            document.addEventListener('click', function(event) {
                const isClickInsideSidebar = DOM.sidebar.contains(event.target);
                const isClickOnMenuButton = DOM.mobileMenuBtn.contains(event.target);
                
                if (window.innerWidth <= 992 && DOM.sidebar.classList.contains('open') && 
                    !isClickInsideSidebar && !isClickOnMenuButton) {
                    DOM.sidebar.classList.remove('open');
                    DOM.mobileMenuBtn.classList.remove('open');
                }
            });
            
            // Novo setor
            DOM.btnNewSetor.addEventListener('click', openNewSetorModal);
            
            // Autocomplete
            DOM.searchInput.addEventListener('input', function() {
                const searchTerm = this.value.trim();
                if (searchTerm.length > 1) {
                    const results = searchContent(searchTerm.toLowerCase());
                    renderAutocomplete(results, searchTerm);
                } else {
                    DOM.autocompleteContainer.classList.remove('visible');
                    renderSetores();
                }
            });
            
            // Fechar autocomplete ao clicar fora
            document.addEventListener('click', (e) => {
                if (!DOM.searchInput.contains(e.target) && !DOM.autocompleteContainer.contains(e.target)) {
                    DOM.autocompleteContainer.classList.remove('visible');
                }
            });
            
            // Quick actions
            document.querySelectorAll('.quick-action').forEach(action => {
                action.addEventListener('click', function() {
                    const textToAdd = this.getAttribute('data-text');
                    if(textToAdd) {
                        DOM.messageInput.value = textToAdd;
                        DOM.messageInput.focus();
                        DOM.btnSendMessage.disabled = false;
                    }
                });
            });
            
            // Passar plantão
            DOM.btnPassPlantaoSidebar.addEventListener('click', openPassPlantaoModal);
            DOM.btnPassPlantaoHeader.addEventListener('click', openPassPlantaoModal);
            
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
                    showToast(`Plantão passado para ${medicoRecebe} com sucesso!`, 'success');
                    DOM.passPlantaoModal.classList.remove('active');
                    DOM.btnConfirmPass.innerHTML = 'Confirmar Passagem';
                    DOM.btnConfirmPass.disabled = false;
                    DOM.medicoRecebe.value = '';
                }, 1500);
            });
            
            // Modal novo setor
            DOM.btnCancelSetor.addEventListener('click', () => {
                DOM.newSetorModal.classList.remove('active');
            });
            
            DOM.btnSaveSetor.addEventListener('click', () => {
                // Resetar erros
                hideAllErrors();
                
                const nomeSetor = DOM.setorName.value.trim();
                if (!nomeSetor) {
                    showError(DOM.setorNameError, 'Informe o nome do setor');
                    DOM.setorName.focus();
                    return;
                }
                
                // Validar turnos
                const turnos = [];
                const turnoElements = document.querySelectorAll('.turno-section');
                let hasTurnoError = false;
                
                if (turnoElements.length === 0) {
                    showError(DOM.turnosError, 'Adicione pelo menos um turno');
                    return;
                }
                
                // Coletar e validar turnos
                for (let i = 0; i < turnoElements.length; i++) {
                    const turnoEl = turnoElements[i];
                    const nomeTurno = turnoEl.querySelector('.turno-name').value.trim();
                    const inicio = turnoEl.querySelector('.turno-inicio').value;
                    const fim = turnoEl.querySelector('.turno-fim').value;
                    
                    if (!nomeTurno) {
                        showError(turnoEl.querySelector('.turno-name-error'), 'Informe o nome do turno');
                        hasTurnoError = true;
                    }
                    
                    if (!inicio) {
                        showError(turnoEl.querySelector('.turno-inicio-error'), 'Informe o horário de início');
                        hasTurnoError = true;
                    }
                    
                    if (!fim) {
                        showError(turnoEl.querySelector('.turno-fim-error'), 'Informe o horário de término');
                        hasTurnoError = true;
                    }
                    
                    if (inicio && fim && inicio >= fim) {
                        showError(turnoEl.querySelector('.turno-fim-error'), 'Término deve ser após o início');
                        hasTurnoError = true;
                    }
                    
                    if (!hasTurnoError) {
                        turnos.push({
                            nome: nomeTurno,
                            inicio: inicio,
                            fim: fim
                        });
                    }
                }
                
                if (hasTurnoError) return;
                
                // Verificar sobreposição de turnos
                if (hasSobreposicaoTurnos(turnos)) {
                    showToast('Existe sobreposição de horários entre turnos', 'error');
                    return;
                }
                
                const novoSetor = {
                    id: Date.now(),
                    nome: nomeSetor,
                    turnos: turnos,
                    pacientes: []
                };
                
                dados.setores.push(novoSetor);
                renderSetores();
                DOM.newSetorModal.classList.remove('active');
                DOM.setorName.value = '';
                updateSetorProgress();
                showToast(`Setor "${nomeSetor}" criado com sucesso!`, 'success');
                
                // Se for o primeiro setor, abrir modal de seleção em mobile
                if (dados.setores.length === 1 && window.innerWidth <= 992) {
                    setTimeout(() => {
                        openSelectionModal();
                    }, 300);
                }
            });
            
            // Botão para adicionar turno
            DOM.turnosContainer.addEventListener('click', function(e) {
                if (e.target.closest('.btn-add-turno')) {
                    addTurno();
                }
            });
            
            // Modal novo paciente
            DOM.btnCancelPaciente.addEventListener('click', () => {
                DOM.newPacienteModal.classList.remove('active');
            });
            
            DOM.btnSavePaciente.addEventListener('click', () => {
                // Resetar erros
                hideAllErrors();
                
                const nome = DOM.pacienteName.value.trim();
                const idade = parseInt(DOM.pacienteIdade.value);
                const sexo = DOM.pacienteSexo.value;
                const leito = DOM.pacienteLeito.value.trim();
                const atendimento = DOM.pacienteAtendimento.value.trim();
                
                if (!nome) {
                    showError(DOM.pacienteNameError, 'Informe o nome do paciente');
                    DOM.pacienteName.focus();
                    return;
                }
                
                if (isNaN(idade) || idade <= 0 || idade > 120) {
                    showError(DOM.pacienteIdadeError, 'Informe uma idade válida');
                    DOM.pacienteIdade.focus();
                    return;
                }
                
                if (!sexo) {
                    showError(DOM.pacienteSexoError, 'Selecione o sexo biológico');
                    DOM.pacienteSexo.focus();
                    return;
                }
                
                if (!leito) {
                    showError(DOM.pacienteLeitoError, 'Informe o número do leito');
                    DOM.pacienteLeito.focus();
                    return;
                }
                
                if (!atendimento) {
                    showError(DOM.pacienteAtendimentoError, 'Informe o número do atendimento');
                    DOM.pacienteAtendimento.focus();
                    return;
                }
                
                // Encontrar setor
                const setorId = parseInt(DOM.newPacienteModal.getAttribute('data-setor'));
                const setor = dados.setores.find(s => s.id === setorId);
                
                if (setor) {
                    const novoPaciente = {
                        id: Date.now(),
                        nome,
                        idade,
                        sexo,
                        leito,
                        atendimento,
                        anotacoes: [{ 
                            id: Date.now(),
                            texto: `Paciente admitido em ${setor.nome}`,
                            timestamp: new Date().toISOString(),
                            medico: state.currentDoctor,
                            tipo: "system"
                        }],
                        alta: null,
                        pendencias: []
                    };
                    
                    setor.pacientes.push(novoPaciente);
                    renderSetores();
                    DOM.newPacienteModal.classList.remove('active');
                    
                    // Resetar campos
                    DOM.pacienteName.value = '';
                    DOM.pacienteIdade.value = '';
                    DOM.pacienteSexo.value = '';
                    DOM.pacienteLeito.value = '';
                    DOM.pacienteAtendimento.value = '';
                    
                    showToast(`Paciente "${nome}" adicionado com sucesso!`, 'success');
                    
                    // Se for o primeiro paciente, selecionar automaticamente
                    if (setor.pacientes.length === 1) {
                        selectPaciente(novoPaciente.id);
                    }
                }
            });
            
            // Menu de contexto (Alta, Pendência e Excluir)
            DOM.btnContextMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                DOM.contextMenu.classList.toggle('visible');
            });
            
            document.addEventListener('click', (e) => {
                if (!DOM.btnContextMenu.contains(e.target) && !DOM.contextMenu.contains(e.target)) {
                    DOM.contextMenu.classList.remove('visible');
                }
            });
            
            DOM.contextMenu.querySelectorAll('.context-item').forEach(item => {
                item.addEventListener('click', () => {
                    DOM.contextMenu.classList.remove('visible');
                    const action = item.getAttribute('data-action');
                    
                    if (action === 'alta') {
                        openAltaModal();
                    } else if (action === 'pendencia') {
                        openPendenciaModal();
                    } else if (action === 'excluir') {
                        openDeleteConfirmationModal();
                    }
                });
            });
            
            // Modal pendência
            DOM.btnCancelPendencia.addEventListener('click', () => {
                DOM.pendenciaModal.classList.remove('active');
            });
            
            DOM.btnSavePendencia.addEventListener('click', () => {
                // Resetar erros
                hideAllErrors();
                
                const titulo = DOM.pendenciaTitulo.value.trim();
                const desc = DOM.pendenciaDesc.value.trim();
                
                if (!titulo) {
                    showError(DOM.pendenciaTituloError, 'Selecione um título');
                    DOM.pendenciaTitulo.focus();
                    return;
                }
                
                if (!desc) {
                    showError(DOM.pendenciaDescError, 'Informe a descrição da pendência');
                    DOM.pendenciaDesc.focus();
                    return;
                }
                
                // Se selecionou "Outra", usar o campo de texto
                let tituloFinal = titulo;
                if (titulo === "Outra") {
                    tituloFinal = DOM.outraPendencia.value.trim();
                    if (!tituloFinal) {
                        showError(DOM.pendenciaDescError, 'Informe o título da pendência');
                        return;
                    }
                }
                
                // Encontrar paciente
                for (const setor of dados.setores) {
                    const paciente = setor.pacientes.find(p => p.id === state.currentPaciente);
                    if (paciente) {
                        // Adicionar pendência
                        paciente.pendencias = paciente.pendencias || [];
                        paciente.pendencias.push({
                            id: Date.now(),
                            titulo: tituloFinal,
                            descricao: desc,
                            criadoPor: state.currentDoctor,
                            criadoEm: new Date().toISOString(),
                            resolvidoEm: null
                        });
                        
                        // Adicionar mensagem completa no histórico
                        paciente.anotacoes.push({
                            id: Date.now(),
                            texto: `Pendência Criada: ${tituloFinal}\n${desc}`,
                            timestamp: new Date().toISOString(),
                            medico: state.currentDoctor,
                            tipo: "texto"
                        });
                        
                        // Atualizar interface
                        selectPaciente(paciente.id);
                        
                        // Fechar modal
                        DOM.pendenciaModal.classList.remove('active');
                        
                        // Resetar campos
                        DOM.pendenciaTitulo.value = '';
                        DOM.outraPendencia.value = '';
                        DOM.pendenciaDesc.value = '';
                        DOM.outraPendenciaGroup.style.display = 'none';
                        
                        // Mostrar toast
                        showToast('Pendência criada com sucesso!', 'success');
                        break;
                    }
                }
            });
            
            // Alta
            DOM.btnCancelAlta.addEventListener('click', () => {
                DOM.altaModal.classList.remove('active');
            });
            
            DOM.btnConfirmAlta.addEventListener('click', () => {
                // Resetar erros
                hideAllErrors();
                
                const tipo = DOM.tipoAlta.value;
                const data = DOM.dataAlta.value;
                
                if (!tipo) {
                    showError(DOM.tipoAltaError, 'Selecione o tipo de alta');
                    DOM.tipoAlta.focus();
                    return;
                }
                
                if (!data) {
                    showError(DOM.dataAltaError, 'Informe a data e hora da alta');
                    DOM.dataAlta.focus();
                    return;
                }
                
                const obs = DOM.obsAlta.value.trim();
                
                // Encontrar paciente
                for (const setor of dados.setores) {
                    const paciente = setor.pacientes.find(p => p.id === state.currentPaciente);
                    if (paciente) {
                        paciente.alta = {
                            tipo,
                            data,
                            obs,
                            timestamp: new Date().toISOString(),
                            medico: state.currentDoctor
                        };
                        
                        // Adicionar mensagem de alta no histórico
                        paciente.anotacoes.push({
                            id: Date.now(),
                            texto: `Alta registrada: ${formatAltaType(tipo)}`,
                            timestamp: new Date().toISOString(),
                            medico: state.currentDoctor,
                            tipo: "system"
                        });
                        
                        // Atualizar interface
                        selectPaciente(paciente.id);
                        
                        // Fechar modal
                        DOM.altaModal.classList.remove('active');
                        
                        // Resetar campos
                        DOM.tipoAlta.value = '';
                        DOM.obsAlta.value = '';
                        
                        // Mostrar toast
                        showToast('Alta registrada', 'success');
                        break;
                    }
                }
            });
            
            // Envio de mensagens
            DOM.btnSendMessage.addEventListener('click', sendMessage);
            
            DOM.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Habilitar/desabilitar botão de enviar
            DOM.messageInput.addEventListener('input', function() {
                const hasText = this.value.trim() !== '';
                DOM.btnSendMessage.disabled = !hasText || !state.currentPaciente;
                
                // Ajustar altura do textarea conforme o conteúdo
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 150) + 'px';
                
                // Limitar altura máxima
                this.style.overflowY = this.scrollHeight > 150 ? 'auto' : 'hidden';
            });

            // Toggle de detalhes do paciente
            DOM.patientToggle.addEventListener('click', function(e) {
                const isVisible = DOM.patientDetails.style.display === 'block';
                DOM.patientDetails.style.display = isVisible ? 'none' : 'block';
            });
            
            // Listener para redimensionamento da tela
            window.addEventListener('resize', () => {
                clearTimeout(state.resizeTimer);
                state.resizeTimer = setTimeout(() => {
                    if (window.innerWidth <= 992) {
                        DOM.btnPassPlantaoHeader.classList.add('hidden');
                        // Se não há paciente selecionado, abrir modal de seleção
                        if (!state.currentPaciente && dados.setores.length > 0) {
                            openSelectionModal();
                        }
                    } else {
                        DOM.btnPassPlantaoHeader.classList.remove('hidden');
                        // Fechar o modal de seleção se estiver aberto
                        DOM.selectionModal.classList.remove('active');
                    }
                }, 200);
            });

            // Evento para o campo de título da pendência
            DOM.pendenciaTitulo.addEventListener('change', function() {
                if (this.value === "Outra") {
                    DOM.outraPendenciaGroup.style.display = 'block';
                } else {
                    DOM.outraPendenciaGroup.style.display = 'none';
                }
            });
            
            // Modal de exclusão
            DOM.btnCancelDelete.addEventListener('click', () => {
                DOM.confirmDeleteModal.classList.remove('active');
            });
            
            DOM.btnIsAlta.addEventListener('click', () => {
                DOM.confirmDeleteModal.classList.remove('active');
                openAltaModal();
            });
            
            DOM.btnConfirmDelete.addEventListener('click', deletePaciente);
            
            // Validação do campo de confirmação de exclusão
            DOM.confirmDeleteInput.addEventListener('input', function() {
                const confirmText = this.value.trim().toLowerCase();
                const isConfirmed = confirmText === 'excluir';
                
                // Atualizar estado do botão
                DOM.btnConfirmDelete.disabled = !isConfirmed;
                
                // Atualizar estilo do botão
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
        }

        // Abrir modal de confirmação de exclusão
        function openDeleteConfirmationModal() {
            // Encontrar paciente
            for (const setor of dados.setores) {
                const paciente = setor.pacientes.find(p => p.id === state.currentPaciente);
                if (paciente) {
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
                    break;
                }
            }
        }
        
        // Excluir paciente definitivamente
        function deletePaciente() {
            // Encontrar paciente e setor
            for (const setor of dados.setores) {
                const pacienteIndex = setor.pacientes.findIndex(p => p.id === state.currentPaciente);
                if (pacienteIndex !== -1) {
                    // Remover paciente
                    setor.pacientes.splice(pacienteIndex, 1);
                    
                    // Fechar modal
                    DOM.confirmDeleteModal.classList.remove('active');
                    
                    // Resetar estado
                    state.currentPaciente = null;
                    state.currentSetor = null;
                    
                    // Atualizar interface
                    renderSetores();
                    updateEmptyState();
                    
                    // Mostrar toast
                    showToast('Paciente excluído com sucesso', 'success');
                    break;
                }
            }
        }

        // Abrir modal de seleção de paciente (mobile)
        function openSelectionModal() {
            renderSetores(DOM.selectionModalContent, true);
            DOM.selectionModal.classList.add('active');
        }

        // Adicionar novo turno
        function addTurno() {
            state.turnoCount++;
            const turnoId = state.turnoCount;
            
            const turnoEl = document.createElement('div');
            turnoEl.className = 'turno-section';
            turnoEl.innerHTML = `
                ${state.turnoCount > 1 ? `<button class="btn-remove-turno" data-id="${turnoId}">×</button>` : ''}
                <div class="form-group">
                    <label>Nome do Turno</label>
                    <input type="text" class="form-control turno-name" placeholder="Ex: Manhã, Tarde, Noite">
                    <div class="error-message turno-name-error"></div>
                </div>
                <div class="turno-grid">
                    <div class="form-group">
                        <label>Início</label>
                        <input type="time" class="form-control turno-inicio" value="07:00">
                        <div class="error-message turno-inicio-error"></div>
                    </div>
                    <div class="form-group">
                        <label>Fim</label>
                        <input type="time" class="form-control turno-fim" value="12:00">
                        <div class="error-message turno-fim-error"></div>
                    </div>
                </div>
                <div class="turno-actions">
                    <button class="btn-add-turno" data-id="${turnoId}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Adicionar Turno
                    </button>
                </div>
            `;
            
            // Remover botão "Adicionar Turno" do turno anterior
            const lastTurnoBtn = document.querySelector('.btn-add-turno');
            if (lastTurnoBtn) {
                lastTurnoBtn.remove();
            }
            
            DOM.turnosContainer.appendChild(turnoEl);
            
            // Evento para remover turno (apenas se não for o primeiro)
            if (state.turnoCount > 1) {
                turnoEl.querySelector('.btn-remove-turno').addEventListener('click', function() {
                    turnoEl.remove();
                    DOM.turnosError.style.display = 'none';
                    state.turnoCount--;
                    
                    // Se não houver mais botão de adicionar, adicionar ao último turno
                    if (!document.querySelector('.btn-add-turno')) {
                        const lastTurno = DOM.turnosContainer.lastElementChild;
                        if (lastTurno) {
                            const btnContainer = document.createElement('div');
                            btnContainer.className = 'turno-actions';
                            btnContainer.innerHTML = `
                                <button class="btn-add-turno">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                        <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                    Adicionar Turno
                                </button>
                            `;
                            lastTurno.appendChild(btnContainer);
                        }
                    }
                });
            }
            
            // Esconder mensagem de erro de turnos
            DOM.turnosError.style.display = 'none';
        }
        
        // Verificar sobreposição de turnos
        function hasSobreposicaoTurnos(turnos) {
            for (let i = 0; i < turnos.length; i++) {
                for (let j = i + 1; j < turnos.length; j++) {
                    const turnoA = turnos[i];
                    const turnoB = turnos[j];
                    
                    // Converter para minutos para facilitar comparação
                    const inicioA = timeToMinutes(turnoA.inicio);
                    const fimA = timeToMinutes(turnoA.fim);
                    const inicioB = timeToMinutes(turnoB.inicio);
                    const fimB = timeToMinutes(turnoB.fim);
                    
                    // Verificar sobreposição
                    if ((inicioA >= inicioB && inicioA < fimB) || 
                        (fimA > inicioB && fimA <= fimB) || 
                        (inicioB >= inicioA && inicioB < fimA)) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        // Converter tempo para minutos
        function timeToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
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

        // Enviar mensagem
        function sendMessage() {
            if (!state.currentPaciente) {
                showToast('Selecione um paciente primeiro', 'error');
                return;
            }
            
            const message = DOM.messageInput.value.trim();
            if (!message) return;
            
            // Encontrar paciente
            for (const setor of dados.setores) {
                const paciente = setor.pacientes.find(p => p.id === state.currentPaciente);
                if (paciente) {
                    // Adicionar mensagem
                    paciente.anotacoes.push({
                        id: Date.now(),
                        texto: message,
                        timestamp: new Date().toISOString(),
                        medico: state.currentDoctor,
                        tipo: "texto"
                    });
                    
                    // Atualizar chat
                    renderChatHistory(paciente);
                    
                    // Limpar campo
                    DOM.messageInput.value = '';
                    DOM.btnSendMessage.disabled = true;
                    DOM.messageInput.style.height = 'auto';
                    
                    // Scroll para a nova mensagem
                    setTimeout(() => {
                        scrollToLatestMessage();
                    }, 100);
                    break;
                }
            }
        }
        
        // Resolver pendência
        function resolverPendencia(pendenciaId) {
            // Encontrar paciente
            for (const setor of dados.setores) {
                const paciente = setor.pacientes.find(p => p.id === state.currentPaciente);
                if (paciente && paciente.pendencias) {
                    // Encontrar pendência
                    const pendencia = paciente.pendencias.find(p => p.id == pendenciaId);
                    if (pendencia) {
                        pendencia.resolvidoEm = new Date().toISOString();
                        
                        // Adicionar mensagem ao histórico
                        paciente.anotacoes.push({
                            id: Date.now(),
                            texto: `Pendência Resolvida: ${pendencia.titulo}`,
                            timestamp: new Date().toISOString(),
                            medico: state.currentDoctor,
                            tipo: "texto"
                        });
                        
                        // Atualizar interface
                        selectPaciente(paciente.id);
                        showToast('Pendência marcada como resolvida', 'success');
                    }
                }
            }
        }

        // Abrir modal de alta
        function openAltaModal() {
            // Preencher data/hora atual como padrão
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            
            DOM.dataAlta.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            DOM.altaModal.classList.add('active');
            DOM.tipoAlta.focus();
        }
        
        // Abrir modal de pendência
        function openPendenciaModal() {
            DOM.pendenciaModal.classList.add('active');
            DOM.pendenciaTitulo.focus();
        }

        // Abrir modal novo setor
        function openNewSetorModal() {
            // Resetar turnos
            DOM.turnosContainer.innerHTML = '';
            state.turnoCount = 0;
            addTurno();
            
            DOM.newSetorModal.classList.add('active');
            DOM.setorName.focus();
        }

        // Abrir modal novo paciente
        function openNewPacienteModal(setorId) {
            DOM.newPacienteModal.setAttribute('data-setor', setorId);
            DOM.newPacienteModal.classList.add('active');
            DOM.pacienteName.focus();
        }
        
        // Abrir modal de passagem de plantão
        function openPassPlantaoModal() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('pt-BR');
            const timeStr = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            DOM.assinatura.value = `${state.currentDoctor} - ${dateStr} ${timeStr}`;
            DOM.passPlantaoModal.classList.add('active');
            DOM.medicoRecebe.focus();
        }

        // Atualizar hora atual
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            document.getElementById('currentTime').textContent = timeString;
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

        // Inicializar aplicação
        document.addEventListener('DOMContentLoaded', init);