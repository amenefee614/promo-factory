import { useEffect } from 'react';
import { audioManager, type SoundType } from '@/lib/audio-manager';

export function useAudio() {
  useEffect(() => {
    // Initialize audio manager on mount
    audioManager.initialize();

    return () => {
      // Cleanup is handled globally, not per component
    };
  }, []);

  const playSound = (type: SoundType) => {
    audioManager.play(type);
  };

  return {
    playSound,
    setEnabled: (enabled: boolean) => audioManager.setEnabled(enabled),
    setVolume: (volume: number) => audioManager.setVolume(volume),
    getSettings: () => audioManager.getSettings(),
  };
}
