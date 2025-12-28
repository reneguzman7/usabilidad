import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, RotateCcw, Check, ChevronRight, Star, Sparkles, HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import type { Screen, GameState } from '../App';

interface GameScreenProps {
  navigateTo: (screen: Screen) => void;
  gameState: GameState;
  updateGameState: (state: Partial<GameState>) => void;
}

interface Sentence {
  id: number;
  correct: string;
  words: string[];
  theme: string;
  themeEmoji: string;
}

const sentences: Sentence[] = [
  { id: 1, correct: 'Me gusta ir a la escuela', words: ['Me', 'gusta', 'ir', 'a', 'la', 'escuela'], theme: 'Escuela', themeEmoji: '🏫' },
  { id: 2, correct: 'El león vive en la selva', words: ['El', 'león', 'vive', 'en', 'la', 'selva'], theme: 'Zoo', themeEmoji: '🦁' },
  { id: 3, correct: 'Vamos a la playa en verano', words: ['Vamos', 'a', 'la', 'playa', 'en', 'verano'], theme: 'Vacaciones', themeEmoji: '🏖️' },
  { id: 4, correct: 'Mi color favorito es azul', words: ['Mi', 'color', 'favorito', 'es', 'azul'], theme: 'Colores', themeEmoji: '🎨' },
  { id: 5, correct: 'Me encanta jugar con amigos', words: ['Me', 'encanta', 'jugar', 'con', 'amigos'], theme: 'Amistad', themeEmoji: '👫' },
];

