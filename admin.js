// Credenciais de acesso (em produção, usar autenticação real)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

// Elementos DOM
const loginPage = document.getElementById("loginPage")
const dashboard = document.getElementById("dashboard")
const loginForm = document.getElementById("loginForm")
const errorMessage = document.getElementById("errorMessage")
const searchInput = document.getElementById("searchInput")
const detailModal = document.getElementById("detailModal")

// Variável global para armazenar inscrições
let inscricoes = []

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Login bem-sucedido
    sessionStorage.setItem("adminLoggedIn", "true")
    loginPage.style.display = "none"
    dashboard.classList.add("active")
    loadDashboard()
  } else {
    // Login falhou
    errorMessage.style.display = "block"
  }
})

// Verificar se já está logado
window.addEventListener("load", () => {
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    loginPage.style.display = "none"
    dashboard.classList.add("active")
    loadDashboard()
  }
})

// Logout
function logout() {
  sessionStorage.removeItem("adminLoggedIn")
  location.reload()
}

// Toggle Sidebar Mobile
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active")
}

// Carregar Dashboard
function loadDashboard() {
  carregarInscricoes()
  atualizarEstatisticas()
  renderizarTabela(inscricoes)
}

// Carregar inscrições do localStorage
function carregarInscricoes() {
  inscricoes = JSON.parse(localStorage.getItem("inscricoes")) || []
}

// Calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  const total = inscricoes.length
  let sub7 = 0
  let sub11 = 0
  let sub15 = 0
  let sub20 = 0

  inscricoes.forEach((inscricao) => {
    const idade = calcularIdade(inscricao.dataNascimento)

    if (idade >= 5 && idade <= 7) {
      sub7++
    } else if (idade >= 8 && idade <= 11) {
      sub11++
    } else if (idade >= 12 && idade <= 15) {
      sub15++
    } else if (idade >= 16 && idade <= 20) {
      sub20++
    }
  })

  document.getElementById("totalInscricoes").textContent = total
  document.getElementById("totalSub7").textContent = sub7
  document.getElementById("totalSub11").textContent = sub11
  document.getElementById("totalSub15").textContent = sub15
  
}

// Renderizar tabela
function renderizarTabela(dados) {
  const tableContent = document.getElementById("tableContent")

  if (dados.length === 0) {
    tableContent.innerHTML = `
            <div class="empty-state">
                <div class="icon">📋</div>
                <h3>Nenhuma inscrição encontrada</h3>
                <p>As inscrições realizadas no site aparecerão aqui.</p>
            </div>
        `
    return
  }

  let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome do Atleta</th>
                    <th>Idade</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Responsável</th>
                    <th>Tel. Responsável</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `

  dados.forEach((inscricao, index) => {
    const idade = calcularIdade(inscricao.dataNascimento)
    tableHTML += `
            <tr>
                <td>${inscricao.nomeAtleta}</td>
                <td>${idade} anos</td>
                <td>${inscricao.telefoneAtleta}</td>
                <td>${inscricao.emailAtleta}</td>
                <td>${inscricao.nomeResponsavel}</td>
                <td>${inscricao.telefoneResponsavel}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" onclick="verDetalhes(${inscricao.id})">Ver</button>
                        <button class="action-btn btn-delete" onclick="excluirInscricao(${inscricao.id})">Excluir</button>
                    </div>
                </td>
            </tr>
        `
  })

  tableHTML += `
            </tbody>
        </table>
    `

  tableContent.innerHTML = tableHTML
}

// Buscar inscrições
searchInput.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase()

  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    return (
      inscricao.nomeAtleta.toLowerCase().includes(termo) ||
      inscricao.telefoneAtleta.includes(termo) ||
      inscricao.nomeResponsavel.toLowerCase().includes(termo) ||
      inscricao.telefoneResponsavel.includes(termo)
    )
  })

  renderizarTabela(inscricoesFiltradas)
})

// Ver detalhes da inscrição
function verDetalhes(id) {
  const inscricao = inscricoes.find((i) => i.id === id)

  if (!inscricao) return

  const idade = calcularIdade(inscricao.dataNascimento)
  const dataFormatada = new Date(inscricao.dataInscricao).toLocaleString("pt-BR")

  let detailHTML = `
        <div class="detail-row">
            <div class="detail-label">Nome do Atleta</div>
            <div class="detail-value">${inscricao.nomeAtleta}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Data de Nascimento</div>
            <div class="detail-value">${new Date(inscricao.dataNascimento).toLocaleDateString("pt-BR")} (${idade} anos)</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Telefone do Atleta</div>
            <div class="detail-value">${inscricao.telefoneAtleta}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value">${inscricao.emailAtleta}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Nome do Responsável</div>
            <div class="detail-value">${inscricao.nomeResponsavel}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Telefone do Responsável</div>
            <div class="detail-value">${inscricao.telefoneResponsavel}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Data da Inscrição</div>
            <div class="detail-value">${dataFormatada}</div>
        </div>
    `

  // Adicionar documento se existir
  if (inscricao.documento) {
    detailHTML += `
            <div class="detail-row">
                <div class="detail-label">Documento Anexado</div>
                <div class="detail-value">
                    ${inscricao.documento.nome} (${(inscricao.documento.tamanho / 1024).toFixed(2)} KB)
                    <div class="document-preview">
        `

    if (inscricao.documento.tipo.includes("pdf")) {
      detailHTML += `
                <a href="${inscricao.documento.dados}" download="${inscricao.documento.nome}" class="btn">
                    📄 Baixar PDF
                </a>
            `
    } else {
      detailHTML += `
                <img src="${inscricao.documento.dados}" alt="Documento">
            `
    }

    detailHTML += `
                    </div>
                </div>
            </div>
        `
  }

  document.getElementById("detailContent").innerHTML = detailHTML
  detailModal.classList.add("show")
}

// Fechar modal de detalhes
function closeDetailModal() {
  detailModal.classList.remove("show")
}

// Fechar modal ao clicar fora
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) {
    closeDetailModal()
  }
})

// Excluir inscrição
function excluirInscricao(id) {
  if (confirm("Tem certeza que deseja excluir esta inscrição?")) {
    inscricoes = inscricoes.filter((i) => i.id !== id)
    localStorage.setItem("inscricoes", JSON.stringify(inscricoes))
    loadDashboard()
  }
}

// Atualizar dashboard a cada 30 segundos
setInterval(() => {
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    carregarInscricoes()
    atualizarEstatisticas()
  }
}, 30000)
