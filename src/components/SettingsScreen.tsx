import { motion } from 'motion/react';
import { Home, Type, Contrast, Palette, Check, Target, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
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

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-200 via-blue-200 to-cyan-200 relative overflow-auto">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 bg-white/95 shadow-xl z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
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
      <div className="px-16 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Difficulty setting - NEW */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-green-400"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-400 p-4 rounded-2xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl text-green-700">Dificultad</h2>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              Elige el nivel de dificultad que prefieras
            </p>

            <div className="grid grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSettings({ ...settings, difficulty: 'easy' });
                  speak('Dificultad: Fácil');
                }}
                className={`p-8 rounded-2xl border-4 transition-all ${
                  settings.difficulty === 'easy'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-400 border-green-600 text-white shadow-xl'
                    : 'bg-gray-100 border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-5xl mb-4">😊</div>
                <div className="text-2xl mb-2">Fácil</div>
                <div className="text-lg opacity-80">(Frases cortas)</div>
                {settings.difficulty === 'easy' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <Check className="w-8 h-8 mx-auto" />
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
                className={`p-8 rounded-2xl border-4 transition-all ${
                  settings.difficulty === 'normal'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-400 border-green-600 text-white shadow-xl'
                    : 'bg-gray-100 border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-2xl mb-2">Normal</div>
                <div className="text-lg opacity-80">(Frases largas)</div>
                {settings.difficulty === 'normal' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <Check className="w-8 h-8 mx-auto" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Font size setting */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-400"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-2xl">
                <Type className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl text-purple-700">Tamaño del Texto</h2>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              Elige qué tan grande quieres ver las letras
            </p>

            <div className="grid grid-cols-3 gap-6">
              {fontSizes.map((size) => (
                <motion.button
                  key={size.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, fontSize: size.value });
                    speak(`Tamaño de texto: ${size.label}`);
                  }}
                  className={`p-8 rounded-2xl border-4 transition-all ${
                    settings.fontSize === size.value
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400 border-purple-600 text-white shadow-xl'
                      : 'bg-gray-100 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className={`${size.size} mb-4`}>Aa</div>
                  <div className="text-xl">{size.label}</div>
                  {settings.fontSize === size.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4"
                    >
                      <Check className="w-8 h-8 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* High contrast setting */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-blue-400"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-2xl">
                <Contrast className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl text-blue-700">Alto Contraste</h2>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              Hace que los colores sean más fáciles de ver
            </p>

            <div className="grid grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSettings({ ...settings, highContrast: false });
                  speak('Colores Normales');
                }}
                className={`p-8 rounded-2xl border-4 transition-all ${
                  !settings.highContrast
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-600 text-white shadow-xl'
                    : 'bg-gray-100 border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-3">🌈</div>
                <div className="text-2xl">Colores Normales</div>
                {!settings.highContrast && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <Check className="w-8 h-8 mx-auto" />
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
                className={`p-8 rounded-2xl border-4 transition-all ${
                  settings.highContrast
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-600 text-white shadow-xl contrast-125'
                    : 'bg-gray-100 border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-3">⚫⚪</div>
                <div className="text-2xl">Alto Contraste</div>
                {settings.highContrast && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <Check className="w-8 h-8 mx-auto" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Background color setting */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-pink-400"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-4 rounded-2xl">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl text-pink-700">Color de Fondo</h2>
            </div>

            <p className="text-xl text-gray-600 mb-8">
              Elige el color que más te guste para jugar
            </p>

            <div className="grid grid-cols-4 gap-6">
              {backgroundColors.map((bg) => (
                <motion.button
                  key={bg.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSettings({ ...settings, backgroundColor: bg.value });
                    speak(`Color de fondo: ${bg.label}`);
                  }}
                  className={`p-8 rounded-2xl border-4 transition-all ${
                    settings.backgroundColor === bg.value
                      ? 'border-pink-600 shadow-xl ring-4 ring-pink-300'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <div className={`w-full h-24 ${bg.color} rounded-xl mb-4 shadow-inner`}></div>
                  <div className="text-xl mb-2">{bg.label}</div>
                  {settings.backgroundColor === bg.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-8 h-8 mx-auto text-pink-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Preview section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-10 shadow-2xl border-4 border-white"
          >
            <h2 className="text-4xl text-white text-center mb-6">Vista Previa</h2>
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
                  settings.fontSize === 'large' ? 'text-xl' : settings.fontSize === 'xlarge' ? 'text-2xl' : ''
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

          {/* Para Padres section - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-orange-400"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 p-4 rounded-2xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl text-orange-700">Para Padres y Educadores</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-2xl mb-3 text-orange-600">📚 Objetivos Pedagógicos:</h3>
                <ul className="list-disc list-inside space-y-2 text-xl ml-4">
                  <li>Desarrollar habilidades de lectura y comprensión de textos</li>
                  <li>Fortalecer la construcción sintáctica de oraciones en español</li>
                  <li>Mejorar la memoria visual y secuencial</li>
                  <li>Fomentar la autonomía en el aprendizaje del lenguaje</li>
                  <li>Reforzar el vocabulario mediante contextos temáticos variados</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl mb-3 text-orange-600">♿ Características de Accesibilidad:</h3>
                <ul className="list-disc list-inside space-y-2 text-xl ml-4">
                  <li>Interfaz 100% visual adaptada para niños sordos o con discapacidad auditiva</li>
                  <li>Ajustes personalizables de tamaño de texto y contraste</li>
                  <li>Retroalimentación visual clara e inmediata</li>
                  <li>Sistema de recompensas motivacional</li>
                  <li>Navegación intuitiva y amigable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl mb-3 text-orange-600">🎯 Recomendaciones de Uso:</h3>
                <ul className="list-disc list-inside space-y-2 text-xl ml-4">
                  <li>Sesiones de 10-15 minutos para mantener la atención</li>
                  <li>Comenzar con la dificultad "Fácil" e ir incrementando gradualmente</li>
                  <li>Celebrar los logros y fomentar la perseverancia ante errores</li>
                  <li>Usar como complemento a otras actividades educativas</li>
                  <li>Permitir que el niño explore y personalice la aplicación</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300 mt-6">
                <p className="text-xl text-blue-800">
                  💡 <strong>Nota:</strong> Este juego educativo está diseñado específicamente para apoyar 
                  el desarrollo del lenguaje en niños sordos o con discapacidad auditiva, 
                  utilizando estrategias visuales y refuerzo positivo constante.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Informational message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-2xl p-8 text-center shadow-xl"
          >
            <p className="text-2xl">
              ✨ Todos los cambios se aplican inmediatamente ✨
            </p>
            <p className="text-xl mt-3">
              Puedes volver aquí en cualquier momento para cambiarlos
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-6 pb-8"
          >
            <Button
              onClick={() => {
                navigateTo('home');
                speak('¡Listo! Configuración guardada');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-16 py-8 text-3xl rounded-3xl shadow-xl border-4 border-white"
            >
              <Check className="w-10 h-10 mr-4" />
              ¡Listo!
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}