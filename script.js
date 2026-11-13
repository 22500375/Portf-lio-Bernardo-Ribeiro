const root = document.documentElement
const themeButton = document.querySelector("#theme-toggle")
const mobileToggle = document.querySelector("#mobile-toggle")
const mainNav = document.querySelector("#main-nav")
const workMenuButton = document.querySelector("#work-menu-button")
const workSubmenu = document.querySelector("#work-submenu")
const modal = document.querySelector("#portfolio-modal")
const modalTitle = document.querySelector("#modal-title")
const modalMessage = document.querySelector("#modal-message")
const modalEyebrow = document.querySelector("#modal-eyebrow")

function updateThemeButton() {
  const isLight = root.dataset.theme === "light"
  themeButton.textContent = isLight ? "Modo escuro" : "Modo claro"
  themeButton.setAttribute(
    "aria-label",
    isLight ? "Ativar modo escuro" : "Ativar modo claro",
  )
}

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light"
  root.dataset.theme = nextTheme
  localStorage.setItem("portfolio-theme", nextTheme)
  updateThemeButton()
})

updateThemeButton()

function closeMenus() {
  mainNav.classList.remove("is-open")
  workSubmenu.classList.remove("is-open")
  mobileToggle.setAttribute("aria-expanded", "false")
  workMenuButton.setAttribute("aria-expanded", "false")
  document.body.classList.remove("menu-open")
}

mobileToggle.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("is-open")
  mainNav.classList.toggle("is-open", willOpen)
  mobileToggle.setAttribute("aria-expanded", String(willOpen))
  document.body.classList.toggle("menu-open", willOpen)
})

workMenuButton.addEventListener("click", (event) => {
  event.stopPropagation()
  const willOpen = !workSubmenu.classList.contains("is-open")
  workSubmenu.classList.toggle("is-open", willOpen)
  workMenuButton.setAttribute("aria-expanded", String(willOpen))
})

document.addEventListener("click", (event) => {
  if (!event.target.closest(".work-menu")) {
    workSubmenu.classList.remove("is-open")
    workMenuButton.setAttribute("aria-expanded", "false")
  }
})

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", closeMenus)
})

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenus()
})

const typingWords = [
  "sites responsivos.",
  "interfaces criativas.",
  "projetos com código.",
]
const typingElement = document.querySelector("#typing-text")
let wordIndex = 0
let characterIndex = 0
let isDeleting = false

function typeText() {
  const currentWord = typingWords[wordIndex]
  characterIndex += isDeleting ? -1 : 1
  typingElement.textContent = currentWord.slice(0, characterIndex)

  let delay = isDeleting ? 45 : 85
  if (!isDeleting && characterIndex === currentWord.length) {
    isDeleting = true
    delay = 1300
  } else if (isDeleting && characterIndex === 0) {
    isDeleting = false
    wordIndex = (wordIndex + 1) % typingWords.length
    delay = 300
  }

  window.setTimeout(typeText, delay)
}

typeText()

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.14 },
)

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element)
})

const parallaxItem = document.querySelector(".parallax-item")
let parallaxFrame

window.addEventListener(
  "scroll",
  () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    window.cancelAnimationFrame(parallaxFrame)
    parallaxFrame = window.requestAnimationFrame(() => {
      const movement = Math.min(window.scrollY * 0.08, 38)
      parallaxItem.style.transform = `translateY(${movement}px)`
    })
  },
  { passive: true },
)

function openModal(eyebrow, title, message) {
  modalEyebrow.textContent = eyebrow
  modalTitle.textContent = title
  modalMessage.textContent = message
  modal.showModal()
}

document
  .querySelector("#modal-close")
  .addEventListener("click", () => modal.close())
document
  .querySelector("#modal-action")
  .addEventListener("click", () => modal.close())

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close()
})

const phoneInput = document.querySelector("#phone")

phoneInput.addEventListener("input", () => {
  const numbers = phoneInput.value.replace(/\D/g, "").slice(0, 11)
  let formatted = numbers

  if (numbers.length > 2) {
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length > 0) {
    formatted = `(${numbers}`
  }

  if (numbers.length > 7) {
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  }

  phoneInput.value = formatted
})

const form = document.querySelector("#contact-form")
const fields = {
  name: {
    element: document.querySelector("#name"),
    validate(value) {
      if (value.trim().length < 3) return "Informe seu nome completo."
      if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(value.trim())) {
        return "O nome deve conter apenas letras."
      }
      return ""
    },
  },
  phone: {
    element: phoneInput,
    validate(value) {
      if (value.replace(/\D/g, "").length < 10)
        return "Informe um telefone válido."
      return ""
    },
  },
  email: {
    element: document.querySelector("#email"),
    validate(value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Informe um email válido."
      }
      return ""
    },
  },
  message: {
    element: document.querySelector("#message"),
    validate(value) {
      if (value.trim().length < 10)
        return "Escreva uma mensagem com pelo menos 10 caracteres."
      return ""
    },
  },
}

function validateField(field) {
  const error = field.validate(field.element.value)
  const wrapper = field.element.closest(".form-field")
  wrapper.classList.toggle("has-error", Boolean(error))
  wrapper.querySelector(".field-error").textContent = error
  field.element.setAttribute("aria-invalid", String(Boolean(error)))
  return !error
}

Object.values(fields).forEach((field) => {
  field.element.addEventListener("blur", () => validateField(field))
  field.element.addEventListener("input", () => {
    if (field.element.closest(".form-field").classList.contains("has-error")) {
      validateField(field)
    }
  })
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const validationResults = Object.values(fields).map(validateField)
  const isValid = validationResults.every(Boolean)

  if (!isValid) {
    form.querySelector('[aria-invalid="true"]').focus()
    return
  }

  openModal(
    "Contato",
    "Mensagem enviada!",
    "Obrigado pelo contato. Seus dados foram validados e responderei assim que possível.",
  )
  form.reset()
})

document.querySelector("#current-year").textContent = new Date().getFullYear()
