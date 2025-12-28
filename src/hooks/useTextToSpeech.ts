import { useCallback } from 'react';

export function useTextToSpeech() {
  const speak = useCallback((text: string) => {
    // Cancelar cualquier habla en progreso
    window.speechSynthesis.cancel();

    // Crear nueva instancia de habla
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar idioma español
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Velocidad ligeramente más lenta para niños
    utterance.pitch = 1.1; // Tono ligeramente más alto para hacerlo más amigable
    utterance.volume = 1.0;

    // Intentar usar una voz en español si está disponible
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') || voice.lang.startsWith('ES')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // Reproducir
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
