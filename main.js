import "./modal.js"

const openModalBtn = document.querySelector("#openModal")
const appModal = document.querySelector("app-modal")

appModal.addEventListener("open", () => {
    console.log("Modal đã mở !")
})

appModal.addEventListener("close", () => {
    console.log("Modal đã đóng!")
})

openModalBtn.addEventListener("click", () => {
    appModal.open()
})
