<template>
    <div class="min-h-screen bg-pink-100 flex items-center justify-center relative overflow-hidden font-sans">
        <!-- Background Elements -->
        <div class="absolute inset-0 z-0">
            <!-- Striped Background Pattern -->
            <div class="absolute inset-0 opacity-10"
                style="background-image: repeating-linear-gradient(45deg, #ff69b4 25px, transparent 25px, transparent 50px, #ff69b4 50px, #ff69b4 75px, transparent 75px, transparent 100px);">
            </div>

            <!-- Floating Hearts (CSS Animation) -->
            <div v-for="n in 10" :key="n" class="floating-heart absolute text-red-400 opacity-60" :style="{
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 10}s`,
                fontSize: `${20 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 5}s`
            }">
                ❤️
            </div>
        </div>

        <!-- Main Container -->
        <div class="relative z-10 w-full max-w-sm px-4">

            <!-- Polaroid Stack Effect -->
            <div class="relative w-full aspect-[4/5] mx-auto perspective-1000">
                <transition-group name="card-stack" tag="div" class="relative w-full h-full">
                    <div v-for="(card, index) in visibleCards" :key="card.id"
                        class="absolute inset-0 bg-white p-4 pb-12 shadow-xl rounded-lg transform transition-all duration-500 ease-in-out border-4 border-white"
                        :style="getCardStyle(index)">

                        <!-- =========================== -->
                        <!-- STANDARD CARD CONTENT       -->
                        <!-- =========================== -->
                        <div v-if="card.type !== 'ask-out'" class="w-full h-full flex flex-col">
                            <!-- Image Area -->
                            <div
                                class="w-full flex-1 bg-pink-200 rounded-md overflow-hidden flex items-center justify-center mb-4 relative">
                                <img :src="`/images/valentine/${card.image}`" alt="Sticker"
                                    class="w-full h-full object-contain p-4" />
                            </div>

                            <!-- Text Area -->
                            <div class="text-center mt-auto">
                                <h2 class="text-xl font-bold text-gray-800">{{ card.text }}</h2>
                                <p v-if="card.subtext" class="text-sm text-gray-500 mt-1">{{ card.subtext }}</p>
                            </div>

                            <!-- Decor -->
                            <div class="absolute bottom-4 right-4 text-red-500">❤️</div>
                        </div>


                        <!-- =========================== -->
                        <!-- SPECIAL ASK-OUT CARD CONTENT -->
                        <!-- =========================== -->
                        <div v-else class="w-full h-full flex flex-col relative">
                            <!-- Helper Text (Absolute Top) -->
                            <div class="absolute top-0 right-0 text-xs text-gray-300">
                                *Jawab jujur!
                            </div>

                            <!-- Image Area (Adaptive Sticker) -->
                            <div class="w-full flex-1 bg-pink-100 rounded-md overflow-hidden flex items-center justify-center mb-4 relative transition-colors duration-300"
                                :class="{ 'bg-red-100': noCount >= 3 }">
                                <img :src="currentAskSticker" alt="Sticker"
                                    class="w-full h-full object-contain p-4 transition-transform duration-300"
                                    :class="{ 'scale-110': noCount >= 3 }" />
                            </div>

                            <!-- Question Text -->
                            <div class="text-center mb-8">
                                <h2 class="text-xl font-bold text-gray-800">
                                    {{ card.text }}
                                </h2>
                            </div>

                            <!-- Buttons Container -->
                            <div class="relative h-16 w-full flex justify-center items-center">
                                <!-- Tombol NO -->
                                <button @click="handleNoClick" @mouseover="handleNoHover"
                                    class="absolute bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-300 transition-all duration-200 z-10"
                                    :style="noButtonStyle">
                                    {{ noButtonText }}
                                </button>

                                <!-- Tombol YES -->
                                <button @click="handleYesClick" @mouseover="handleYesHover"
                                    class="absolute bg-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 z-20"
                                    :style="yesButtonStyle">
                                    {{ yesButtonText }}
                                </button>
                            </div>
                        </div>

                    </div>
                </transition-group>
            </div>

            <!-- Navigation & Action -->
            <div class="mt-8 flex flex-col items-center gap-6">
                <!-- Nav Buttons (HANYA MUNCUL JIKA BUKAN KARTU TANYA JAWAB YANG BELUM SELESAI) -->
                <transition name="fade">
                    <div v-if="showNavigation" class="flex items-center gap-6">
                        <button @click="prevCard"
                            class="w-12 h-12 rounded-full bg-pink-300 text-white flex items-center justify-center shadow-lg hover:bg-pink-400 transition transform hover:scale-110 active:scale-95 disabled:opacity-50"
                            :disabled="currentIndex === 0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button @click="nextCard"
                            class="w-12 h-12 rounded-full bg-pink-300 text-white flex items-center justify-center shadow-lg hover:bg-pink-400 transition transform hover:scale-110 active:scale-95 disabled:opacity-50"
                            :disabled="currentIndex === cards.length - 1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </transition>

                <!-- Call to Action (Hanya di akhir) -->
                <transition name="fade">
                    <a v-if="currentIndex === cards.length - 1" :href="whatsappLink" target="_blank"
                        class="px-6 py-3 bg-red-400 text-white rounded-full font-semibold shadow-lg hover:bg-red-500 transition transform hover:-translate-y-1 active:translate-y-0 w-full text-center max-w-xs block">
                        Kirim Pesan 💌
                    </a>
                </transition>

                <!-- Footer Credit -->
                <div class="text-xs text-pink-300 mt-2">
                    Made with ❤️ for You
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// =========================================
// STATE: DATA
// =========================================
const cards = ref([
    { id: 1, type: 'standard', image: 'Stiker 17 (SFILE.MOBI).gif', text: 'Hai Sayang! 👋', subtext: 'Ada pesan buat kamu nih...' },
    { id: 'ask', type: 'ask-out', text: 'Kamu sayang aku gak?', subtext: '' }, // KARTU SPESIAL (INDEX 1)
    { id: 2, type: 'standard', image: 'Stiker 18 (SFILE.MOBI).gif', text: 'Kamu tau gak?', subtext: '' },
    { id: 3, type: 'standard', image: 'Stiker 21 (SFILE.MOBI).gif', text: 'Setiap lihat kamu...', subtext: 'Hatiku rasanya seneng banget' },
    { id: 4, type: 'standard', image: 'Stiker 20 (SFILE.MOBI).gif', text: 'Makasih ya...', subtext: 'Udah selalu ada buat aku' },
    { id: 5, type: 'standard', image: 'Stiker 12 (SFILE.MOBI).gif', text: 'Maaf kalau aku nyebelin', subtext: 'Kadang suka bikin emosi ✌️' },
    { id: 6, type: 'standard', image: 'Stiker 15 (SFILE.MOBI).gif', text: 'Tapi aslinya...', subtext: 'Aku sayang banget sama kamu! ❤️' },
    { id: 7, type: 'standard', image: 'Stiker 9 (SFILE.MOBI).gif', text: 'Jangan sedih-sedih ya', subtext: 'Nanti cantiknya ilang hlo' },
    { id: 8, type: 'standard', image: 'Stiker 8 (SFILE.MOBI).gif', text: 'Semangat terus ya!', subtext: 'Aku selalu dukung kamu' },
    { id: 9, type: 'standard', image: 'Stiker 10 (SFILE.MOBI).gif', text: 'Happy Valentine!', subtext: 'Love you forever! 🌹' },
]);

const currentIndex = ref(0);
const isAskCardSolved = ref(false); // Apakah kartu tanya jawab sudah berhasil?

// =========================================
// STATE: ASK OUT GAME
// =========================================
const noCount = ref(0);
const noButtonText = ref('Enggak 😝');
const yesButtonText = ref('Sayang Dong! 😍');

// State Posisi & Style Tombol (Relative to card content area)
const yesButtonStyle = ref({
    transform: 'scale(1)',
    top: '0px',
    left: '50px',
    position: 'absolute'
});

const noButtonStyle = ref({
    top: '0px',
    left: '-50px',
    position: 'absolute'
});

const defaultSticker = '/images/valentine/Stiker 17 (SFILE.MOBI).gif';
const angrySticker = '/images/valentine/Stiker 18 (SFILE.MOBI).gif';

const currentAskSticker = computed(() => {
    return noCount.value >= 3 ? angrySticker : defaultSticker;
});

// Helper: Random Position terbatas dalam area kartu
const getRandomPosition = () => {
    // Area aman relatif terhadap center container buttons
    const x = (Math.random() * 140) - 70; // -70 sampai 70
    const y = (Math.random() * 100) - 50; // -50 sampai 50
    return { top: `${y}px`, left: `${x}px` };
};

const handleNoClick = () => {
    noCount.value++;

    // Perbesar tombol YES
    const newScale = 1 + (noCount.value * 0.3);
    yesButtonStyle.value = {
        ...yesButtonStyle.value,
        transform: `scale(${newScale})`
    };

    if (noCount.value >= 3) {
        // Tombol NO kabur
        const pos = getRandomPosition();
        noButtonStyle.value = {
            ...noButtonStyle.value,
            top: pos.top,
            left: pos.left,
        };
        noButtonText.value = 'Jahat! 😭';
    }
};

const handleNoHover = () => {
    if (noCount.value >= 3) {
        const pos = getRandomPosition();
        noButtonStyle.value = {
            ...noButtonStyle.value,
            top: pos.top,
            left: pos.left,
        };
    }
}

const handleYesClick = () => {
    if (noCount.value < 2) {
        // BELUM BOLEH KLIK YES
        const pos = getRandomPosition();
        yesButtonStyle.value = {
            ...yesButtonStyle.value,
            top: pos.top,
            left: pos.left,
        };
        toast.warning("Eits! Cluenya tekan 2 kali  😝", {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
        });
    } else {
        // SUCCESS!
        isAskCardSolved.value = true;
        // Langsung lanjut ke slide berikutnya
        nextCard();
    }
};

const handleYesHover = () => {
    if (noCount.value < 2) {
        const pos = getRandomPosition();
        yesButtonStyle.value = {
            ...yesButtonStyle.value,
            top: pos.top,
            left: pos.left,
        };
    }
};

// =========================================
// LOGIC: NAVIGATION
// =========================================

const showNavigation = computed(() => {
    // Sembunyikan navigasi jika sedang di kartu "Ask Out" dan belum selesai
    const currentCard = cards.value[currentIndex.value];
    if (currentCard.type === 'ask-out' && !isAskCardSolved.value) {
        return false;
    }
    return true;
});

const visibleCards = computed(() => {
    return cards.value;
});

const getCardStyle = (index) => {
    if (index < currentIndex.value) {
        return {
            transform: 'translateX(-150%) rotate(-20deg)',
            opacity: 0,
            zIndex: 0
        };
    }
    if (index === currentIndex.value) {
        return {
            transform: 'translateX(0) rotate(0deg) scale(1)',
            opacity: 1,
            zIndex: 50
        };
    }
    const offset = index - currentIndex.value;
    if (offset > 2) {
        return {
            transform: `translateX(0) scale(0.8)`,
            opacity: 0,
            zIndex: 0
        };
    }
    return {
        transform: `translate(${offset * 10}px, -${offset * 5}px) rotate(${offset * 3}deg) scale(${1 - offset * 0.05})`,
        opacity: 1 - offset * 0.2,
        zIndex: 50 - offset
    };
};

const nextCard = () => {
    if (currentIndex.value < cards.value.length - 1) {
        currentIndex.value++;
    }
};

const prevCard = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

// Link WhatsApp
const whatsappLink = computed(() => {
    const phone = '6285264351660';
    const text = `Dari: \nWishnya: \nKata Hari ini: `;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
});

</script>

<style scoped>
/* Custom Font */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

.font-sans {
    font-family: 'Fredoka', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Animations */
@keyframes floatUp {
    0% {
        transform: translateY(100vh) scale(0.5);
        opacity: 0;
    }

    50% {
        opacity: 0.8;
    }

    100% {
        transform: translateY(-10vh) scale(1.2);
        opacity: 0;
    }
}

.floating-heart {
    position: absolute;
    bottom: -20px;
    animation: floatUp linear infinite;
}

/* Perspective Container for 3D effect */
.perspective-1000 {
    perspective: 1000px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
