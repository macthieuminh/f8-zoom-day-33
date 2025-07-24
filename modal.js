// Template
const template = document.createElement("template")
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      inset: 0;
      display: none;
      place-items: center;
      background-color: rgba(0,0,0,0.4);
      z-index: 999;
    }
      :host(.show) {
      display: block;
      opacity: 1;
    }
    :host(.hiding) {
      opacity: 0;
    }
    .modal {
      margin-top: 50px;
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      position: relative;
      animation: fadeIn 0.3s ease-out;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .modal-body {
      font-size: 1rem;
      color: #333;
    }
    @keyframes fadeIn {
      from { transform: scale(0.95); opacity: 0 }
      to { transform: scale(1); opacity: 1 }
    }
    @keyframes fadeOut {
      from { transform: scale(1); opacity: 1 }
      to { transform: scale(0.95); opacity: 0 }
    }
    .modal.hiding {
      animation: fadeOut 0.3s ease-out forwards;
    }
  </style>
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-header">
      <span><slot name="title">Modal Title</slot></span>
      <button class="close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <slot name="content">Default content goes here.</slot>
    </div>
  </div>
`
class AppModal extends HTMLElement {
    constructor() {
        // Append Template
        super()
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true))

        this.modalElement = this.shadowRoot.querySelector(".modal")
        this.closeBtn = this.shadowRoot.querySelector(".close-btn")

        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleOutsideClick = this.handleOutsideClick.bind(this)
    }
    connectedCallback() {
        this.hidden = false
        this.closeBtn.addEventListener("click", () => this.close())
        document.addEventListener("keydown", this.handleKeyDown)
        this.addEventListener("click", this.handleOutsideClick)
    }
    disconnectedCallback() {
        this.hidden = true
        document.removeEventListener("keydown", this.handleKeyDown)
        document.removeEventListener("click", this.handleOutsideClick)
    }
    handleKeyDown(e) {
        if (e.key === "Escape") {
            this.close()
        }
        if (e.key === " ") {
            this.open()
        }
    }
    handleOutsideClick(e) {
        if (e.target === this) {
            this.close()
        }
    }
    // Open
    open() {
        this.style.display = "block"

        this.classList.add("show")
        this.classList.remove("hiding")

        this.modalElement.classList.remove("hiding")

        this.dispatchEvent(new CustomEvent("open"), {
            bubbles: true,
        })
    }
    // Close
    close() {
        this.classList.add("hiding")
        this.classList.remove("show")

        this.modalElement.classList.add("hiding")

        this.dispatchEvent(new CustomEvent("close"), {
            bubbles: true,
        })
        setTimeout(() => {
            this.classList.remove("show", "hiding")
            this.modalElement.classList.remove("hiding")
            this.style.display = "none"
        }, 300)
    }
}

customElements.define("app-modal", AppModal)
