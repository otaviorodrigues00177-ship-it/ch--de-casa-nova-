// ==========================================
// CONFIGURAÇÕES
// ==========================================
const eventDate = new Date("2026-10-12T15:00:00").getTime();
const whatsappNumber = "5516996311141"; // Apenas números: DDD + número
const whatsappNumber = "5516997882498"; // Apenas números: DDD + número
// ==========================================
// LISTA DE PRESENTES
// ==========================================
const gifts = [
    { id: 1, icon: "🍳", name: "Jogo de panelas", description: "Panelas para a cozinha" },
    { id: 2, icon: "🍽️", name: "Jogo de pratos", description: "Conjunto de pratos" },
    { id: 3, icon: "🥛", name: "Jogo de copos", description: "Copos para o dia a dia" },
    { id: 4, icon: "☕", name: "Jogo de xícaras", description: "Xícaras para café" },
    { id: 5, icon: "🍴", name: "Jogo de talheres", description: "Talheres para a casa" },
    { id: 6, icon: "🛏️", name: "Jogo de cama", description: "Lençóis e fronhas" },
    { id: 7, icon: "🛁", name: "Toalhas de banho", description: "Kit de toalhas" },
    { id: 8, icon: "🧹", name: "Kit de limpeza", description: "Produtos de limpeza" },
    { id: 9, icon: "🗑️", name: "Lixeira", description: "Lixeira para cozinha" },
    { id: 10, icon: "🥣", name: "Jogo de potes", description: "Potes para alimentos" },
    { id: 12, icon: "🧺", name: "Cesto de roupa", description: "Cesto organizador" },
    { id: 13, icon: "🧂", name: "Kit de temperos", description: "Porta-temperos" },
];

// ==========================================
// VARIÁVEIS
// ==========================================
let selectedGift = null;

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================
const giftList = document.getElementById("giftList");
const guestName = document.getElementById("guestName");
const selectedGiftText = document.getElementById("selectedGift");
const confirmGiftButton = document.getElementById("confirmGift");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const modalMessage = document.getElementById("modalMessage");
const whatsappButton = document.getElementById("whatsappButton");

// ==========================================
// VERIFICAÇÃO DE ELEMENTOS
// ==========================================
if (!giftList) console.error("Erro: elemento #giftList não encontrado.");
if (!guestName) console.error("Erro: elemento #guestName não encontrado.");

// ==========================================
// GERENCIAMENTO DE DADOS (LOCALSTORAGE)
// ==========================================
function getTakenGifts() {
    try {
        const saved = localStorage.getItem("chaCasaNovaGifts");
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error("Erro ao carregar os presentes:", error);
        return {};
    }
}

function saveTakenGifts(data) {
    try {
        localStorage.setItem("chaCasaNovaGifts", JSON.stringify(data));
    } catch (error) {
        console.error("Erro ao salvar presente:", error);
    }
}

// ==========================================
// RENDERIZAR LISTA DE PRESENTES
// ==========================================
function renderGifts() {
    if (!giftList) return;
    giftList.innerHTML = "";
    const takenGifts = getTakenGifts();

    gifts.forEach(gift => {
        const item = document.createElement("div");
        item.className = "gift-item";
        const isTaken = Object.prototype.hasOwnProperty.call(takenGifts, gift.id);

        if (isTaken) item.classList.add("taken");

        item.innerHTML = `
            <div class="gift-icon">${gift.icon}</div>
            <h3>${gift.name}</h3>
            <p>${gift.description}</p>
            <div class="gift-status">${isTaken ? "✓ Já escolhido" : "Disponível"}</div>
        `;

        if (!isTaken) {
            item.addEventListener("click", () => selectGift(gift, item));
        }

        giftList.appendChild(item);
    });
}

// ==========================================
// SELECIONAR PRESENTE
// ==========================================
function selectGift(gift, element) {
    document.querySelectorAll(".gift-item").forEach(item => item.classList.remove("selected"));
    element.classList.add("selected");
    selectedGift = gift;
    if (selectedGiftText) selectedGiftText.textContent = `${gift.icon} ${gift.name}`;
}

// ==========================================
// CONFIRMAR ESCOLHA
// ==========================================
confirmGiftButton ? .addEventListener("click", () => {
    const name = guestName ? .value.trim();

    if (!name) return alert("Por favor, digite seu nome."), guestName ? .focus();
    if (!selectedGift) return alert("Por favor, escolha um presente da lista.");

    const takenGifts = getTakenGifts();

    if (Object.prototype.hasOwnProperty.call(takenGifts, selectedGift.id)) {
        alert("Esse presente já foi escolhido. Por favor, escolha outro.");
        selectedGift = null;
        renderGifts();
        if (selectedGiftText) selectedGiftText.textContent = "Nenhum item selecionado.";
        return;
    }

    // Salvar escolha
    takenGifts[selectedGift.id] = {
        name: name,
        gift: selectedGift.name,
        date: new Date().toISOString()
    };
    saveTakenGifts(takenGifts);

    // Exibir sucesso
    if (modalMessage) modalMessage.textContent = `${name}, seu presente "${selectedGift.name}" foi reservado com sucesso! ❤️`;
    successModal ? .classList.add("active");

    // Gerar link e atualizar tela
    createWhatsappLink(name, selectedGift.name);
    renderGifts();
    selectedGift = null;
    if (selectedGiftText) selectedGiftText.textContent = "Nenhum item selecionado.";
});

// ==========================================
// LINK DO WHATSAPP
// ==========================================
function createWhatsappLink(name, gift) {
    if (!whatsappButton) return;
    const message = `Olá! 😊 Confirmo minha presença no Chá de Casa Nova! 🏠❤️\nNome: ${name}\nPresente: ${gift}\nNos vemos lá! 🎉`;
    whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ==========================================
// CONTAGEM REGRESSIVA
// ==========================================
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

    // Evento já iniciado
    if (distance <= 0) {
        daysElement.textContent = hoursElement.textContent = minutesElement.textContent = secondsElement.textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
renderGifts();
updateCountdown();
setInterval(updateCountdown, 1000);
createWhatsappLink("", "");

// Fechar modal
closeModal ? .addEventListener("click", () => successModal ? .classList.remove("active"));
successModal ? .addEventListener("click", e => {
    if (e.target === successModal) successModal.classList.remove("active");
});

console.log("Chá de Casa Nova carregado com sucesso! 🏠❤️");