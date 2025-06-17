// Data Service Module
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
                    }
                ],
                patients: [
                    {
                        id: 'pt-1234',
                        name: 'Maria Silva',
                        age: 67,
                        bed: 'UTI-A 12',
                        status: 'Estável',
                        records: []
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
    }
};

// Initialize data
document.addEventListener('DOMContentLoaded', () => DataService.init());