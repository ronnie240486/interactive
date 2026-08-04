export function createAudioNormalizer(videoElement) {
  if (!videoElement) return null;
  
  try {
    // Note: AudioContext needs user interaction to start in some browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(videoElement);
    const gainNode = audioCtx.createGain();
    
    // Default gain
    gainNode.gain.value = 1.0;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    return {
      audioCtx,
      source,
      gainNode
    };
  } catch (e) {
    console.error('Failed to create audio normalizer:', e);
    return null;
  }
}

export function setNormalizerGain(normalizer, gainValue) {
  if (normalizer && normalizer.gainNode) {
    // clamp between 0.0 and 2.0
    const clamped = Math.max(0.0, Math.min(2.0, gainValue));
    normalizer.gainNode.gain.value = clamped;
  }
}

export function destroyNormalizer(normalizer) {
  if (!normalizer) return;
  
  try {
    normalizer.source.disconnect();
    normalizer.gainNode.disconnect();
    if (normalizer.audioCtx.state !== 'closed') {
      normalizer.audioCtx.close();
    }
  } catch (e) {
    console.error('Error destroying normalizer:', e);
  }
}
