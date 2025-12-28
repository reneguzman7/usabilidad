import { motion } from 'motion/react';
import { Play, Gift, Settings, HelpCircle, Star, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import type { Screen } from '../App';
import type { GameState } from '../App';

interface HomeScreenProps {
  navigateTo: (screen: Screen) => void;
  gameState: GameState;
}

export function HomeScreen({ navigateTo, gameState }: HomeScreenProps) {
  const { speak } = useTextToSpeech();

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 relative overflow-hidden">
      {/* Animated balloons background */}
      <motion.div
        animate={{ y: [-20, -40, -20], x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 w-16 h-20 bg-red-400 rounded-full opacity-70"
      />
      <motion.div
        animate={{ y: [-30, -50, -30], x: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-40 right-32 w-20 h-24 bg-yellow-400 rounded-full opacity-70"
      />
      <motion.div
        animate={{ y: [-25, -45, -25], x: [0, 20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-40 left-40 w-18 h-22 bg-green-400 rounded-full opacity-70"
      />
      <motion.div
        animate={{ y: [-35, -55, -35], x: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-60 right-60 w-14 h-18 bg-blue-400 rounded-full opacity-70"
      />

      {/* Stars decoration */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            delay: i * 0.3
          }}
          className="absolute"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 90 + 5}%`,
          }}
        >
          <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-16">
        {/* Logo and title */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl px-16 py-8 border-8 border-yellow-400 inline-block">
            <h1 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              🧩 Arma la Frase
            </h1>
          </div>
        </motion.div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-12 py-6 rounded-3xl shadow-xl border-4 border-white"
        >
          <p className="text-3xl text-center">¡Bienvenido! ¡Vamos a jugar y aprender juntos! 🌟</p>
        </motion.div>

        {/* Main play button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', bounce: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => {
              navigateTo('game');
              speak('¡Jugar!');
            }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-24 py-12 text-5xl rounded-full shadow-2xl border-8 border-white transform transition-all"
          >
            <Play className="w-16 h-16 mr-6 fill-white" />
            ¡Jugar!
          </Button>
        </motion.div>

        {/* Progress summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/95 px-10 py-5 rounded-3xl shadow-xl border-4 border-blue-400"
        >
          <div className="flex flex-col gap-2 items-center">
            <p className="text-2xl text-blue-700">
              📊 Nivel actual: <span className="text-purple-700">{gameState.currentLevel}</span>
            </p>
            <p className="text-2xl text-pink-700">
              🎁 Premios ganados: <span className="text-orange-700">{gameState.stars + gameState.trophies}</span> ⭐
            </p>
          </div>
        </motion.div>

        {/* Stats display */}
        {gameState.points > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-8 bg-white/90 px-12 py-6 rounded-3xl shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
              <span className="text-3xl">{gameState.stars}</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-orange-500 fill-orange-500" />
              <span className="text-3xl">{gameState.trophies}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span className="text-3xl">{gameState.points} pts</span>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex gap-6 mt-4"
        >
          <Button
            onClick={() => {
              navigateTo('rewards');
              speak('Mis Premios');
            }}
            className="bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white px-10 py-8 text-2xl rounded-3xl shadow-xl border-4 border-white"
          >
            <Gift className="w-10 h-10 mr-4" />
            Mis Premios
          </Button>

          <Button
            onClick={() => {
              navigateTo('tutorial');
              speak('Cómo jugar');
            }}
            className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-10 py-8 text-2xl rounded-3xl shadow-xl border-4 border-white"
          >
            <HelpCircle className="w-10 h-10 mr-4" />
            Cómo jugar
          </Button>

          <Button
            onClick={() => {
              navigateTo('settings');
              speak('Ajustes');
            }}
            className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white px-10 py-8 text-2xl rounded-3xl shadow-xl border-4 border-white"
          >
            <Settings className="w-10 h-10 mr-4" />
            Ajustes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}