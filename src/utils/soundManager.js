let soundEnabled = true;

export function setSoundEnabled(val) {
  soundEnabled = !!val;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone(freq, type, duration, vol) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
}

export function playClickSound() {
  playTone(600, 'sine', 0.1, 0.1);
}

export function playSuccessSound() {
  if (!soundEnabled) return;
  playTone(800, 'sine', 0.1, 0.1);
  setTimeout(() => playTone(1200, 'sine', 0.2, 0.1), 100);
}

export function playErrorSound() {
  if (!soundEnabled) return;
  playTone(300, 'sawtooth', 0.2, 0.2);
  setTimeout(() => playTone(200, 'sawtooth', 0.3, 0.2), 200);
}

export function playNotificationSound() {
  if (!soundEnabled) return;
  playTone(880, 'sine', 0.2, 0.1);
}
