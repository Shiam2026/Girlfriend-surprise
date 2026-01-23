// --- 1. Global Variables & Setup ---
let currentPage = 1;
const totalPages = 15;
let correctPassword = "";
let gfName = "Beautiful"; // Default name
let bfName = "Me";        // Default name

// --- 2. Initialization & URL Logic ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Start Background Animation
    createFloatingBgElements();

    // 2. Check for URL Data (Link from Partner)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('data')) {
        // --- RECIPIENT MODE (Girlfriend view) ---
        // Hide Setup, Show Lock Screen
        document.getElementById('setupPage').classList.remove('active');
        document.getElementById('lockPage').classList.add('active');
        
        try {
            // Decode the data from URL
            const decoded = atob(urlParams.get('data'));
            const info = JSON.parse(decoded);
            
            // Set Variables
            correctPassword = info.pass;
            gfName = info.gf;
            bfName = info.bf;
            
            // Set Hint on Lock Screen
            const hintEl = document.getElementById('display-hint');
            if(hintEl) hintEl.innerText = info.hint;
            
            // Apply Names to the App (Personalization)
            personalizeContent();
            
        } catch (e) {
            console.error(e);
            alert("Invalid or broken link! Please ask for a new one.");
        }
        
    } else {
        // --- CREATOR MODE (Your view) ---
        // Setup page is already active in HTML by default
    }
});

// --- 3. Generator Functions (For Setup Page) ---
function generateLink() {
    const gf = document.getElementById('setup-gf').value.trim();
    const bf = document.getElementById('setup-bf').value.trim();
    const pass = document.getElementById('setup-pass').value.trim();
    const hint = document.getElementById('setup-hint').value.trim();

    if (!gf || !bf || !pass || !hint) {
        alert("Please fill all fields! ❤️");
        return;
    }

    const dataObj = { gf: gf, bf: bf, pass: pass, hint: hint };
    
    // Convert to JSON then Base64
    const dataString = btoa(JSON.stringify(dataObj));
    
    // Build URL
    const fullUrl = window.location.origin + window.location.pathname + "?data=" + dataString;
    
    // Show Result
    document.getElementById('result-area').classList.remove('hidden');
    document.getElementById('generated-url').value = fullUrl;
}

function copyLink() {
    const copyText = document.getElementById("generated-url");
    copyText.select();
    document.execCommand("copy");
    alert("Link Copied! Send it to her 💌");
}

// --- 4. Unlock Functions (For Lock Page) ---
// Inside script.js

function checkPassword() {
    const inputPass = document.getElementById('unlock-pass').value.trim();
    
    if (inputPass.toLowerCase() === correctPassword.toLowerCase()) {
        // Unlock Successful
        document.getElementById('lockPage').classList.remove('active');
        document.getElementById('lockPage').style.display = 'none';
        
        document.getElementById('mainApp').classList.remove('hidden');

        // --- ADD THIS CODE HERE ---
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = 0.5; // Optional: Set volume to 50%
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
        }
        // --------------------------
        
        // Smooth fade in for Page 1
        setTimeout(() => {
             document.getElementById('page1').classList.add('active');
        }, 100);
        
        document.title = `For ${gfName} ❤️`;
        
    } else {
        // ... (existing error code) ...
    }
}

function personalizeContent() {
    // Update Name on Page 1
    const gfDisplay = document.getElementById('d-gf-name');
    if(gfDisplay) gfDisplay.innerText = gfName;

    // Update Name on Letter Page
    document.querySelectorAll('.d-gf-name-text').forEach(el => {
        el.innerText = gfName;
    });

    const letterBf = document.getElementById('d-bf-name');
    if(letterBf) letterBf.innerText = bfName;
}

// --- 5. Main App Logic ---

function createFloatingBgElements() {
    const bgContainer = document.getElementById('floatingBg');
    if (!bgContainer) return;
    
    const elements = ['❤️', '💖', '🎈', '✨', '🌸', '🥰'];
    
    for (let i = 0; i < 25; i++) {
        const el = document.createElement('div');
        el.classList.add('floating-element');
        el.innerText = elements[Math.floor(Math.random() * elements.length)];
        
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 30 + 20) + 'px';
        el.style.animationDuration = (Math.random() * 15 + 10) + 's';
        el.style.animationDelay = (Math.random() * 5) + 's';
        
        bgContainer.appendChild(el);
    }
}

function nextPage(pageNumber) {
    // Hide current page
    const current = document.querySelector('.page.active');
    if (current) current.classList.remove('active');
    
    // Show next page
    setTimeout(() => {
        const next = document.getElementById(`page${pageNumber}`);
        if (next) {
            next.classList.add('active');
            currentPage = pageNumber;
            window.scrollTo(0, 0);

            // --- ১০ নম্বর পেজে ফুল আবার নতুন করে ফুটবে ---
            if (pageNumber === 10) {
                const flowerStage = document.querySelector('.flower-stage');
                if (flowerStage) {
                    const content = flowerStage.innerHTML;
                    flowerStage.innerHTML = ''; /* মুছে ফেলুন */
                    setTimeout(() => {
                        flowerStage.innerHTML = content; /* আবার ফিরিয়ে আনুন */
                    }, 50);
                }
            }
            // ------------------------------------------------
        }
    }, 300);
}

// Music Player
let currentPlayingAudio = null;
let currentPlayingBtn = null;