export function GameScreen({ navigateTo, gameState, updateGameState }: GameScreenProps) {
  const currentSentence = sentences[(gameState.currentLevel - 1) % sentences.length];
  const { speak } = useTextToSpeech();
  
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [focusArea, setFocusArea] = useState<'available' | 'selected'>('available'); // para navegación con teclado

  useEffect(() => {
    // Shuffle words on mount or level change
    const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setFeedback(null);
    setMascotMessage('¡Ordena las palabras!');
    setFocusedIndex(0);
    setFocusArea('available');
    
    // Announce level and theme
    speak(`Nivel ${gameState.currentLevel}. Tema: ${currentSentence.theme}. ¡Ordena las palabras!`);
  }, [gameState.currentLevel]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cerrar modales con Esc
      if (e.key === 'Escape') {
        if (showFeedbackModal) {
          setShowFeedbackModal(false);
          e.preventDefault();
          return;
        }
        if (showResetConfirm) {
          setShowResetConfirm(false);
          e.preventDefault();
          return;
        }
      }

      // Si hay un modal abierto, no procesar otros atajos
      if (showFeedbackModal || showResetConfirm) return;

      // Atajos Ctrl+
      if (e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            handleHint();
            break;
          case 'r':
            e.preventDefault();
            handleReset();
            break;
          case 'v':
            e.preventDefault();
            if (!isVerifyDisabled) {
              handleVerify();
            }
            break;
        }
        return;
      }

      // Navegación con flechas
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (e.key === 'ArrowUp') {
          setFocusArea('selected');
          setFocusedIndex(Math.min(focusedIndex, selectedWords.length - 1));
        } else if (e.key === 'ArrowDown') {
          setFocusArea('available');
          setFocusedIndex(Math.min(focusedIndex, shuffledWords.length - 1));
        } else if (e.key === 'ArrowLeft') {
          if (focusArea === 'available') {
            setFocusedIndex(Math.max(0, focusedIndex - 1));
          } else {
            setFocusedIndex(Math.max(0, focusedIndex - 1));
          }
        } else if (e.key === 'ArrowRight') {
          if (focusArea === 'available') {
            setFocusedIndex(Math.min(shuffledWords.length - 1, focusedIndex + 1));
          } else {
            setFocusedIndex(Math.min(selectedWords.length - 1, focusedIndex + 1));
          }
        }
        return;
      }

      // Enter o Espacio para seleccionar
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (focusArea === 'available' && shuffledWords.length > 0 && focusedIndex < shuffledWords.length) {
          handleWordClick(shuffledWords[focusedIndex], focusedIndex);
          // Ajustar índice si es necesario
          setTimeout(() => {
            if (focusedIndex >= shuffledWords.length - 1) {
              setFocusedIndex(Math.max(0, shuffledWords.length - 2));
            }
          }, 0);
        } else if (focusArea === 'selected' && selectedWords.length > 0 && focusedIndex < selectedWords.length) {
          handleRemoveWord(focusedIndex);
          // Ajustar índice si es necesario
          setTimeout(() => {
            if (focusedIndex >= selectedWords.length - 1) {
              setFocusedIndex(Math.max(0, selectedWords.length - 2));
            }
          }, 0);
        }
        return;
      }

      // Delete o Backspace para quitar palabra seleccionada
      if ((e.key === 'Delete' || e.key === 'Backspace') && focusArea === 'selected') {
        e.preventDefault();
        if (selectedWords.length > 0 && focusedIndex < selectedWords.length) {
          handleRemoveWord(focusedIndex);
          setTimeout(() => {
            if (focusedIndex >= selectedWords.length - 1) {
              setFocusedIndex(Math.max(0, selectedWords.length - 2));
            }
          }, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shuffledWords, selectedWords, focusedIndex, focusArea, showFeedbackModal, showResetConfirm]);

  const handleWordClick = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));
    setFeedback(null);
    speak(word);
  };

  const handleRemoveWord = (index: number) => {
    const word = selectedWords[index];
    setShuffledWords([...shuffledWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    speak(`Quitaste: ${word}`);
  };

  const handleVerify = () => {
    const userSentence = selectedWords.join(' ');
    if (userSentence === currentSentence.correct) {
      setFeedback('correct');
      setMascotMessage('¡Excelente! ¡Lo hiciste perfecto!');
      setShowCelebration(true);
      setShowFeedbackModal(true);
      
      // Update game state
      const newPoints = gameState.points + 100;
      const newStars = Math.floor(newPoints / 300);
      const newTrophies = Math.floor(newPoints / 1000);
      
      updateGameState({
        points: newPoints,
        stars: newStars,
        trophies: newTrophies,
      });

      speak('¡Excelente! ¡Lo hiciste perfecto! Ganaste 100 puntos');
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback('incorrect');
      setMascotMessage('¡Casi! Inténtalo de nuevo 💪');
      setShowFeedbackModal(true);
      speak('¡Casi! Inténtalo de nuevo');
    }
  };

  const handleReset = () => {
    if (selectedWords.length > 0) {
      setShowResetConfirm(true);
    } else {
      performReset();
    }
  };

  const performReset = () => {
    const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setFeedback(null);
    setMascotMessage('¡Vamos otra vez!');
    setShowResetConfirm(false);
    speak('¡Vamos otra vez!');
  };

  const handleNext = () => {
    updateGameState({ currentLevel: gameState.currentLevel + 1 });
    setShowFeedbackModal(false);
  };

  const handleHint = () => {
    if (currentSentence.words.length > 0 && selectedWords.length < currentSentence.words.length) {
      const nextWord = currentSentence.words[selectedWords.length];
      const wordIndex = shuffledWords.indexOf(nextWord);
      
      if (wordIndex !== -1) {
        setSelectedWords([...selectedWords, nextWord]);
        setShuffledWords(shuffledWords.filter((_, i) => i !== wordIndex));
        setFeedback(null);
        setMascotMessage('¡Ahí está! 💡');
        speak(`Pista: ${nextWord}`);
      }
    }
  };

  const progress = (gameState.currentLevel / sentences.length) * 100;
  const pointsToNextStar = 300 - (gameState.points % 300);
  const isVerifyDisabled = selectedWords.length !== currentSentence.words.length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 relative overflow-hidden">
      {/* Header with stats */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 shadow-xl z-20 px-8 py-6">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Home button */}
          <Button
            onClick={() => navigateTo('home')}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-6 rounded-2xl shadow-lg border-4 border-white"
          >
            <Home className="w-8 h-8" />
          </Button>

          {/* Progress and stats */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">Nivel {gameState.currentLevel}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${i < gameState.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-80 bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-3xl">🎯 {gameState.points} pts</div>
              <div className="text-sm">¡{pointsToNextStar} pts para tu próxima estrella!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="pt-32 pb-8 px-16 h-full overflow-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Theme illustration */}
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-400"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">{currentSentence.themeEmoji}</div>
              <h2 className="text-4xl text-purple-700">{currentSentence.theme}</h2>
            </div>
          </motion.div>

          {/* Selected words area (sentence construction) */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-8 border-4 border-blue-400 min-h-40">
            <h3 className="text-2xl text-blue-700 mb-4">Tu frase:</h3>
            <div className="flex flex-wrap gap-4 min-h-24 items-center">
              {selectedWords.length === 0 ? (
                <p className="text-gray-400 text-xl">Toca las palabras para armar la frase...</p>
              ) : (
                selectedWords.map((word, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveWord(index)}
                    className={`bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-8 py-6 text-2xl rounded-2xl shadow-lg border-4 cursor-pointer hover:shadow-xl ${
                      focusArea === 'selected' && focusedIndex === index
                        ? 'border-yellow-400 ring-4 ring-yellow-300 scale-110'
                        : 'border-white'
                    }`}
                  >
                    {word}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Available words */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-8 border-4 border-green-400">
            <h3 className="text-2xl text-green-700 mb-4">Palabras disponibles:</h3>
            <div className="flex flex-wrap gap-4">
              {shuffledWords.map((word, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWordClick(word, index)}
                  className={`bg-gradient-to-r from-green-400 to-emerald-400 text-white px-8 py-6 text-2xl rounded-2xl shadow-lg border-4 cursor-pointer hover:shadow-xl ${
                    focusArea === 'available' && focusedIndex === index
                      ? 'border-yellow-400 ring-4 ring-yellow-300 scale-110'
                      : 'border-white'
                  }`}
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-6 justify-center items-center">
            {/* Help button */}
            <Button
              onClick={() => navigateTo('tutorial')}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-8 py-6 text-xl rounded-3xl shadow-xl border-4 border-white"
            >
              <HelpCircle className="w-8 h-8" />
            </Button>

            {/* Hint button */}
            <Button
              onClick={handleHint}
              disabled={selectedWords.length >= currentSentence.words.length}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-6 text-xl rounded-3xl shadow-xl border-4 border-white disabled:opacity-50"
            >
              <Lightbulb className="w-8 h-8" />
            </Button>

            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-12 py-8 text-2xl rounded-3xl shadow-xl border-4 border-white"
            >
              <RotateCcw className="w-8 h-8 mr-4" />
              Reiniciar
            </Button>

            <Button
              onClick={handleVerify}
              disabled={isVerifyDisabled}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-16 py-8 text-3xl rounded-3xl shadow-xl border-4 border-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Check className="w-10 h-10 mr-4" />
              Verificar
            </Button>
          </div>

          {/* Keyboard hints (subtle indicator) */}
          <div className="flex justify-center">
            <div className="bg-white/80 px-6 py-3 rounded-2xl shadow-lg border-2 border-indigo-300 text-center">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Usa las flechas ↑↓←→ para navegar, Enter para seleccionar, Ctrl+V para verificar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-12 max-w-2xl border-4 border-orange-400 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-6">🤔</div>
                <h2 className="text-4xl text-orange-700 mb-6">¿Quieres empezar de nuevo?</h2>
                <p className="text-2xl text-gray-600 mb-8">Se borrarán todas las palabras que has colocado</p>
                
                <div className="flex gap-6 justify-center">
                  <Button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-12 py-6 text-2xl rounded-3xl shadow-xl border-4 border-white"
                  >
                    No, seguir
                  </Button>
                  <Button
                    onClick={performReset}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-6 text-2xl rounded-3xl shadow-xl border-4 border-white"
                  >
                    Sí, reiniciar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: feedback === 'correct' ? 180 : -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: feedback === 'correct' ? -180 : 180 }}
              className={`bg-white rounded-3xl p-12 max-w-2xl border-4 ${feedback === 'correct' ? 'border-green-400' : 'border-yellow-400'} shadow-2xl`}
            >
              <div className="text-center">
                {feedback === 'correct' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl mb-6"
                    >
                      🎉
                    </motion.div>
                    <h2 className="text-5xl text-green-600 mb-6">¡Muy bien!</h2>
                    <p className="text-3xl text-purple-600 mb-8">¡Frase completada!</p>
                    <p className="text-2xl text-orange-600 mb-8">+100 puntos 🎯</p>
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-16 py-8 text-3xl rounded-3xl shadow-xl border-4 border-white"
                    >
                      Siguiente
                      <ChevronRight className="w-10 h-10 ml-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-8xl mb-6">🤔</div>
                    <h2 className="text-5xl text-yellow-600 mb-6">Casi lo logras</h2>
                    <p className="text-3xl text-gray-700 mb-8">Revisa el orden de las palabras</p>
                    <Button
                      onClick={() => setShowFeedbackModal(false)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-16 py-8 text-3xl rounded-3xl shadow-xl border-4 border-white"
                    >
                      <Check className="w-10 h-10 mr-4" />
                      Intentar de nuevo
                    </Button>
                  </>
                )}
              </div>

              {/* Confetti effect for correct answers */}
              {feedback === 'correct' && [...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, x: 0, opacity: 1 }}
                  animate={{
                    y: [0, -200, 200],
                    x: Math.random() * 400 - 200,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 2, delay: Math.random() * 0.5 }}
                  className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
          >
            {/* Sparkles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: '50vw', y: '50vh' }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${50 + Math.random() * 40 - 20}vw`,
                  y: `${Math.random() * 80}vh`,
                }}
                transition={{ duration: 1.5, delay: Math.random() * 0.3 }}
                className="absolute"
              >
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}