const tabs = document.querySelectorAll('.tab');
const patientList = document.getElementById('patientList');
const searchInput = document.getElementById('searchInput');

const mockPatients = [
  { nome: "João da Silva", status: "ativos", setor: "Clínica Médica" },
  { nome: "Maria Souza", status: "altas", setor: "UTI" },
  { nome: "Carlos Lima", status: "historico", setor: "Ortopedia" },
  { nome: "Ana Paula", status: "ativos", setor: "Pediatria" }
];

function renderPatients(status, filter = "") {
  patientList.innerHTML = "";

  const filtered = mockPatients.filter(p =>
    p.status === status &&
    p.nome.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    patientList.innerHTML = "<p>Nenhum paciente encontrado.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${p.nome}</h2>
      <p>Setor: ${p.setor}</p>
    `;
    patientList.appendChild(card);
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const tabKey = tab.dataset.tab;
    renderPatients(tabKey, searchInput.value);
  });
});

searchInput.addEventListener("input", () => {
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  renderPatients(activeTab, searchInput.value);
});

// Render inicial
renderPatients("ativos");
