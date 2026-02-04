import { motion } from "motion/react";
import { Play, Gift, Settings, HelpCircle, Star, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import type { Screen } from "../App";
import type { GameState } from "../App";

interface HomeScreenProps {
  navigateTo: (screen: Screen) => void;
  gameState: GameState;
}

export function HomeScreen({ navigateTo, gameState }: HomeScreenProps) {
  const { speak } = useTextToSpeech();

  return (
    <main
      className="w-full h-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 relative overflow-hidden"
      role="main"
      aria-label="Pantalla de inicio"
    >
      {/* Animated balloons background - hacia los bordes */}
      <motion.div
        animate={{ y: [-20, -40, -20], x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 w-16 h-20 bg-red-400 rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [-30, -50, -30], x: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-20 right-16 w-20 h-24 bg-yellow-400 rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [-25, -45, -25], x: [0, 20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 left-16 w-18 h-22 bg-green-400 rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [-35, -55, -35], x: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-24 w-14 h-18 bg-blue-400 rounded-full opacity-60"
      />

      {/* Stars decoration - hacia los bordes */}
      {[...Array(8)].map((_, i) => {
        const isTopOrBottom = i % 2 === 0;
        return (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute"
            style={{
              top: isTopOrBottom
                ? `${Math.random() * 15}%`
                : `${Math.random() * 15 + 85}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          </motion.div>
        );
      })}

      {/* Main content - Distribución limpia con escala 1.3x */}
      <section className="relative z-10 flex flex-col items-center justify-center h-full gap-6 md:gap-8 px-6 md:px-12 py-6">
        {/* Logo and title - Elegante a 64px */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl px-12 py-6 border-4 border-yellow-400 inline-block">
            <h1 className="text-[64px] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 font-bold">
              <span
                role="img"
                aria-label="Emoji de rompecabezas"
                className="text-[72px]"
              >
                🧩
              </span>{" "}
              Arma la Frase
            </h1>
          </div>
        </motion.div>

        {/* Welcome message - 24px legible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-10 py-5 rounded-3xl shadow-xl border-4 border-white max-w-3xl"
        >
          <p className="text-[24px] text-center leading-relaxed font-medium">
            ¡Bienvenido! ¡Vamos a jugar y aprender juntos!{" "}
            <span className="text-[28px]">🌟</span>
          </p>
        </motion.div>

        {/* Main play button - Destacado y elegante */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", bounce: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => {
              navigateTo("game");
              speak("¡Jugar!");
            }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-16 py-8 text-[48px] rounded-full shadow-2xl border-4 border-white transform transition-all font-bold"
            aria-label="Empezar a jugar. Acceso rápido: Alt+J"
            title="Empezar a jugar (Alt+J)"
          >
            <Play className="w-14 h-14 mr-4 fill-white" aria-hidden="true" />
            ¡Jugar!
          </Button>
        </motion.div>

        {/* Progress summary - Escala 1.3x */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/95 px-8 py-4 rounded-3xl shadow-xl border-3 border-blue-400"
          role="status"
          aria-label={`Nivel actual: ${gameState.currentLevel}. Premios ganados: ${gameState.stars + gameState.trophies}`}
        >
          <div className="flex flex-col gap-2 items-center">
            <p className="text-[24px] text-blue-700 font-semibold">
              <span className="text-[26px]" role="img" aria-label="Gráfico de barras">📊</span> Nivel actual:{" "}
              <span className="text-purple-700">{gameState.currentLevel}</span>
            </p>
            <p className="text-[24px] text-pink-700 font-semibold">
              <span className="text-[26px]" role="img" aria-label="Regalo">🎁</span> Premios ganados:{" "}
              <span className="text-orange-700">
                {gameState.stars + gameState.trophies}
              </span>{" "}
              <span className="text-[26px]" role="img" aria-label="Estrella">⭐</span>
            </p>
          </div>
        </motion.div>

        {/* Stats display - Escala 1.3x */}
        {gameState.points > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-6 bg-white/90 px-8 py-4 rounded-3xl shadow-xl"
            role="status"
            aria-label={`Estadísticas: ${gameState.stars} estrellas, ${gameState.trophies} trofeos, ${gameState.points} puntos`}
          >
            <div className="flex items-center gap-3">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" aria-hidden="true" />
              <span className="text-[28px] font-bold" aria-label={`${gameState.stars} estrellas`}>{gameState.stars}</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10 text-orange-500 fill-orange-500" aria-hidden="true" />
              <span className="text-[28px] font-bold" aria-label={`${gameState.trophies} trofeos`}>
                {gameState.trophies}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[28px]" role="img" aria-label="Diana">🎯</span>
              <span className="text-[28px] font-bold" aria-label={`${gameState.points} puntos`}>
                {gameState.points} pts
              </span>
            </div>
          </motion.div>
        )}
        {/* Navigation buttons - Escala 1.3x elegante */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4 justify-center flex-wrap"
          role="navigation"
          aria-label="Menú principal"
        >
          <Button
            onClick={() => {
              navigateTo("rewards");
              speak("Mis Premios");
            }}
            className="bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white px-8 py-5 text-[24px] rounded-3xl shadow-xl border-3 border-white font-semibold"
            aria-label="Ver mis premios. Acceso rápido: Alt+R"
            title="Mis Premios (Alt+R)"
          >
            <Gift className="w-8 h-8 mr-3" aria-hidden="true" />
            Mis Premios
          </Button>

          <Button
            onClick={() => {
              navigateTo("tutorial");
              speak("Cómo jugar");
            }}
            className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-8 py-5 text-[24px] rounded-3xl shadow-xl border-3 border-white font-semibold"
            aria-label="Ver tutorial de cómo jugar. Acceso rápido: Alt+H"
            title="Cómo jugar (Alt+H)"
          >
            <HelpCircle className="w-8 h-8 mr-3" aria-hidden="true" />
            Cómo jugar
          </Button>

          <Button
            onClick={() => {
              navigateTo("settings");
              speak("Ajustes");
            }}
            className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white px-8 py-5 text-[24px] rounded-3xl shadow-xl border-3 border-white font-semibold"
            aria-label="Ir a ajustes de accesibilidad. Acceso rápido: Alt+A"
            title="Ajustes (Alt+A)"
          >
            <Settings className="w-8 h-8 mr-3" aria-hidden="true" />
            Ajustes
          </Button>
        </motion.nav>
      </section>
    </main>
  );
}
