/* ==========================================================================
   DR. NEEL VIP BIRTHDAY SURPRISE - APP.JS
   Features:
   - Background Birthday Song & Audio Player (Autoplay on interaction + Custom MP3 upload)
   - 24K Gold Canvas Particle & Confetti Engine
   - Synthesized Web Audio API FX (Champagne cork, candle whoosh, fanfare)
   - Interactive Candle Blow-Out & Smoke Animation
   - Certificate Print & Clipboard Citation Sharing
   - Final Birthday Surprise Gift Modal with Grand Confetti Burst
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. BACKGROUND MUSIC & AUDIO PLAYER
  // =========================================================================
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicEqualizer = document.getElementById('music-equalizer');
  const musicLabel = document.getElementById('music-label');
  const musicVolume = document.getElementById('music-volume');
  const customAudioFileInput = document.getElementById('custom-audio-file');
  const musicPrompt = document.getElementById('music-prompt');
  const closePromptBtn = document.getElementById('close-prompt-btn');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const npDisc = document.querySelector('.np-disc');

  let isMusicPlaying = false;
  let userHasInteracted = false;

  if (bgMusic) {
    bgMusic.volume = musicVolume ? parseFloat(musicVolume.value) : 0.75;
  }

  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    if (musicEqualizer) {
      if (playing) {
        musicEqualizer.classList.add('playing');
      } else {
        musicEqualizer.classList.remove('playing');
      }
    }
    if (musicToggleBtn) {
      if (playing) {
        musicToggleBtn.classList.add('is-playing');
        if (musicLabel) musicLabel.textContent = 'MUSIC: ON 🎵';
      } else {
        musicToggleBtn.classList.remove('is-playing');
        if (musicLabel) musicLabel.textContent = 'MUSIC: PAUSED ⏸️';
      }
    }
    if (npDisc) {
      if (playing) {
        npDisc.classList.add('spinning');
      } else {
        npDisc.classList.remove('spinning');
      }
    }
    if (musicPrompt && playing) {
      musicPrompt.classList.add('hidden');
    }
  }

  function playMusic() {
    if (!bgMusic) return;
    initAudio();
    bgMusic.play().then(() => {
      updateMusicUI(true);
    }).catch(err => {
      console.log('Autoplay deferred until user gesture:', err);
    });
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    updateMusicUI(false);
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasInteracted = true;
      toggleMusic();
    });
  }

  if (musicVolume && bgMusic) {
    musicVolume.addEventListener('input', (e) => {
      e.stopPropagation();
      bgMusic.volume = parseFloat(e.target.value);
    });
  }

  // Custom MP3 / Song Upload
  if (customAudioFileInput && bgMusic) {
    customAudioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        bgMusic.src = objectUrl;
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        if (nowPlayingTitle) {
          nowPlayingTitle.textContent = 'Track: ' + cleanName;
        }
        playMusic();
        launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 75);
      }
    });
  }

  // Floating prompt banner click
  if (musicPrompt) {
    musicPrompt.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasInteracted = true;
      playMusic();
    });
  }

  if (closePromptBtn) {
    closePromptBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (musicPrompt) musicPrompt.classList.add('hidden');
    });
  }

  // Autoplay on first click anywhere on the page
  function handleFirstUserInteraction() {
    if (userHasInteracted) return;
    userHasInteracted = true;
    initAudio();
    playMusic();
    window.removeEventListener('click', handleFirstUserInteraction);
    window.removeEventListener('touchstart', handleFirstUserInteraction);
    window.removeEventListener('keydown', handleFirstUserInteraction);
  }

  window.addEventListener('click', handleFirstUserInteraction);
  window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true });
  window.addEventListener('keydown', handleFirstUserInteraction);


  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER (Sound FX: Pops, Fanfare, Whoosh)
  // =========================================================================
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sound FX: Champagne Pop / Confetti Cork
  function playPopSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.13);

      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const chime = audioCtx.createOscillator();
        const chimeGain = audioCtx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + (idx * 0.04));
        chimeGain.gain.setValueAtTime(0.06, now + (idx * 0.04));
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + (idx * 0.04));
        chime.connect(chimeGain);
        chimeGain.connect(audioCtx.destination);
        chime.start(now + (idx * 0.04));
        chime.stop(now + 0.4 + (idx * 0.04));
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Sound FX: Candle Blow Whoosh
  function playBlowSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.38);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.4);

      setTimeout(() => {
        if (!sfxEnabled) return;
        const chime = audioCtx.createOscillator();
        const chimeGain = audioCtx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(880, audioCtx.currentTime);
        chimeGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        chime.connect(chimeGain);
        chimeGain.connect(audioCtx.destination);
        chime.start(audioCtx.currentTime);
        chime.stop(audioCtx.currentTime + 0.55);
      }, 350);
    } catch (e) {
      console.warn(e);
    }
  }

  // Sound FX: Grand Victory Fanfare (for Final Surprise)
  function playFanfareSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [
        { f: 523.25, t: 0.00, d: 0.18 }, // C5
        { f: 659.25, t: 0.15, d: 0.18 }, // E5
        { f: 783.99, t: 0.30, d: 0.20 }, // G5
        { f: 1046.50, t: 0.48, d: 0.55 }  // C6
      ];

      const now = audioCtx.currentTime;
      notes.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        gain.gain.setValueAtTime(0.16, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + note.t);
        osc.stop(now + note.t + note.d);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // SFX Toggle button logic
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxBtnText = sfxToggleBtn ? sfxToggleBtn.querySelector('.btn-text') : null;

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        sfxIcon.textContent = '🔊';
        if (sfxBtnText) sfxBtnText.textContent = 'SFX: ON';
        playPopSound();
      } else {
        sfxIcon.textContent = '🔇';
        if (sfxBtnText) sfxBtnText.textContent = 'SFX: OFF';
      }
    });
  }

  // =========================================================================
  // 3. 24K GOLD PARTICLES & CONFETTI CANVAS ENGINE
  // =========================================================================
  const canvas = document.getElementById('gold-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const backgroundDust = [];
  const DUST_COUNT = 38;

  for (let i = 0; i < DUST_COUNT; i++) {
    backgroundDust.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.03 + 0.01
    });
  }

  const confettiPieces = [];
  const goldPalette = ['#fef3c7', '#fde047', '#dfb76c', '#c59b3f', '#9a7329', '#ffffff'];

  class ConfettiParticle {
    constructor(x, y, isBurst = false) {
      this.x = x || Math.random() * width;
      this.y = y || (isBurst ? height * 0.5 : -20);
      this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      this.shape = Math.random() > 0.3 ? 'rect' : 'circle';
      this.size = Math.random() * 8 + 5;
      this.aspect = Math.random() * 0.6 + 0.4;
      
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 5;
      } else {
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = Math.random() * 3 + 2;
      }

      this.gravity = 0.14;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.wobble = 0;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
      this.alpha = 1;
      this.decay = Math.random() * 0.004 + 0.003;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.alpha -= this.decay;
      return this.alpha > 0 && this.y < height + 40;
    }

    draw(context) {
      context.save();
      context.translate(this.x + Math.sin(this.wobble) * 4, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.globalAlpha = Math.max(0, this.alpha);
      context.fillStyle = this.color;

      if (this.shape === 'rect') {
        context.fillRect(-this.size / 2, (-this.size * this.aspect) / 2, this.size, this.size * this.aspect);
      } else {
        context.beginPath();
        context.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }
  }

  function launchConfettiBurst(originX, originY, count = 70) {
    playPopSound();
    const x = originX || width / 2;
    const y = originY || height / 2;
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiParticle(x, y, true));
    }
  }

  function renderCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < backgroundDust.length; i++) {
      const p = backgroundDust[i];
      p.y -= p.speedY;
      p.x += p.speedX;
      p.pulse += p.pulseSpeed;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const currentAlpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);

      ctx.save();
      ctx.fillStyle = '#dfb76c';
      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const piece = confettiPieces[i];
      if (piece.update()) {
        piece.draw(ctx);
      } else {
        confettiPieces.splice(i, 1);
      }
    }

    requestAnimationFrame(renderCanvas);
  }

  renderCanvas();

  const topConfettiBtn = document.getElementById('confetti-burst-btn');
  if (topConfettiBtn) {
    topConfettiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = topConfettiBtn.getBoundingClientRect();
      launchConfettiBurst(rect.left + rect.width / 2, rect.bottom + 10, 80);
    });
  }

  setTimeout(() => {
    launchConfettiBurst(width / 2, height * 0.3, 60);
  }, 700);

  // =========================================================================
  // 4. INTERACTIVE BIRTHDAY CAKE & BLOW CANDLES
  // =========================================================================
  const cakeWrapper = document.getElementById('cake-wrapper');
  const blowCandlesBtn = document.getElementById('blow-candles-btn');
  const blowBtnText = document.getElementById('blow-btn-text');
  const cakeHint = document.getElementById('cake-hint');
  let candlesBlown = false;

  if (blowCandlesBtn && cakeWrapper) {
    blowCandlesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!candlesBlown) {
        candlesBlown = true;
        cakeWrapper.classList.add('cake-blown');
        playBlowSound();

        const rect = cakeWrapper.getBoundingClientRect();
        launchConfettiBurst(rect.left + rect.width / 2, rect.top + 60, 90);

        if (blowBtnText) blowBtnText.textContent = 'RELIGHT CANDLES 🔥';
        if (cakeHint) cakeHint.textContent = '✨ WISH GRANTED! Dr. Neel\'s candles are blown out.';
      } else {
        candlesBlown = false;
        cakeWrapper.classList.remove('cake-blown');
        playPopSound();

        if (blowBtnText) blowBtnText.textContent = 'BLOW CANDLES & MAKE A WISH';
        if (cakeHint) cakeHint.textContent = 'Candles reignited! Click to blow them out again.';
      }
    });
  }

  // =========================================================================
  // 5. CERTIFICATE PRINT & CLIPBOARD ACTIONS
  // =========================================================================
  const printCertBtn = document.getElementById('print-cert-btn');
  if (printCertBtn) {
    printCertBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      window.print();
    });
  }

  const copyCitationBtn = document.getElementById('copy-citation-btn');
  const copyBtnText = document.getElementById('copy-btn-text');

  if (copyCitationBtn) {
    copyCitationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      const citationText = '🏆 CERTIFICATE OF RECOGNITION 🏆\n' +
        'Officially Certified as the Most Annoying Human of the Year\n' +
        'Awarded To: DR. NEEL\n\n' +
        'Citations:\n' +
        '• Talking nonsense confidently.\n' +
        '• Ragebaiting people professionally.\n' +
        '• Having an answer for everything.\n' +
        '• Being impossible to replace despite all the nonsense.\n\n' +
        'Verified by: Your Only Sane Best Friend\n' +
        'Validity: Lifetime & Non-Refundable!';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citationText).then(() => {
          if (copyBtnText) copyBtnText.textContent = 'COPIED TO CLIPBOARD! ✓';
          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = 'COPY CITATION';
          }, 2500);
        }).catch(() => {
          fallbackCopyText(citationText);
        });
      } else {
        fallbackCopyText(citationText);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    if (copyBtnText) copyBtnText.textContent = 'COPIED TO CLIPBOARD! ✓';
    setTimeout(() => {
      if (copyBtnText) copyBtnText.textContent = 'COPY CITATION';
    }, 2500);
  }

  // =========================================================================
  // 6. FINAL SURPRISE GIFT MODAL & CELEBRATION
  // =========================================================================
  const finalGiftBtn = document.getElementById('final-gift-btn');
  const giftModal = document.getElementById('gift-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalConfettiBtn = document.getElementById('modal-confetti-btn');
  const modalAcceptBtn = document.getElementById('modal-accept-btn');

  function openGiftModal() {
    if (!giftModal) return;
    initAudio();
    playFanfareSound();

    launchConfettiBurst(width * 0.35, height * 0.45, 80);
    setTimeout(() => {
      launchConfettiBurst(width * 0.65, height * 0.45, 80);
    }, 250);

    giftModal.classList.add('active');
    giftModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGiftModal() {
    if (!giftModal) return;
    playPopSound();
    giftModal.classList.remove('active');
    giftModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (finalGiftBtn) {
    finalGiftBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openGiftModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGiftModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGiftModal();
    });
  }

  if (modalConfettiBtn) {
    modalConfettiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      launchConfettiBurst(width / 2, height * 0.4, 100);
    });
  }

  if (modalAcceptBtn) {
    modalAcceptBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGiftModal();
      launchConfettiBurst(width / 2, height * 0.5, 90);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && giftModal && giftModal.classList.contains('active')) {
      closeGiftModal();
    }
  });

  const cards = document.querySelectorAll('.roast-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!sfxEnabled || !audioCtx) return;
      try {
        const tick = audioCtx.createOscillator();
        const tickGain = audioCtx.createGain();
        tick.type = 'sine';
        tick.frequency.setValueAtTime(440, audioCtx.currentTime);
        tickGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
        tick.connect(tickGain);
        tickGain.connect(audioCtx.destination);
        tick.start(audioCtx.currentTime);
        tick.stop(audioCtx.currentTime + 0.09);
      } catch (err) {}
    });
  });

});
