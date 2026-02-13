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
                        <!-- =========================== -->
                        <!-- STANDARD CARD CONTENT       -->
                        <!-- =========================== -->
                        <div v-if="card.type === 'standard'" class="w-full h-full flex flex-col">
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
                        <div v-else-if="card.type === 'ask-out'" class="w-full h-full flex flex-col relative">
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

                        <!-- =========================== -->
                        <!-- CLOCK VOICE CARD (NEW)      -->
                        <!-- =========================== -->
                        <div v-else-if="card.type === 'clock'"
                            class="w-full h-full flex flex-col items-center justify-center bg-pink-50 rounded-lg overflow-hidden relative">
                            <!-- MUSIC BOX VISUAL -->
                            <div class="relative flex flex-col items-center">
                                <!-- Box Body -->
                                <div
                                    class="w-48 h-40 bg-rose-200 rounded-lg border-4 border-rose-300 shadow-xl flex items-center justify-center relative z-0">
                                    <div
                                        class="w-32 h-24 bg-rose-100/50 rounded flex flex-col items-center justify-center gap-2">
                                        <div class="flex gap-1">
                                            <div class="w-1 h-12 bg-gray-300 rounded-full"></div>
                                            <div class="w-1 h-10 bg-gray-300 rounded-full"></div>
                                            <div class="w-1 h-14 bg-gray-300 rounded-full"></div>
                                            <div class="w-1 h-11 bg-gray-300 rounded-full"></div>
                                        </div>
                                        <span class="text-[10px] text-rose-400 font-bold tracking-widest">LOVE
                                            SONG</span>
                                    </div>
                                    <!-- Keyhole -->
                                    <div class="absolute bottom-4 w-4 h-6 bg-rose-400 rounded-full"></div>
                                </div>

                                <!-- Rotating Handle/Crank (This is the interactive part) -->
                                <!-- Re-using 'card-clock-face' class for logic compatibility, effectively the 'touch zone' -->
                                <div class="card-clock-face absolute top-10 right-[-40px] w-32 h-32 flex items-center justify-center cursor-pointer touch-none z-10"
                                    @mousedown="startDrag" @touchstart="startDrag" @mousemove="onDrag"
                                    @touchmove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchend="stopDrag">

                                    <!-- The Crank Visual -->
                                    <div class="w-full h-full relative"
                                        :style="{ transform: `rotate(${rotation}deg)` }">
                                        <!-- Arm -->
                                        <div
                                            class="absolute top-[50%] left-[50%] w-16 h-4 bg-gray-400 rounded-full origin-left transform -translate-y-1/2 border-2 border-gray-500 shadow-md">
                                        </div>
                                        <!-- Knob (Handle Grip) -->
                                        <div
                                            class="absolute top-[50%] right-[-10px] w-8 h-8 bg-rose-500 rounded-full transform -translate-y-1/2 shadow-lg border-2 border-rose-600">
                                        </div>
                                        <!-- Axis -->
                                        <div
                                            class="absolute top-[50%] left-[50%] w-6 h-6 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-600">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p class="text-sm text-gray-500 mt-12 font-bold z-10 animate-pulse text-center">
                                <span v-if="isPlayingVoice">🎶 Sedang memutar... 🎶</span>
                                <span v-else>Putar tuasnya buat dengerin ❤️</span>
                            </p>

                            <!-- Hidden Audio -->
                            <audio class="card-audio-voice" loop>
                                <source src="/images/valentine/notes-valentine.mp3" type="audio/mpeg">
                            </audio>
                        </div>

                        <!-- =========================== -->
                        <!-- STATS CONTENT (NEW)         -->
                        <!-- =========================== -->
                        <div v-else-if="card.type === 'stats'"
                            class="w-full h-full flex flex-col items-center justify-center p-4">
                            <div class="text-6xl mb-4">⏳</div>
                            <h2 class="text-2xl font-bold text-pink-500 mb-2">Kita Udah Bareng</h2>

                            <div class="bg-pink-50 p-4 rounded-xl w-full border border-pink-100 my-4">
                                <p class="text-lg font-mono text-gray-700 font-bold text-center leading-relaxed">
                                    {{ timeTogether }}
                                </p>
                            </div>

                            <p class="text-gray-500 text-sm opacity-80 mt-2">
                                Dan masih akan terus berlanjut... ❤️
                            </p>

                            <div class="absolute bottom-4 right-4 text-red-500">❤️</div>
                        </div>

                    </div>
                </transition-group>
            </div>

            <!-- Music & Menu Controls -->
            <div class="absolute top-4 right-4 z-50 flex gap-2">
                <!-- Music Toggle -->
                <button @click="toggleMusic"
                    class="bg-white/80 p-2 rounded-full shadow-sm text-pink-400 hover:bg-white transition backdrop-blur-sm">
                    <span v-if="isMusicPlaying">🔊</span>
                    <span v-else>🔇</span>
                </button>
            </div>

            <!-- Hidden Youtube Player -->
            <div id="bg-music" class="hidden"></div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import confetti from 'canvas-confetti';

