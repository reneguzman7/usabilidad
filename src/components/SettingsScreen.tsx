import { motion } from 'motion/react';
import { Home, Type, Contrast, Palette, Check, Target } from 'lucide-react';
import { Button } from './ui/button';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useState, useEffect } from 'react';
import type { Screen } from '../App';

interface SettingsScreenProps {
  navigateTo: (screen: Screen) => void;
  settings: {
    fontSize: string;
    highContrast: boolean;
    backgroundColor: string;
    difficulty: string;
  };
  setSettings: (settings: any) => void;
}

export function SettingsScreen({ navigateTo, settings, setSettings }: SettingsScreenProps) {
  const { speak } = useTextToSpeech();
  const [focusedSection, setFocusedSection] = useState<'difficulty' | 'fontSize' | 'contrast' | 'background'>('difficulty');
  
  const fontSizes = [
    { value: 'normal', label: 'Normal', size: 'text-2xl' },
    { value: 'large', label: 'Grande', size: 'text-3xl' },
    { value: 'xlarge', label: 'Muy Grande', size: 'text-4xl' },
  ];

  const backgroundColors = [
    { value: 'default', label: 'Predeterminado', color: 'bg-gradient-to-br from-blue-200 to-purple-200' },
    { value: 'blue', label: 'Azul Claro', color: 'bg-blue-100' },
    { value: 'yellow', label: 'Amarillo Suave', color: 'bg-yellow-100' },
    { value: 'pink', label: 'Rosa Suave', color: 'bg-pink-100' },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys for navigation between sections
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const sections: Array<'difficulty' | 'fontSize' | 'contrast' | 'background'> = ['difficulty', 'fontSize', 'contrast', 'background'];
        const currentIndex = sections.indexOf(focusedSection);
        if (currentIndex < sections.length - 1) {
          setFocusedSection(sections[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const sections: Array<'difficulty' | 'fontSize' | 'contrast' | 'background'> = ['difficulty', 'fontSize', 'contrast', 'background'];
        const currentIndex = sections.indexOf(focusedSection);
        if (currentIndex > 0) {
          setFocusedSection(sections[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        
        // Change settings based on focused section
        if (focusedSection === 'difficulty') {
          const newDifficulty = settings.difficulty === 'easy' ? 'normal' : 'easy';
          setSettings({ ...settings, difficulty: newDifficulty });
          speak(`Dificultad: ${newDifficulty === 'easy' ? 'Fácil' : 'Normal'}`);
        } else if (focusedSection === 'fontSize') {
          const currentIndex = fontSizes.findIndex(f => f.value === settings.fontSize);
          let newIndex = e.key === 'ArrowRight' 
            ? (currentIndex + 1) % fontSizes.length 
            : (currentIndex - 1 + fontSizes.length) % fontSizes.length;
          const newSize = fontSizes[newIndex];
          setSettings({ ...settings, fontSize: newSize.value });
          speak(`Tamaño de texto: ${newSize.label}`);
        } else if (focusedSection === 'contrast') {
          const newContrast = !settings.highContrast;
          setSettings({ ...settings, highContrast: newContrast });
          speak(newContrast ? 'Alto Contraste activado' : 'Colores Normales');
        } else if (focusedSection === 'background') {
          const currentIndex = backgroundColors.findIndex(b => b.value === settings.backgroundColor);
          let newIndex = e.key === 'ArrowRight' 
            ? (currentIndex + 1) % backgroundColors.length 
            : (currentIndex - 1 + backgroundColors.length) % backgroundColors.length;
          const newBg = backgroundColors[newIndex];
          setSettings({ ...settings, backgroundColor: newBg.value });
          speak(`Color de fondo: ${newBg.label}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedSection, settings]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-200 via-blue-200 to-cyan-200 relative overflow-auto">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 bg-white/95 shadow-xl z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={() => {
              navigateTo('home');
              speak('Volver a inicio');
            }}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white w-16 h-16 rounded-2xl shadow-lg border-4 border-white"
          >
            <Home className="w-8 h-8" />
          </Button>

          <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            ⚙️ Ajustes
          </h1>

          <div className="w-24" />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Keyboard hint */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 px-6 py-3 rounded-2xl shadow-lg border-2 border-indigo-300 text-center mb-6"
          >
            <p className="text-base text-gray-700">
              💡 <strong>Tip:</strong> Usa las flechas ↑↓ para navegar entre opciones y ←→ para cambiar valores
            </p>
          </motion.div>

          {/* Row 1: Difficulty + Font Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Difficulty setting */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-white rounded-3xl p-6 shadow-2xl border-4 transition-all ${
                focusedSection === 'difficulty' ? 'border-green-600 ring-4 ring-green-300' : 'border-green-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-green-400 to-emerald-400 p-2 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl text-green-700">Dificultad</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Elige el nivel de dificultad que prefieras
              </p>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, difficulty: 'easy' });
                    speak('Dificultad: Fácil');
                  }}
                  className={`p-4 rounded-xl border-3 transition-all ${
                    settings.difficulty === 'easy'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400 border-green-600 text-white shadow-lg'
                      : 'bg-gray-100 border-gray-300 hover:border-green-300'
                  }`}
                >
                  <div className="text-3xl mb-2">😊</div>
                  <div className="text-lg mb-1">Fácil</div>
                  <div className="text-xs opacity-80">(Frases cortas)</div>
                  {settings.difficulty === 'easy' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                      <Check className="w-7 h-7 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, difficulty: 'normal' });
                    speak('Dificultad: Normal');
                  }}
                  className={`p-4 rounded-xl border-3 transition-all ${
                    settings.difficulty === 'normal'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400 border-green-600 text-white shadow-lg'
                      : 'bg-gray-100 border-gray-300 hover:border-green-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-lg mb-1">Normal</div>
                  <div className="text-xs opacity-80">(Frases largas)</div>
                  {settings.difficulty === 'normal' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                      <Check className="w-7 h-7 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Font size setting */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-white rounded-3xl p-6 shadow-2xl border-4 transition-all ${
                focusedSection === 'fontSize' ? 'border-purple-600 ring-4 ring-purple-300' : 'border-purple-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-2 rounded-xl">
                  <Type className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl text-purple-700">Tamaño del Texto</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Elige qué tan grande quieres ver las letras
              </p>

              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((size) => (
                  <motion.button
                    key={size.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSettings({ ...settings, fontSize: size.value });
                      speak(`Tamaño de texto: ${size.label}`);
                    }}
                    className={`p-4 rounded-xl border-3 transition-all ${
                      settings.fontSize === size.value
                        ? 'bg-gradient-to-br from-purple-400 to-pink-400 border-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className={`${size.size} mb-2`}>Aa</div>
                    <div className="text-sm">{size.label}</div>
                    {settings.fontSize === size.value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                        <Check className="w-6 h-6 mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 2: High Contrast + Background Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* High contrast setting */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-white rounded-3xl p-6 shadow-2xl border-4 transition-all ${
                focusedSection === 'contrast' ? 'border-blue-600 ring-4 ring-blue-300' : 'border-blue-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-2 rounded-xl">
                  <Contrast className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl text-blue-700">Alto Contraste</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Hace que los colores sean más fáciles de ver
              </p>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, highContrast: false });
                    speak('Colores Normales');
                  }}
                  className={`p-4 rounded-xl border-3 transition-all ${
                    !settings.highContrast
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🌈</div>
                  <div className="text-base">Colores Normales</div>
                  {!settings.highContrast && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                      <Check className="w-7 h-7 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, highContrast: true });
                    speak('Alto Contraste activado');
                  }}
                  className={`p-4 rounded-xl border-3 transition-all ${
                    settings.highContrast
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-600 text-white shadow-lg contrast-125'
                      : 'bg-gray-100 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">⚫⚪</div>
                  <div className="text-base">Alto Contraste</div>
                  {settings.highContrast && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                      <Check className="w-7 h-7 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Background color setting */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-white rounded-3xl p-6 shadow-2xl border-4 transition-all ${
                focusedSection === 'background' ? 'border-pink-600 ring-4 ring-pink-300' : 'border-pink-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-2 rounded-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl text-pink-700">Color de Fondo</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Elige el color que más te guste para jugar
              </p>

              <div className="grid grid-cols-2 gap-3">
                {backgroundColors.map((bg) => (
                  <motion.button
                    key={bg.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSettings({ ...settings, backgroundColor: bg.value });
                      speak(`Color de fondo: ${bg.label}`);
                    }}
                    className={`p-4 rounded-xl border-3 transition-all ${
                      settings.backgroundColor === bg.value
                        ? 'border-pink-600 shadow-lg ring-4 ring-pink-300'
                        : 'border-gray-300 hover:border-pink-300'
                    }`}
                  >
                    <div className={`w-full h-16 ${bg.color} rounded-lg mb-2 shadow-inner`}></div>
                    <div className="text-sm mb-1">{bg.label}</div>
                    {settings.backgroundColor === bg.value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-6 h-6 mx-auto text-pink-600" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 3: Preview (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-8 shadow-2xl border-4 border-white mb-6"
          >
            <h2 className="text-3xl text-white text-center mb-6">Vista Previa</h2>
            <div
              className={`bg-white rounded-2xl p-8 ${settings.highContrast ? 'contrast-125' : ''}`}
              style={{
                backgroundColor: settings.backgroundColor === 'blue' ? '#E3F2FD' : 
                                settings.backgroundColor === 'yellow' ? '#FFF9C4' : 
                                settings.backgroundColor === 'pink' ? '#FCE4EC' : 'white'
              }}
            >
              <p
                className={`text-gray-800 mb-4 ${
                  settings.fontSize === 'large' ? 'text-xl' : settings.fontSize === 'xlarge' ? 'text-2xl' : 'text-base'
                }`}
              >
                Así se verá el texto en el juego. ¡Prueba diferentes opciones!
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="bg-blue-400 text-white px-6 py-3 rounded-xl">Palabra</div>
                <div className="bg-green-400 text-white px-6 py-3 rounded-xl">Ejemplo</div>
                <div className="bg-purple-400 text-white px-6 py-3 rounded-xl">Texto</div>
              </div>
            </div>
          </motion.div>

          {/* Informational message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-2xl p-6 text-center shadow-xl mb-6"
          >
            <p className="text-xl">
              ✨ Todos los cambios se aplican inmediatamente ✨
            </p>
            <p className="text-base mt-2">
              Puedes volver aquí en cualquier momento para cambiarlos
            </p>
          </motion.div>

          {/* Action button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center pb-8"
          >
            <Button
              onClick={() => {
                navigateTo('home');
                speak('¡Listo! Configuración guardada');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-16 py-8 text-3xl rounded-3xl shadow-xl border-4 border-white"
            >
              <Check className="w-12 h-12 mr-4" />
              ¡Listo!
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}