import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';
import { Button } from './ui/button';

export function KeyboardHelp() {
  const [showHelp, setShowHelp] = useState(false);

  // Mostrar ayuda con F1 o ?
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
      
      // Cerrar con Esc
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-8 right-8 z-30 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-6 rounded-full shadow-2xl border-4 border-white"
        title="Ayuda de teclado (F1)"
      >
        <Keyboard className="w-8 h-8" />
      </Button>

      {/* Modal de ayuda */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-10 max-w-4xl max-h-[90vh] overflow-auto border-4 border-indigo-400 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-2xl">
                    <Keyboard className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl text-indigo-700">Atajos de Teclado</h2>
                </div>
                <Button
                  onClick={() => setShowHelp(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-4 rounded-2xl"
                >
                  <X className="w-8 h-8" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Navegación Global */}
                <div>
                  <h3 className="text-3xl text-purple-600 mb-4 border-b-2 border-purple-200 pb-2">
                    🌐 Navegación Global (desde cualquier pantalla)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <KeyboardShortcut keys={['Alt', 'I']} description="Ir a Inicio" />
                    <KeyboardShortcut keys={['Alt', 'J']} description="Ir a Juego" />
                    <KeyboardShortcut keys={['Alt', 'R']} description="Ir a Mis Premios" />
                    <KeyboardShortcut keys={['Alt', 'A']} description="Ir a Ajustes" />
                    <KeyboardShortcut keys={['Alt', 'H']} description="Ir a Cómo Jugar" />
                    <KeyboardShortcut keys={['F1']} description="Mostrar esta ayuda" />
                  </div>
                </div>

                {/* Navegación General */}
                <div>
                  <h3 className="text-3xl text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
                    ⌨️ Navegación General
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <KeyboardShortcut keys={['Tab']} description="Siguiente elemento" />
                    <KeyboardShortcut keys={['Shift', 'Tab']} description="Elemento anterior" />
                    <KeyboardShortcut keys={['Enter']} description="Activar elemento seleccionado" />
                    <KeyboardShortcut keys={['Espacio']} description="Activar elemento seleccionado" />
                    <KeyboardShortcut keys={['Esc']} description="Cerrar modales" />
                  </div>
                </div>

                {/* En el Juego */}
                <div>
                  <h3 className="text-3xl text-green-600 mb-4 border-b-2 border-green-200 pb-2">
                    🎮 Durante el Juego
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <KeyboardShortcut keys={['↑']} description="Ir a palabras seleccionadas" />
                    <KeyboardShortcut keys={['↓']} description="Ir a palabras disponibles" />
                    <KeyboardShortcut keys={['←']} description="Palabra anterior" />
                    <KeyboardShortcut keys={['→']} description="Palabra siguiente" />
                    <KeyboardShortcut keys={['Enter / Espacio']} description="Seleccionar palabra enfocada" />
                    <KeyboardShortcut keys={['Supr / Backspace']} description="Devolver palabra seleccionada" />
                    <KeyboardShortcut keys={['Ctrl', 'V']} description="Verificar respuesta" />
                    <KeyboardShortcut keys={['Ctrl', 'R']} description="Reiniciar nivel" />
                    <KeyboardShortcut keys={['Ctrl', 'P']} description="Mostrar pista" />
                  </div>
                </div>

                {/* Tutorial */}
                <div>
                  <h3 className="text-3xl text-cyan-600 mb-4 border-b-2 border-cyan-200 pb-2">
                    📚 En el Tutorial
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <KeyboardShortcut keys={['→ / ↓']} description="Paso siguiente" />
                    <KeyboardShortcut keys={['← / ↑']} description="Paso anterior" />
                    <KeyboardShortcut keys={['Enter / Espacio']} description="Siguiente o Empezar" />
                  </div>
                </div>

                {/* Nota informativa */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-orange-300">
                  <p className="text-xl text-orange-800">
                    💡 <strong>Tip:</strong> Puedes usar el juego completamente con mouse, completamente con teclado, 
                    o combinando ambos. ¡Elige lo que sea más cómodo para ti!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface KeyboardShortcutProps {
  keys: string[];
  description: string;
}

function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
      <div className="flex gap-2">
        {keys.map((key, index) => (
          <span key={index}>
            <kbd className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm text-lg font-semibold text-gray-700">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="mx-1 text-gray-400">+</span>}
          </span>
        ))}
      </div>
      <span className="text-gray-700">{description}</span>
    </div>
  );
}