// =========================================
// STATE: DATA
// =========================================
const cards = ref([
    { id: 1, type: 'standard', image: 'Stiker 17 (SFILE.MOBI).gif', text: 'Hai Sayang! 👋', subtext: 'Ada pesan buat butett inih...' },
    { id: 'ask', type: 'ask-out', text: 'Butett sayang abang gak?', subtext: '' },
    { id: 2, type: 'standard', image: 'Stiker 18 (SFILE.MOBI).gif', text: 'Butett tau gak?', subtext: '' },
    { id: 3, type: 'standard', image: 'Stiker 21 (SFILE.MOBI).gif', text: 'Setiap lihat dirimu...', subtext: 'Hatiku rasanya seneng banget eaaa...' },
    { id: 4, type: 'standard', image: 'Stiker 20 (SFILE.MOBI).gif', text: 'Makasih ya...', subtext: 'Udah selalu ada buat Abangg' },
    { id: 5, type: 'standard', image: 'Stiker 12 (SFILE.MOBI).gif', text: 'Maaf kalau abang nyebelin', subtext: 'Kadang suka bikin emosi ✌️:)' },
    { id: 6, type: 'standard', image: 'Stiker 15 (SFILE.MOBI).gif', text: 'Tapi aslinya...', subtext: 'Abang sayang kali sama Butett! ❤️' },
    { id: 7, type: 'standard', image: 'Stiker 9 (SFILE.MOBI).gif', text: 'Jangan sedih-sedih ya', subtext: 'Nanti cantiknya ilang hlo' },
    { id: 8, type: 'standard', image: 'Stiker 8 (SFILE.MOBI).gif', text: 'Semangat terus ya!', subtext: 'Abang selalu dukung Butett' },
    { id: 'clock', type: 'clock', text: '', subtext: '' }, // KARTU JAM INTERAKTIF
    { id: 'stats', type: 'stats', text: 'Perjalanan Kiteniii', subtext: 'Udah sejauh ini lho...' },
]);

const currentIndex = ref(0);
const isAskCardSolved = ref(false);

// =========================================
// STATE: CLOCK INTERACTIVE
// =========================================
// =========================================
// STATE: CLOCK INTERACTIVE
// =========================================
// Hapus ref clockFace & voiceAudio karena kita pakai querySelector selector
const rotation = ref(0);
const isDragging = ref(false);
const isPlayingVoice = ref(false);
let lastAngle = 0;

const startDrag = (e) => {
    isDragging.value = true;
    updateRotation(e);

    // Attach window listeners
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
};

const stopDrag = () => {
    isDragging.value = false;

    const audioEl = document.querySelector('.card-audio-voice');
    if (audioEl && !audioEl.paused) {
        audioEl.pause();
        isPlayingVoice.value = false;

        // Resume background music (optional)
        // if (player.value && !isMusicPlaying.value) {
        //    player.value.playVideo();
        //    isMusicPlaying.value = true;
        // }
    }

    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    if (e.type === 'touchmove') e.preventDefault();
    updateRotation(e);
};

const updateRotation = (e) => {
    // DIRECT DOM SELECTOR
    const clockEl = document.querySelector('.card-clock-face');

    if (!clockEl) return;

    const rect = clockEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

    if (Math.abs(angle - lastAngle) > 2) {
        const audioEl = document.querySelector('.card-audio-voice');
        if (audioEl && audioEl.paused) {
            audioEl.play().catch(err => console.error("Play failed", err));
            isPlayingVoice.value = true;

            if (player.value && isMusicPlaying.value) {
                player.value.pauseVideo();
                isMusicPlaying.value = false;
            }
        }
    }

    rotation.value = angle;
    lastAngle = angle;
};

// =========================================
// STATE: TIMER / STATS
// =========================================
const startDate = new Date('2025-05-04T00:00:00'); // 04 Mei 2024
const timeTogether = ref('');

const updateTimer = () => {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timeTogether.value = `${days} Hari, ${hours} Jam, ${minutes} Menit, ${seconds} Detik`;
};

let timerInterval;

// =========================================
// STATE: MUSIC (YouTube Iframe)
// =========================================
const isMusicPlaying = ref(false);
const player = ref(null);

// Load YouTube Iframe API
const loadYoutubeAPI = () => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
        player.value = new window.YT.Player('bg-music', {
            height: '0',
            width: '0',
            videoId: 'mJE0ROBWPvY', // ID Video dari URL: https://youtu.be/mJE0ROBWPvY
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'loop': 1,
                'playlist': 'mJE0ROBWPvY'
            },
            events: {
                'onReady': onPlayerReady,
            }
        });
    };
};

const onPlayerReady = (event) => {
    // Autoplay sering diblokir browser, jadi kita set volume kecil dulu atau tunggu interaksi user
    event.target.setVolume(50);
    // event.target.playVideo(); // Coba autoplay
    isMusicPlaying.value = true;
};

const toggleMusic = () => {
    if (!player.value) return;

    if (isMusicPlaying.value) {
        player.value.pauseVideo();
        isMusicPlaying.value = false;
    } else {
        player.value.playVideo();
        isMusicPlaying.value = true;
    }
};

onMounted(() => {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    loadYoutubeAPI();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});

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
        toast.warning("Eits! Cluenya tekan2 kali 😝", {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
        });
    } else {
        // SUCCESS!
        isAskCardSolved.value = true;

        // 1. Confetti Effect
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#ffb6c1'] // Pink themes
        });

        // 2. Play Music if not playing (Interaction required for audio)
        if (player.value && !isMusicPlaying.value) {
            player.value.playVideo();
            isMusicPlaying.value = true;
        }

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
