// Menu Mobile Toggle
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")

  // Animar ícone do menu hamburguer
  const spans = menuToggle.querySelectorAll("span")
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
  } else {
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  }
})

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    const spans = menuToggle.querySelectorAll("span")
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  })
})

// Carrossel de Depoimentos
let currentSlide = 0
const track = document.querySelector(".carousel-track")
const slides = document.querySelectorAll(".depoimento-card")
const prevBtn = document.querySelector(".carousel-btn.prev")
const nextBtn = document.querySelector(".carousel-btn.next")
const totalSlides = slides.length

function updateCarousel() {
  const offset = -currentSlide * 100
  track.style.transform = `translateX(${offset}%)`
}

nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
})

prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
})

// Auto-play do carrossel (opcional)
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}, 5000)

// Formulário de Inscrição
const inscricaoForm = document.getElementById("inscricaoForm")
const successModal = document.getElementById("successModal")

inscricaoForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Coletar dados do formulário
  const formData = {
    id: Date.now(), // ID único baseado no timestamp
    nomeAtleta: document.getElementById("nomeAtleta").value,
    dataNascimento: document.getElementById("dataNascimento").value,
    telefoneAtleta: document.getElementById("telefoneAtleta").value,
    emailAtleta: document.getElementById("emailAtleta").value,
    nomeResponsavel: document.getElementById("nomeResponsavel").value,
    telefoneResponsavel: document.getElementById("telefoneResponsavel").value,
    dataInscricao: new Date().toISOString(),
  }

  // Processar arquivo
  const fileInput = document.getElementById("documento")
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0]

    // Verificar tamanho do arquivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo é muito grande. Tamanho máximo: 5MB")
      return
    }

    // Converter arquivo para base64
    const reader = new FileReader()
    reader.onload = (event) => {
      formData.documento = {
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        dados: event.target.result,
      }

      // Salvar no localStorage
      salvarInscricao(formData)
    }
    reader.readAsDataURL(file)
  } else {
    // Salvar sem arquivo (se não obrigatório)
    salvarInscricao(formData)
  }
})

function salvarInscricao(formData) {
  // Recuperar inscrições existentes
  const inscricoes = JSON.parse(localStorage.getItem("inscricoes")) || []

  // Adicionar nova inscrição
  inscricoes.push(formData)

  // Salvar no localStorage
  localStorage.setItem("inscricoes", JSON.stringify(inscricoes))

  // Limpar formulário
  inscricaoForm.reset()

  // Mostrar modal de sucesso
  successModal.classList.add("show")
}

function closeModal() {
  successModal.classList.remove("show")
}

// Fechar modal ao clicar fora dele
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    closeModal()
  }
})

// Animações ao rolar a página
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Aplicar animação a elementos específicos
document.querySelectorAll(".modalidade-card, .value-card, .funciona-card, .contato-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "all 0.6s ease"
  observer.observe(el)
})

// Máscara para telefone
function maskPhone(input) {
  let value = input.value.replace(/\D/g, "")
  if (value.length <= 11) {
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  }
  input.value = value
}

document.getElementById("telefoneAtleta").addEventListener("input", function () {
  maskPhone(this)
})

document.getElementById("telefoneResponsavel").addEventListener("input", function () {
  maskPhone(this)
})

// Validação de idade
document.getElementById("dataNascimento").addEventListener("change", function () {
  const dataNasc = new Date(this.value)
  const hoje = new Date()
  let idade = hoje.getFullYear() - dataNasc.getFullYear()
  const mes = hoje.getMonth() - dataNasc.getMonth()

  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--
  }

  if (idade < 5 || idade > 20) {
    alert("A idade do atleta deve estar entre 5 e 20 anos.")
    this.value = ""
  }
})