function playSong(audioId, btn) {
    stopAllMusic();
    const audio = document.getElementById(audioId);
    
    if (currentPlayingAudio === audio) {
        currentPlayingAudio = null;
        return;
    }

    if (audio) {
        audio.play().then(() => {
            btn.classList.add('playing');
            const originalText = btn.innerText;
            btn.innerText = "Playing... 🎧";
            btn.setAttribute('data-original-text', originalText);
            
            document.getElementById('stopBtn').classList.remove('hidden');
            currentPlayingAudio = audio;
            currentPlayingBtn = btn;
            
            audio.onended = stopAllMusic;
        }).catch(err => console.log("Audio play error:", err));
    }
}

// Inside script.js

function stopAllMusic() {
    // 1. Stop the Background Music we added
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.pause();
    }

    // 2. Stop any specific song currently playing (Existing code)
    if (currentPlayingAudio) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
    }
    if (currentPlayingBtn) {
        currentPlayingBtn.classList.remove('playing');
        const ogText = currentPlayingBtn.getAttribute('data-original-text');
        if (ogText) currentPlayingBtn.innerText = ogText;
    }
    currentPlayingAudio = null;
    currentPlayingBtn = null;
    
    const stopBtn = document.getElementById('stopBtn');
    if(stopBtn) stopBtn.classList.add('hidden');
}
// Quiz Logic
function wrongAnswer(btn) {
    btn.classList.add('wrong');
    btn.innerText = "Oops, try again! 😅";
    setTimeout(() => {
        btn.classList.remove('wrong');
        btn.innerText = btn.getAttribute('onclick').includes('Eyes') ? "Your Eyes" : "Your Style";
    }, 1500);
}

function correctAnswer(btn) {
    btn.classList.add('correct');
    btn.innerText = "Yes! That's it! 🎉";
    document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
    document.getElementById('quizNext').classList.remove('hidden');
}

// Reason Logic
const reasons = [
    "Your smile instantly brightens my darkest days.",
    "The way you understand me without words.",
    "Your incredible kindness to everyone around you.",
    "How you support my dreams, no matter how crazy.",
    "Just being YOU makes my life complete."
];

function showReason() {
    const display = document.getElementById('reason-display');
    display.style.opacity = 0;
    setTimeout(() => {
        const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
        display.innerText = randomReason;
        display.style.opacity = 1;
    }, 300);
}

// --- 6. Runaway Button Logic (পালিয়ে যাওয়া বাটন) ---
function moveButton(btn) {
    // বর্তমান পেজের কন্টেইনার খুঁজে বের করা
    const container = document.querySelector('.proposal-buttons');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    // বাটনের নতুন পজিশন ক্যালকুলেট করা (কন্টেইনারের ভেতরে)
    // 10px প্যাডিং রাখা হয়েছে যাতে একদম বর্ডারে না লেগে যায়
    const maxX = rect.width - btnRect.width - 20;
    const maxY = rect.height - btnRect.height - 20;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    // নতুন পজিশন সেট করা
    btn.style.position = 'absolute';
    btn.style.left = Math.max(0, newX) + 'px';
    btn.style.top = Math.max(0, newY) + 'px';
}

// --- 7. Final Success & New Buttons Logic ---

// --- 7. Final Success & New Buttons Logic ---

function finalSuccess() {
    const overlay = document.getElementById('success-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        stopAllMusic();
        
        // পেজ যাতে লোড হতে সময় পায়, তাই ৩০০ মি.সে. পরে ইমোজি শুরু হবে
        setTimeout(() => {
            sendLoves(); 
        }, 300);
    }
}

// ফাংশন: ল্যাগ ছাড়া স্মুথলি ইমোজি ভাসানো (Batching Method)
function sendLoves() {
    const emojis = ['❤️', '💖', '💕', '💞', '💓', '😍', '😘', '🌹', '🦋'];
    const container = document.body;
    
    let count = 0;
    const totalEmojis = 150; // মোট কতগুলো ইমোজি চান

    // একসাথে সব লোড না করে, প্রতি ৫০ মিলিসেকেন্ড পর পর ৫টি করে ইমোজি ছাড়বে
    // এতে ব্রাউজার কখনোই হ্যাং করবে না।
    const interval = setInterval(() => {
        
        for (let i = 0; i < 5; i++) { // একবারে ৫টি তৈরি হবে
            const emoji = document.createElement('div');
            emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.classList.add('floating-emoji');
            
            // পজিশন এবং সাইজ
            emoji.style.left = Math.random() * 100 + 'vw';
            emoji.style.fontSize = (Math.random() * 20 + 20) + 'px';
            emoji.style.animationDuration = (Math.random() * 2 + 3) + 's'; 
            
            container.appendChild(emoji);

            // ৫ সেকেন্ড পর মেমোরি ক্লিয়ার
            setTimeout(() => {
                emoji.remove();
            }, 5000);
        }

        count += 5;
        if (count >= totalEmojis) {
            clearInterval(interval); // ১৫০টি হয়ে গেলে থামা
        }
    }, 50); // প্রতি ৫০ms পর পর রিপিট হবে
}
// ফাংশন: পাসওয়ার্ড পেজ ছাড়া আবার শুরু করা
function restartExperience() {
    // সাকসেস ওভারলে লুকানো
    document.getElementById('success-overlay').classList.add('hidden');
    
    // সব পেজ লুকিয়ে ফেলা
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // currentPage রিসেট করা
    currentPage = 1;
    
    // প্রথম পেজ (পাসওয়ার্ডের পরের পেজ) দেখানো
    document.getElementById('page1').classList.add('active');
    
    // মিউজিক রিসেট করা
    stopAllMusic();
    
    // স্ক্রলের পজিশন ঠিক করা
    window.scrollTo(0, 0);
}