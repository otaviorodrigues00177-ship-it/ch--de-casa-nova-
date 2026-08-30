// ==========================================
// CONFIGURAÇÕES — COLOQUE SEU NÚMERO ABAIXO
// ==========================================
const eventDate = new Date("2026-10-10T15:00:00").getTime();
// ⚠️ COLOQUE SEU NÚMERO COM DDD (SÓ NÚMEROS)
const whatsappNumber = "5516997882498";

// ==========================================
// LISTA DE PRESENTES
// ==========================================
const gifts = [
    { id: 1,  icon: "🍳", name: "Jogo de panelas",      description: "Panelas para a cozinha" },
    { id: 2,  icon: "🍽️", name: "Jogo de pratos",       description: "Conjunto de pratos" },
    { id: 3,  icon: "🥛", name: "Jogo de copos",         description: "Copos para o dia a dia" },
    { id: 4,  icon: "☕", name: "Jogo de xícaras",       description: "Xícaras para café" },
    { id: 5,  icon: "🍴", name: "Jogo de talheres",      description: "Talheres para a casa" },
    { id: 6,  icon: "🛏️", name: "Jogo de cama",          description: "Lençóis e fronhas" },
    { id: 7,  icon: "🛁", name: "Toalhas de banho",      description: "Kit de toalhas" },
    { id: 8,  icon: "🧹", name: "Kit de limpeza",        description: "Produtos de limpeza" },
    { id: 9,  icon: "🗑️", name: "Lixeira",              description: "Lixeira para cozinha" },
    { id: 10, icon: "🥣", name: "Jogo de potes",         description: "Potes para alimentos" },
    { id: 11, icon: "🍵", name: "Chaleira",             description: "Chaleira para cozinha" },
    { id: 12, icon: "🧺", name: "Cesto de roupa",        description: "Cesto organizador" },
    { id: 13, icon: "🧂", name: "Kit de temperos",       description: "Porta-temperos" },
    { id: 14, icon: "🪴", name: "Planta decorativa",     description: "Planta para decorar a casa" },
];

// ==========================================
// VARIÁVEIS
// ==========================================
let selectedGift = null;

// ==========================================
// PEGAR ELEMENTOS DA PÁGINA
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
// SALVAR E CARREGAR PRESENTES
// ==========================================
function getTakenGifts() {
    try {
        const saved = localStorage.getItem("chaCasaNovaGifts");
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error("Erro ao carregar:", error);
        return {};
    }
}

function saveTakenGifts(data) {
    localStorage.setItem("chaCasaNovaGifts", JSON.stringify(data));
}

// ==========================================
// 📋 MOSTRAR LISTA DE PRESENTES NA TELA
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
// ✅ ESCOLHER PRESENTE
// ==========================================
function selectGift(gift, element) {
    // Remove seleção anterior
    document.querySelectorAll(".gift-item").forEach(i => i.classList.remove("selected"));
    // Marca o escolhido
    element.classList.add("selected");
    selectedGift = gift;
    if (selectedGiftText) selectedGiftText.textContent = `${gift.icon} ${gift.name}`;
}

// ==========================================
// CONFIRMAR ESCOLHA
// ==========================================
confirmGiftButton?.addEventListener("click", () => {
    const name = guestName?.value.trim();

    if (!name) return alert("Por favor, digite seu nome!"), guestName?.focus();
    if (!selectedGift) return alert("Por favor, escolha um presente clicando na lista acima!");

    const takenGifts = getTakenGifts();

    if (takenGifts[selectedGift.id]) {
        alert("Ops! Esse presente já foi escolhido. Escolha outro.");
        selectedGift = null;
        renderGifts();
        if (selectedGiftText) selectedGiftText.textContent = "Nenhum item selecionado.";
        return;
    }

    // Salva a escolha
    takenGifts[selectedGift.id] = {
        name: name,
        gift: selectedGift.name,
        date: new Date().toISOString()
    };
    saveTakenGifts(takenGifts);

    // Mostra mensagem de sucesso
    if (modalMessage) modalMessage.textContent = `${name}, seu presente "${selectedGift.name}" foi reservado com sucesso! ❤️`;
    successModal?.classList.add("active");

    // Gera link do WhatsApp
    createWhatsappLink(name, selectedGift.name);

    // Atualiza a tela
    renderGifts();
    selectedGift = null;
    if (selectedGiftText) selectedGiftText.textContent = "Nenhum item selecionado.";
});

// ==========================================
// LINK DO WHATSAPP
// ==========================================
function createWhatsappLink(name, gift) {
    if (!whatsappButton) return;
    const mensagem = `Olá! 😊 Confirmo minha presença no Chá de Casa Nova! 🏠❤️\nNome: ${name}\nPresente: ${gift}\nNos vemos lá! 🎉`;
    whatsappButton.href = `https://wa.me/${5516997882498}?text=${encodeURIComponent(eu to comfrimado)}`;
}

// ==========================================
// FECHAR MODAL
// ==========================================
closeModal?.addEventListener("click", () => successModal?.classList.remove("active"));
successModal?.addEventListener("click", e => {
    if (e.target === successModal) successModal.classList.remove("active");
});

// ==========================================
// 🚀 INICIAR TUDO QUANDO A PÁGINA CARREGAR
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    renderGifts(); // ← ISSO MOSTRA A LISTA DE PRESENTES! NÃO APAGUE!
    createWhatsappLink("", "");
    console.log("✅ Lista de presentes carregada!");
});
