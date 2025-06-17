// View Management Module
const ViewManager = {
    views: {
        'dashboard': `
            <div class="view-content active">
                <h1 class="view-title"><i class="fas fa-home"></i> Dashboard</h1>
                
                <div class="dashboard-grid">
                    <div class="stats-card">
                        <div class="stats-value">24</div>
                        <div class="stats-label">Pacientes Ativos</div>
                    </div>
                    
                    <div class="stats-card warning">
                        <div class="stats-value">8</div>
                        <div class="stats-label">Pendências</div>
                    </div>
                    
                    <div class="stats-card danger">
                        <div class="stats-value">3</div>
                        <div class="stats-label">Intercorrências</div>
                    </div>
                </div>
                
                <div class="content-header">
                    <h2>Pacientes Recentes</h2>
                    <div class="filters">
                        <select class="form-control">
                            <option>Todos os setores</option>
                            <option>UTI Adulto</option>
                            <option>Emergência</option>
                        </select>
                    </div>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Maria Silva</div>
                            <div class="card-badge badge-alta">Alta</div>
                        </div>
                        <div class="card-body">
                            <div class="info-group">
                                <span class="info-label">Leito</span>
                                <span class="info-value">UTI-A 12</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Idade</span>
                                <span class="info-value">67 anos</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Médico</span>
                                <span class="info-value">Dr. Silva</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Status</span>
                                <span class="info-value">Estável</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">João Oliveira</div>
                            <div class="card-badge badge-intercorrencia">Intercorrência</div>
                        </div>
                        <div class="card-body">
                            <div class="info-group">
                                <span class="info-label">Leito</span>
                                <span class="info-value">UTI-A 8</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Idade</span>
                                <span class="info-value">52 anos</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Médico</span>
                                <span class="info-value">Dra. Costa</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Status</span>
                                <span class="info-value">Crítico</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'alta': `
            <div class="view-content">
                <h1 class="view-title"><i class="fas fa-sign-out-alt"></i> Altas</h1>
                
                <div class="content-header">
                    <div class="filters">
                        <input type="date" class="form-control">
                        <select class="form-control">
                            <option>Todos os setores</option>
                            <option>UTI Adulto</option>
                            <option>Emergência</option>
                        </select>
                    </div>
                    <button class="action-button">
                        <i class="fas fa-plus"></i> Nova Alta
                    </button>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Carlos Mendes</div>
                            <div class="card-badge badge-alta">Alta</div>
                        </div>
                        <div class="card-body">
                            <div class="info-group">
                                <span class="info-label">Data</span>
                                <span class="info-value">15/11/2023</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Médico</span>
                                <span class="info-value">Dr. Silva</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Setor</span>
                                <span class="info-value">UTI Adulto</span>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="icon-button">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="icon-button">
                                <i class="fas fa-print"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'intercorrencia': `
            <div class="view-content">
                <h1 class="view-title"><i class="fas fa-exclamation-triangle"></i> Intercorrências</h1>
                
                <div class="content-header">
                    <div class="filters">
                        <input type="date" class="form-control">
                        <select class="form-control">
                            <option>Todas as gravidades</option>
                            <option>Leve</option>
                            <option>Moderada</option>
                            <option>Grave</option>
                        </select>
                    </div>
                    <button class="action-button">
                        <i class="fas fa-plus"></i> Nova Intercorrência
                    </button>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">João Oliveira</div>
                            <div class="card-badge badge-intercorrencia">Grave</div>
                        </div>
                        <div class="card-body">
                            <div class="info-group">
                                <span class="info-label">Tipo</span>
                                <span class="info-value">Parada Cardíaca</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Data</span>
                                <span class="info-value">15/11/2023 08:45</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Médico</span>
                                <span class="info-value">Dr. Silva</span>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="icon-button">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="icon-button">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'pendencia': `
            <div class="view-content">
                <h1 class="view-title"><i class="fas fa-tasks"></i> Pendências</h1>
                
                <div class="content-header">
                    <div class="filters">
                        <select class="form-control">
                            <option>Todas as pendências</option>
                            <option>Pendentes</option>
                            <option>Resolvidas</option>
                        </select>
                    </div>
                    <button class="action-button">
                        <i class="fas fa-plus"></i> Nova Pendência
                    </button>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Aguardando Tomografia</div>
                            <div class="card-badge badge-pendencia">Pendente</div>
                        </div>
                        <div class="card-body">
                            <div class="info-group">
                                <span class="info-label">Paciente</span>
                                <span class="info-value">Carlos Mendes</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Criado em</span>
                                <span class="info-value">14/11/2023 18:20</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Responsável</span>
                                <span class="info-value">Dr. Silva</span>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="resolve-btn">Resolver</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'historico': `
            <div class="view-content">
                <h1 class="view-title"><i class="fas fa-history"></i> Histórico</h1>
                
                <div class="content-header">
                    <div class="filters">
                        <input type="date" class="form-control">
                        <select class="form-control">
                            <option>Todos os tipos</option>
                            <option>Altas</option>
                            <option>Intercorrências</option>
                            <option>Pendências</option>
                        </select>
                    </div>
                </div>
                
                <div class="logs-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Descrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15/11/2023 10:30</td>
                                <td><span class="badge-alta">Alta</span></td>
                                <td>Maria Silva</td>
                                <td>Dr. Silva</td>
                                <td>Paciente estável, liberado para enfermaria</td>
                            </tr>
                            <tr>
                                <td>15/11/2023 08:45</td>
                                <td><span class="badge-intercorrencia">Intercorrência</span></td>
                                <td>João Oliveira</td>
                                <td>Dr. Silva</td>
                                <td>Febre alta (39.2°C), iniciado protocolo de sepse</td>
                            </tr>
                            <tr>
                                <td>14/11/2023 18:20</td>
                                <td><span class="badge-pendencia">Pendência</span></td>
                                <td>Carlos Mendes</td>
                                <td>Dr. Silva</td>
                                <td>Aguardando resultado de tomografia</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        'admin': `
            <div class="view-content">
                <h1 class="view-title"><i class="fas fa-cog"></i> Administração</h1>
                
                <div class="admin-section">
                    <h2 class="section-title">Gerenciamento de Setores</h2>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Nome do Setor">
                        </div>
                        <div class="form-group">
                            <div class="time-grid">
                                <input type="time" class="form-control" value="07:00">
                                <input type="time" class="form-control" value="19:00">
                            </div>
                        </div>
                    </div>
                    
                    <button class="action-button mt-16">
                        <i class="fas fa-plus"></i> Adicionar Setor
                    </button>
                    
                    <div class="sector-list">
                        <div class="sector-card">
                            <div class="sector-header">
                                <div class="sector-name">UTI Adulto</div>
                                <div class="sector-schedule">07:00 - 19:00</div>
                            </div>
                            <div class="sector-details">
                                <div class="detail-card">
                                    <div class="detail-title">Médicos</div>
                                    <div class="detail-value">12</div>
                                </div>
                                <div class="detail-card">
                                    <div class="detail-title">Registros</div>
                                    <div class="detail-value">248</div>
                                </div>
                            </div>
                            <div class="copy-link mt-16">
                                <i class="fas fa-link"></i> Copiar link de convite
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    
    switchView(view) {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = this.views[view] || this.views.dashboard;
        
        // Ativar/desativar itens da sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });
        
        // Inicializar funcionalidades específicas da view
        if (view === 'pendencia') {
            this.initPendingActions();
        }
        
        if (view === 'admin') {
            this.initAdminActions();
        }
    },
    
    initPendingActions() {
        document.querySelectorAll('.resolve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.card');
                card.classList.add('resolved');
                this.textContent = 'Resolvido';
                this.disabled = true;
                
                UI.showToast('Pendência resolvida com sucesso!', 'success');
            });
        });
    },
    
    initAdminActions() {
        document.querySelectorAll('.copy-link').forEach(btn => {
            btn.addEventListener('click', function() {
                UI.showToast('Link copiado para a área de transferência!', 'success');
            });
        });
    },
    
    init() {
        // Inicializar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                if (view === 'logout') {
                    Auth.logout();
                } else {
                    this.switchView(view);
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });
        
        // Carregar dashboard inicialmente
        this.switchView('dashboard');
    }
};