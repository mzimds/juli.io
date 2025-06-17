// Data Service Module (LocalStorage implementation)
const DataService = {
    // Initialize data structure
    init() {
        if (!localStorage.getItem('juliData')) {
            const initialData = {
                sectors: [
                    {
                        id: 'uti-adulto',
                        name: 'UTI Adulto',
                        schedule: '07:00 - 19:00',
                        doctors: 12,
                        logs: 248,
                        invitationLink: 'https://juli.app/convite/uti-adulto'
                    },
                    {
                        id: 'emergencia',
                        name: 'Emergência',
                        schedule: '24 horas',
                        doctors: 8,
                        logs: 412,
                        invitationLink: 'https://juli.app/convite/emergencia'
                    }
                ],
                pendingDoctors: [
                    {
                        id: 'dr-silva',
                        name: 'Dr. Carlos Silva',
                        email: 'carlos.silva@hospital.com',
                        sector: 'UTI Adulto',
                        requested: '15/11/2023'
                    }
                ],
                approvedDoctors: [
                    {
                        id: 'dra-oliveira',
                        name: 'Dra. Ana Oliveira',
                        email: 'ana.oliveira@hospital.com',
                        sector: 'UTI Adulto',
                        registered: '10/10/2023'
                    }
                ]
            };
            localStorage.setItem('juliData', JSON.stringify(initialData));
        }
    },
    
    // Get all data
    getData() {
        return JSON.parse(localStorage.getItem('juliData'));
    },
    
    // Save all data
    saveData(data) {
        localStorage.setItem('juliData', JSON.stringify(data));
    },
    
    // Sector methods
    getSectors() {
        return this.getData().sectors;
    },
    
    getSectorById(id) {
        return this.getData().sectors.find(s => s.id === id);
    },
    
    // Doctor methods
    getPendingDoctors() {
        return this.getData().pendingDoctors;
    },
    
    getApprovedDoctors() {
        return this.getData().approvedDoctors;
    },
    
    // WebSocket ready methods (stubs for future implementation)
    wsConnect() {
        console.log('Connecting to WebSocket server...');
        // Implementation will be added in next phase
    },
    
    wsSend(data) {
        console.log('Sending data via WebSocket:', data);
        // Implementation will be added in next phase
    }
};

// Initialize data
document.addEventListener('DOMContentLoaded', () => DataService.init());