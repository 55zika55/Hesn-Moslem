// Audio Alert Engine for Prayer Times and Takbeers
import { AdhanSoundType } from '../types';
import { getCustomAdhanAudioUrl } from './customAudioStorage';

let audioCtx: AudioContext | null = null;
let activeAudio: HTMLAudioElement | null = null;
let isPlayingAdhan = false;
let wakeLockSentinel: unknown = null;
const stateListeners = new Set<(playing: boolean) => void>();

function notifyAdhanState(playing: boolean) {
  isPlayingAdhan = playing;
  stateListeners.forEach((cb) => {
    try {
      cb(playing);
    } catch (e) {
      console.warn('Listener error in audio state:', e);
    }
  });
}

export function isAdhanPlaying(): boolean {
  return isPlayingAdhan;
}

export function subscribeAdhanState(callback: (playing: boolean) => void): () => void {
  stateListeners.add(callback);
  callback(isPlayingAdhan);
  return () => {
    stateListeners.delete(callback);
  };
}

async function requestWakeLock() {
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
    } catch {
      // ignore
    }
  }
}

function releaseWakeLock() {
  if (wakeLockSentinel) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wakeLockSentinel as any).release();
    } catch {
      // ignore
    }
    wakeLockSentinel = null;
  }
}

export function stopAdhanAudio(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    activeAudio = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  releaseWakeLock();
  notifyAdhanState(false);
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// User-gesture unlocker for Web Audio API & mobile autoplay
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Play a 0-volume 1-sample buffer to unlock Safari/Chrome
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // ignore
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

// Play a resonant harmonic chord/chime note with envelope
function playHarmonicTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  masterGain: GainNode
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

// Synthesizes the melodic contour of "Allahu Akbar, Allahu Akbar" (twice) via Web Audio API
export function playSynthesizedTakbeerChime(volume: number = 0.8): Promise<void> {
  return new Promise((resolve) => {
    try {
      notifyAdhanState(true);
      requestWakeLock();
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
      masterGain.connect(ctx.destination);

      const now = ctx.currentTime;

      const playPhrase = (offset: number) => {
        playHarmonicTone(ctx, 392.0, now + offset, 0.45, masterGain); // G4
        playHarmonicTone(ctx, 523.25, now + offset + 0.35, 0.7, masterGain); // C5
        playHarmonicTone(ctx, 493.88, now + offset + 0.9, 0.45, masterGain); // B4
        playHarmonicTone(ctx, 440.0, now + offset + 1.25, 0.5, masterGain); // A4
        playHarmonicTone(ctx, 392.0, now + offset + 1.65, 0.9, masterGain); // G4

        playHarmonicTone(ctx, 392.0, now + offset + 2.5, 0.45, masterGain); // G4
        playHarmonicTone(ctx, 523.25, now + offset + 2.85, 0.65, masterGain); // C5
        playHarmonicTone(ctx, 587.33, now + offset + 3.4, 0.55, masterGain); // D5
        playHarmonicTone(ctx, 523.25, now + offset + 3.85, 1.2, masterGain); // C5
      };

      playPhrase(0.05);
      playPhrase(4.8);

      tryArabicSpeechVoice();

      setTimeout(() => {
        releaseWakeLock();
        notifyAdhanState(false);
        resolve();
      }, 9800);
    } catch (e) {
      console.warn('Audio playback not permitted or supported:', e);
      releaseWakeLock();
      notifyAdhanState(false);
      resolve();
    }
  });
}

function tryArabicSpeechVoice() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('اللهُ أكبر، اللهُ أكبر. ... اللهُ أكبر، اللهُ أكبر.');
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignored if blocked
    }
  }
}

/**
 * Main function to play prayer adhan audio:
 * - takbeer_file: Real voice recording of "الله أكبر الله أكبر" (16 seconds)
 * - takbeer_double: Double Takbeer recording (30 seconds)
 * - full_adhan: Complete Call to Prayer (2m 34s)
 * - custom_file: User-uploaded custom audio file from device storage
 * - synth: Web Audio API chime
 */
export async function playAdhanAudio(
  volume: number = 0.8,
  soundType: AdhanSoundType = 'takbeer_file'
): Promise<void> {
  // If already playing, stop current sound
  stopAdhanAudio();

  if (soundType === 'synth') {
    return playSynthesizedTakbeerChime(volume);
  }

  let audioUrl = '/audio/adhan_takbeer.mp3';

  if (soundType === 'custom_file') {
    const custom = await getCustomAdhanAudioUrl();
    if (custom) {
      audioUrl = custom;
    } else {
      audioUrl = '/audio/adhan_takbeer.mp3';
    }
  } else if (soundType === 'takbeer_double') {
    audioUrl = '/audio/adhan_takbeer_double.mp3';
  } else if (soundType === 'full_adhan') {
    audioUrl = '/audio/adhan_full.mp3';
  } else {
    audioUrl = '/audio/adhan_takbeer.mp3';
  }

  return new Promise((resolve) => {
    try {
      requestWakeLock();
      const audio = new Audio(audioUrl);
      activeAudio = audio;
      audio.volume = Math.max(0, Math.min(1, volume));

      audio.onplay = () => {
        notifyAdhanState(true);
      };

      audio.onended = () => {
        activeAudio = null;
        releaseWakeLock();
        notifyAdhanState(false);
        resolve();
      };

      audio.onerror = (e) => {
        console.warn('Audio element playback error, falling back to synthesizer:', e);
        activeAudio = null;
        releaseWakeLock();
        notifyAdhanState(false);
        playSynthesizedTakbeerChime(volume).then(resolve);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play was prevented by browser policy:', err);
          activeAudio = null;
          releaseWakeLock();
          notifyAdhanState(false);
          // Fallback to synthesized takbeer which is authorized via Web Audio
          playSynthesizedTakbeerChime(volume).then(resolve);
        });
      }
    } catch (e) {
      console.warn('Failed to initialize Audio element:', e);
      releaseWakeLock();
      notifyAdhanState(false);
      playSynthesizedTakbeerChime(volume).then(resolve);
    }
  });
}

// Alias for backwards compatibility
export function playTakbeerChime(
  volume: number = 0.8,
  soundType: AdhanSoundType = 'takbeer_file'
): Promise<void> {
  return playAdhanAudio(volume, soundType);
}

// Gentle tap sound for Azkar counting
export function playClickSound(volume: number = 0.3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore
  }
}

// Soft completion chime when target count is reached
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - C
    notes.forEach((freq, idx) => {
      playHarmonicTone(ctx, freq, now + idx * 0.12, 0.4, gain);
    });
  } catch {
    // Ignore
  }
}

// Send browser notification
export async function sendPrayerNotification(title: string, body: string) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      dir: 'rtl',
      lang: 'ar'
    });
  } else if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/icon.svg',
        dir: 'rtl',
        lang: 'ar'
      });
    }
  }
}
