// ==========================================
// CONFIGURAÇÕES — COLOQUE SEU NÚMERO ABAIXO
// ==========================================
const whatsappNumber = "5516997882498"; // ⚠️ CONFIRME SEU NÚMERO AQUI!

// ==========================================
// ✅ LISTA DE PRESENTES — COM SEUS ITENS!
// ==========================================
const gifts = [
    { id: 1,  icon: "🛏️", name: "Jogo de lençol",          description: "Lençóis e fronhas" },
    { id: 2,  icon: "☁️", name: "Edredom",                 description: "Cobertor acolchoado" },
    { id: 3,  icon: "💆", name: "Almofadas",                description: "Almofadas decorativas" },
    { id: 4,  icon: "🟫", name: "Tapete",                   description: "Tapete para sala/quarto" },
    { id: 5,  icon: "😴", name: "Travesseiros",             description: "Travesseiros confortáveis" },
    { id: 6,  icon: "🧺", name: "Cesto para roupa suja",    description: "Cesto organizador" },
    { id: 7,  icon: "🛁", name: "Jogo de toalhas",          description: "Toalhas de banho e rosto" },
    { id: 8,  icon: "🍽️", name: "Pratos rasos",             description: "Conjunto de pratos rasos" },
    { id: 9,  icon: "🥣", name: "Pratos fundos",            description: "Conjunto de pratos fundos" },
    { id: 10, icon: "🥛", name: "Jogo de copos",            description: "Copos para uso diário" },
    { id: 11, icon: "🍷", name: "Jogo de taças",            description: "Taças para ocasiões" },
    { id: 12, icon: "🌡️", name: "Garrafa térmica",          description: "Mantém a temperatura" },
    { id: 13, icon: "🍽️", name: "Travessas",               description: "Para servir refeições" },
    { id: 14, icon: "🫙", name: "Jarra",                    description: "Para água e sucos" },
    { id: 15, icon: "🔪", name: "Tábua para cortar carne",  description: "Tábua de corte" },
    { id: 16, icon: "🥄", name: "Batedeira",                description: "Para preparar massas" },
    { id: 17, icon: "🔄", name: "Liquidificador",           description: "Bater e misturar alimentos" },
    { id: 18, icon: "🍞", name: "Torradeira",              description: "Torradas rápidas" },
    { id: 19, icon: "🍎", name: "Fruteira",                description: "Organização de frutas" },
    { id: 20, icon: "🚿", name: "Jogo de banheiro",         description: "Acessórios para banheiro" }
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
// 📋 MOSTRAR LISTA NA TELA
// ==========================================
function renderGifts() {
    if (!giftList) {
        console.error("❌ Elemento giftList NÃO ENCONTRADO no HTML!");
        return;
    }
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

    console.log(`✅ ${gifts.length} itens carregados!`);
}

// ==========================================
// ✅ ESCOLHER PRESENTE
// ==========================================
function selectGift(gift, element) {
    document.querySelectorAll(".gift-item").forEach(i => i.classList.remove("selected"));
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
    whatsappButton.href = `https://wa.me/${5516997882498}?text=${encodeURIComponent(mensagem)}`;
}

// ==========================================
// FECHAR MODAL
// ==========================================
closeModal?.addEventListener("click", () => successModal?.classList.remove("active"));
successModal?.addEventListener("click", e => {
    if (e.target === successModal) successModal.classList.remove("active");
});

// ==========================================
// 🚀 INICIAR — MOSTRA A LISTA AUTOMATICAMENTE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Página carregada! Carregando presentes...");
    renderGifts(); // ← ESSA LINHA MOSTRA A LISTA! NÃO APAGUE!
    createWhatsappLink("", "");
});
