import { motion } from "motion/react";
import {
  Home,
  Star,
  Trophy,
  Award,
  Sparkles,
  Crown,
  Heart,
  Gift,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useEffect } from "react";
import type { Screen, GameState } from "../App";

interface RewardsScreenProps {
  navigateTo: (screen: Screen) => void;
  gameState: GameState;
}

export function RewardsScreen({ navigateTo, gameState }: RewardsScreenProps) {
  const { speak } = useTextToSpeech();
  const totalStickers = Math.floor(gameState.points / 100);
  const badges = Math.floor(gameState.points / 500);
  const collectionProgress = Math.min((gameState.points / 2000) * 100, 100);

  useEffect(() => {
    // Announce rewards summary when entering screen
    speak(
      `Mis Premios. Tienes ${gameState.points} puntos, ${gameState.stars} estrellas, ${gameState.trophies} trofeos, y ${totalStickers} calcomanías.`,
    );
  }, []);

  const rewardTypes = [
    {
      icon: Star,
      color: "from-yellow-400 to-orange-400",
      label: "Estrellas",
      count: gameState.stars,
    },
    {
      icon: Trophy,
      color: "from-orange-400 to-red-400",
      label: "Trofeos",
      count: gameState.trophies,
    },
    {
      icon: Award,
      color: "from-blue-400 to-purple-400",
      label: "Insignias",
      count: badges,
    },
    {
      icon: Crown,
      color: "from-purple-400 to-pink-400",
      label: "Coronas",
      count: Math.floor(gameState.stars / 5),
    },
  ];

  const stickers = [
    "🎨",
    "🦁",
    "🏖️",
    "⚽",
    "🎵",
    "🌈",
    "🚀",
    "🦋",
    "🌟",
    "🎪",
    "🐬",
    "🎭",
  ];

  return (
    <main
      className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 relative overflow-auto"
      role="main"
      aria-label="Pantalla de premios"
    >
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 bg-white/95 shadow-xl z-20 px-8 py-6"
        role="banner"
      >
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Button
            onClick={() => {
              navigateTo("home");
              speak("Volver a inicio");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white w-16 h-16 rounded-2xl shadow-lg"
            aria-label="Volver al inicio"
            title="Volver al inicio (Alt+I)"
          >
            <Home className="w-8 h-8" aria-hidden="true" />
          </Button>
          <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            <span role="img" aria-label="Emoji de regalo">
              🎁
            </span>{" "}
            Mis Premios
          </h1>
          <div className="w-24" aria-hidden="true" />{" "}
          {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content */}
      <div className="px-16 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome message */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-12 py-6 rounded-3xl shadow-xl border-4 border-white">
              <p className="text-4xl text-center">
                ¡Eres increíble! Has ganado {gameState.points} puntos! 🎉
              </p>
            </div>
          </motion.div>

          {/* Main rewards - Trophies first (jerarquizado) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-8"
            role="list"
            aria-label="Premios obtenidos"
          >
            {rewardTypes.map((reward, index) => (
              <motion.div
                key={reward.label}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className={`bg-gradient-to-br ${reward.color} rounded-3xl p-8 shadow-2xl border-4 border-white`}
                role="listitem"
                aria-label={`${reward.label}: ${reward.count}`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white rounded-full p-6 shadow-xl">
                    <reward.icon className="w-16 h-16 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl text-white text-center">
                    {reward.label}
                  </h3>
                  <div className="text-5xl text-white">{reward.count}</div>

                  {/* Sparkle animation when count > 0 */}
                  {reward.count > 0 && (
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8 text-yellow-300 fill-yellow-300" aria-hidden="true" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stickers collection - moved before collection progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-pink-400"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl text-pink-700">Álbum de Calcomanías</h2>
              <div className="flex items-center gap-3 bg-pink-100 px-6 py-3 rounded-2xl">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                <span className="text-2xl text-pink-700">
                  {totalStickers} / {stickers.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-6">
              {stickers.map((sticker, index) => {
                const isUnlocked = index < totalStickers;
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={isUnlocked ? { scale: 1.2, rotate: 10 } : {}}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-6xl shadow-xl border-4 ${
                      isUnlocked
                        ? "bg-gradient-to-br from-yellow-200 to-pink-200 border-yellow-400"
                        : "bg-gray-200 border-gray-300 grayscale opacity-50"
                    }`}
                  >
                    {sticker}
                    {isUnlocked && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Collection progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-400"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl text-purple-700">
                Progreso de Colección
              </h2>
              <div className="flex items-center gap-4">
                <Gift className="w-12 h-12 text-pink-500" aria-hidden="true" />
                <span className="text-3xl text-purple-700" aria-label={`${Math.round(collectionProgress)} por ciento completado`}>
                  {Math.round(collectionProgress)}%
                </span>
              </div>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-8 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(collectionProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso de colección: ${Math.round(collectionProgress)}%`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${collectionProgress}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full rounded-full relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ width: "50%" }}
                />
              </motion.div>
            </div>
            <p className="text-xl text-gray-600 mt-4 text-center">
              {collectionProgress < 100
                ? `¡Sigue jugando para desbloquear más recompensas! 🎯`
                : "¡Has completado toda la colección! ¡Eres un campeón! 👑"}
            </p>
          </motion.div>

          {/* Motivational messages */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-2xl p-6 shadow-xl border-4 border-white text-center">
              <p className="text-2xl text-white">¡Sigue así! 💪</p>
            </div>
            <div className="bg-gradient-to-br from-blue-300 to-cyan-400 rounded-2xl p-6 shadow-xl border-4 border-white text-center">
              <p className="text-2xl text-white">¡Eres un genio! 🧠</p>
            </div>
            <div className="bg-gradient-to-br from-purple-300 to-pink-400 rounded-2xl p-6 shadow-xl border-4 border-white text-center">
              <p className="text-2xl text-white">¡Increíble trabajo! ⭐</p>
            </div>
          </motion.div>

          {/* Fireworks effect */}
          {gameState.points > 0 && (
            <div
              className="fixed inset-0 pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: "50vw", y: "50vh", opacity: 1 }}
                  animate={{
                    scale: [0, 2, 3],
                    x: `${50 + Math.random() * 40 - 20}vw`,
                    y: `${Math.random() * 60}vh`,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute"
                >
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
