// =============================================================================
// BUILTIT AI - Voice Service Interface + Mock
// =============================================================================

import { VoiceLanguage } from '@/types';
import { logger } from '@/lib/logger';

export interface IVoiceService {
  speak(text: string, language?: VoiceLanguage): Promise<void>;
  stopSpeaking(): void;
  isSpeaking(): boolean;
  transcribe(audioBlob: Blob): Promise<string>;
}

export class MockVoiceService implements IVoiceService {
  private _isSpeaking = false;
  private log = logger.child('VoiceService');

  async speak(text: string, language: VoiceLanguage = 'en-US'): Promise<void> {
    this.log.debug('MockVoice: speak', { textLength: text.length, language });
    this._isSpeaking = true;

    // In browser, use Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.onend = () => {
          this._isSpeaking = false;
          resolve();
        };
        utterance.onerror = () => {
          this._isSpeaking = false;
          resolve();
        };
        window.speechSynthesis.speak(utterance);
      });
    }

    // Server-side or unsupported: simulate delay
    await new Promise((r) => setTimeout(r, Math.min(text.length * 50, 3000)));
    this._isSpeaking = false;
  }

  stopSpeaking(): void {
    this._isSpeaking = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    return this._isSpeaking;
  }

  async transcribe(audioBlob: Blob): Promise<string> {
    this.log.debug('MockVoice: transcribe', { size: audioBlob.size });
    await new Promise((r) => setTimeout(r, 1000));
    return 'Mock transcription: What is the next step in the construction sequence?';
  }
}

let _voiceInstance: IVoiceService | null = null;
export function getVoiceService(): IVoiceService {
  if (_voiceInstance) return _voiceInstance;
  _voiceInstance = new MockVoiceService();
  return _voiceInstance;
}
