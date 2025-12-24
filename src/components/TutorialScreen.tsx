import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ChevronLeft, ChevronRight, ArrowDown, MousePointer, Check } from 'lucide-react';
import { Mascot } from './Mascot';
import { Button } from './ui/button';
import type { Screen } from '../App';

interface TutorialScreenProps {
  navigateTo: (screen: Screen) => void;
}

interface TutorialStep {
  title: string;
  description: string;
  visual: string;
  mascotMessage: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '¡Bienvenido al juego!',
    description: 'Voy a enseñarte cómo jugar. Es muy fácil y divertido.',
    visual: '👋',
    mascotMessage: '¡Hola! Soy tu amigo y te voy a ayudar',
  },
  {
    title: 'Mira las palabras',
    description: 'En cada nivel verás palabras desordenadas en la parte de abajo.',
    visual: '📝',
    mascotMessage: 'Las palabras están mezcladas, ¡vamos a ordenarlas!',
  },
  {
    title: 'Toca las palabras',
    description: 'Toca cada palabra en el orden correcto para formar una frase.',
    visual: '👆',
    mascotMessage: '¡Toca con tu dedo o haz clic!',
  },
  {
    title: 'Construye la frase',
    description: 'Las palabras que toques aparecerán arriba. Si te equivocas, tócalas de nuevo para quitarlas.',
    visual: '🧩',
    mascotMessage: '¡Como un rompecabezas!',
  },
  {
    title: 'Verifica tu respuesta',
    description: 'Cuando termines, presiona el botón "Verificar" para ver si está correcto.',
    visual: '✅',
    mascotMessage: 'Yo te diré si lo hiciste bien',
  },
  {
    title: '¡Gana premios!',
    description: 'Por cada frase correcta ganas puntos, estrellas y calcomanías.',
    visual: '🏆',
    mascotMessage: '¡Cuanto más juegues, más premios tendrás!',
  },
  {
    title: '¡Listo para empezar!',
    description: 'Ya sabes todo lo necesario. ¡Vamos a jugar!',
    visual: '🎉',
    mascotMessage: '¡Eres genial! ¡A jugar!',
  },
];

export function TutorialScreen({ navigateTo }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentStep === tutorialSteps.length - 1) {
          handleFinish();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    navigateTo('game');
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200 relative overflow-hidden">
      {/* Animated background elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: 80 + i * 20,
            height: 80 + i * 20,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
          }}
        />
      ))}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 shadow-xl z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Button
            onClick={() => navigateTo('home')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-6 rounded-2xl shadow-lg"
          >
            <Home className="w-8 h-8" />
          </Button>

          <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            📚 Cómo Jugar
          </h1>

          <div className="w-24" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-16 pt-32">
        {/* Progress indicator */}
        <div className="flex gap-3">
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-600 w-12'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Tutorial card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-blue-400 max-w-4xl w-full"
          >
            {/* Step number */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg">
                {currentStep + 1}
              </div>
              <h2 className="text-4xl text-blue-700">{step.title}</h2>
            </div>

            {/* Visual emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
              className="text-9xl text-center my-8"
            >
              {step.visual}
            </motion.div>

            {/* Description */}
            <p className="text-3xl text-gray-700 text-center mb-8 leading-relaxed">
              {step.description}
            </p>

            {/* Interactive examples based on step */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-4 mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-8 py-4 rounded-2xl shadow-lg cursor-pointer"
                >
                  Palabra
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <MousePointer className="w-12 h-12 text-blue-600" />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="bg-blue-100 border-4 border-blue-400 rounded-2xl p-6 min-h-20">
                  <div className="flex gap-3 flex-wrap">
                    <div className="bg-blue-400 text-white px-6 py-3 rounded-xl">Me</div>
                    <div className="bg-blue-400 text-white px-6 py-3 rounded-xl">gusta</div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <ArrowDown className="w-10 h-10 text-blue-600" />
                </motion.div>
                <div className="flex gap-3 justify-center">
                  <div className="bg-green-400 text-white px-6 py-3 rounded-xl">jugar</div>
                  <div className="bg-green-400 text-white px-6 py-3 rounded-xl">el</div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 text-2xl rounded-2xl shadow-xl">
                  <Check className="w-8 h-8 mr-3" />
                  Verificar
                </Button>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-6"
              >
                {['⭐', '🏆', '🎨', '👑'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="text-6xl"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mascot */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Mascot mood="happy" size="medium" message={step.mascotMessage} />
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex gap-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-gray-400 hover:bg-gray-500 text-white px-10 py-6 text-2xl rounded-2xl shadow-xl disabled:opacity-30"
          >
            <ChevronLeft className="w-8 h-8 mr-3" />
            Anterior
          </Button>

          {currentStep < tutorialSteps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-6 text-2xl rounded-2xl shadow-xl"
            >
              Siguiente
              <ChevronRight className="w-8 h-8 ml-3" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-6 text-3xl rounded-2xl shadow-xl"
            >
              ¡Empezar a Jugar!
              <Check className="w-10 h-10 ml-4" />
            </Button>
          )}
        </div>

        {/* Skip button */}
        <Button
          onClick={() => navigateTo('home')}
          className="text-gray-600 hover:text-gray-800 underline bg-transparent hover:bg-transparent shadow-none"
        >
          Saltar tutorial
        </Button>
      </div>
    </div>
  );
}