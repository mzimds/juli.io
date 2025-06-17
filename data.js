const DataService = {
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
                ],
                patients: [
                    {
                        id: 'p1',
                        name: 'Maria Oliveira',
                        bed: '12A',
                        age: 67,
                        diagnosis: 'Pneumonia',
                        doctor: 'Dr. Silva',
                        status: 'intercorrencia'
                    },
                    {
                        id: 'p2',
                        name: 'Carlos Santos',
                        bed: '8B',
                        age: 52,
                        diagnosis: 'Ap. cardíaco',
                        doctor: 'Dr. Souza',
                        status: 'alta'
                    }
                ]
            };
            localStorage.setItem('juliData', JSON.stringify(initialData));
        }
    },
    
    getData() {
        return JSON.parse(localStorage.getItem('juliData'));
    },
    
    saveData(data) {
        localStorage.setItem('juliData', JSON.stringify(data));
    },
    
    getSectors() {
        return this.getData().sectors;
    },
    
    getSectorById(id) {
        return this.getData().sectors.find(s => s.id === id);
    },
    
    getPendingDoctors() {
        return this.getData().pendingDoctors;
    },
    
    getApprovedDoctors() {
        return this.getData().approvedDoctors;
    },
    
    getPatients() {
        return this.getData().patients;
    },
    
    wsConnect() {
        console.log('Connecting to WebSocket server...');
    },
    
    wsSend(data) {
        console.log('Sending data via WebSocket:', data);
    }
};

document.addEventListener('DOMContentLoaded', () => DataService.init());