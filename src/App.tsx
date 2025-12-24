import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { TutorialScreen } from './components/TutorialScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { KeyboardHelp } from './components/KeyboardHelp';

export type Screen = 'home' | 'game' | 'rewards' | 'tutorial' | 'settings';

export interface GameState {
  points: number;
  stars: number;
  trophies: number;
  stickers: number;
  currentLevel: number;
  unlockedRewards: string[];
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameState, setGameState] = useState<GameState>({
    points: 0,
    stars: 0,
    trophies: 0,
    stickers: 0,
    currentLevel: 1,
    unlockedRewards: []
  });

  const [settings, setSettings] = useState({
    fontSize: 'normal',
    highContrast: false,
    backgroundColor: 'default',
    difficulty: 'normal'
  });

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  // Atajos de teclado globales
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt + tecla para navegación global
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'i':
            e.preventDefault();
            navigateTo('home');
            break;
          case 'j':
            e.preventDefault();
            navigateTo('game');
            break;
          case 'r':
            e.preventDefault();
            navigateTo('rewards');
            break;
          case 'a':
            e.preventDefault();
            navigateTo('settings');
            break;
          case 'h':
            e.preventDefault();
            navigateTo('tutorial');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigateTo={navigateTo} gameState={gameState} />;
      case 'game':
        return <GameScreen navigateTo={navigateTo} gameState={gameState} updateGameState={updateGameState} />;
      case 'rewards':
        return <RewardsScreen navigateTo={navigateTo} gameState={gameState} />;
      case 'tutorial':
        return <TutorialScreen navigateTo={navigateTo} />;
      case 'settings':
        return <SettingsScreen navigateTo={navigateTo} settings={settings} setSettings={setSettings} />;
      default:
        return <HomeScreen navigateTo={navigateTo} gameState={gameState} />;
    }
  };

  return (
    <div 
      className={`w-screen h-screen overflow-hidden ${
        settings.highContrast ? 'contrast-125' : ''
      } ${
        settings.fontSize === 'large' ? 'text-xl' : settings.fontSize === 'xlarge' ? 'text-2xl' : ''
      }`}
      style={{
        backgroundColor: settings.backgroundColor === 'blue' ? '#E3F2FD' : 
                        settings.backgroundColor === 'yellow' ? '#FFF9C4' : 
                        settings.backgroundColor === 'pink' ? '#FCE4EC' : undefined
      }}
    >
      {renderScreen()}
      <KeyboardHelp />
    </div>
  );
}

export default App;