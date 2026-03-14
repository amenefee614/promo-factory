import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type SoundType = 'button' | 'success' | 'error' | 'swipe' | 'select';

interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-1
}

const SOUND_FILES: Record<SoundType, any> = {
  button: require('@/assets/sounds/button-press.mp3'),
  success: require('@/assets/sounds/success.mp3'),
  error: require('@/assets/sounds/error.mp3'),
  swipe: require('@/assets/sounds/swipe.mp3'),
  select: require('@/assets/sounds/button-press.mp3'), // Reuse button sound
};

class AudioManager {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private settings: AudioSettings = {
    enabled: true,
    volume: 0.5,
  };
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Load settings from storage
      const stored = await AsyncStorage.getItem('audio_settings');
      if (stored) {
        this.settings = JSON.parse(stored);
      }

      // Set audio mode for iOS
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Preload all sounds
      await Promise.all(
        Object.entries(SOUND_FILES).map(async ([type, source]) => {
          try {
            const { sound } = await Audio.Sound.createAsync(source, {
              volume: this.settings.volume,
            });
            this.sounds.set(type as SoundType, sound);
          } catch (error) {
            console.warn(`Failed to load sound: ${type}`, error);
          }
        })
      );

      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio manager', error);
    }
  }

  async play(type: SoundType) {
    if (!this.settings.enabled || Platform.OS === 'web') return;
    if (!this.initialized) await this.initialize();

    try {
      const sound = this.sounds.get(type);
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${type}`, error);
    }
  }

  async setEnabled(enabled: boolean) {
    this.settings.enabled = enabled;
    await this.saveSettings();
  }

  async setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all loaded sounds
    for (const sound of this.sounds.values()) {
      try {
        await sound.setVolumeAsync(this.settings.volume);
      } catch (error) {
        console.warn('Failed to set volume', error);
      }
    }
    
    await this.saveSettings();
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private async saveSettings() {
    try {
      await AsyncStorage.setItem('audio_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save audio settings', error);
    }
  }

  async cleanup() {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.warn('Failed to unload sound', error);
      }
    }
    this.sounds.clear();
    this.initialized = false;
  }
}

export const audioManager = new AudioManager();
