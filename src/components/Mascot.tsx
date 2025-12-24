import { motion } from 'motion/react';
import { Smile, Star, Trophy } from 'lucide-react';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'celebrating' | 'thinking';
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function Mascot({ mood = 'happy', size = 'medium', message }: MascotProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-40 h-40'
  };

  const getAnimation = () => {
    switch (mood) {
      case 'excited':
        return {
          scale: [1, 1.1, 1],
          rotate: [-5, 5, -5, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
        };
      case 'celebrating':
        return {
          y: [0, -20, 0],
          rotate: [0, 360],
          transition: { duration: 1, repeat: Infinity, repeatDelay: 0.5 }
        };
      case 'thinking':
        return {
          rotate: [-10, 10, -10],
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity }
        };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={getAnimation()}
        className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative`}
      >
        {/* Eyes */}
        <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2">
          <div className="w-3 h-3 bg-white rounded-full shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-1/4 right-1/3 transform translate-x-1/2">
          <div className="w-3 h-3 bg-white rounded-full shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Smile */}
        <div className="absolute bottom-1/4">
          <Smile className="w-6 h-6 text-white" />
        </div>

        {/* Celebration effects */}
        {mood === 'celebrating' && (
          <>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -left-2"
            >
              <Star className="w-6 h-6 text-pink-300 fill-pink-300" />
            </motion.div>
          </>
        )}

        {mood === 'excited' && (
          <motion.div
            animate={{ y: [-5, 5], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-8"
          >
            <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}
      </motion.div>

      {message && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white px-6 py-3 rounded-2xl shadow-lg border-4 border-purple-400 relative"
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
          <p className="text-purple-700 text-center">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
