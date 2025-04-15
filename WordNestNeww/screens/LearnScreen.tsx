import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../components/Logo';

const games = [
  {
    id: 'wordscramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters',
    icon: 'shuffle-variant',
    color: '#4A90E2',
  },
  {
    id: 'wordmatch',
    title: 'Word Match',
    description: 'Match pairs of words',
    icon: 'card-multiple',
    color: '#50C878',
  },
  {
    id: 'flashcards',
    title: 'Flash Cards',
    description: 'Learn with flashcards',
    icon: 'card-text',
    color: '#FF6B6B',
  },
  {
    id: 'spelling',
    title: 'Spelling Bee',
    description: 'Practice spelling',
    icon: 'format-letter-case',
    color: '#FFB100',
  },
];

// Word Scramble Game Component
// Word Match Game Component
const WordMatchGame = ({ onClose }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);  const wordPairs = [
    { english: 'profound', turkish: 'derin' },
    { english: 'enhance', turkish: 'artırmak' },
    { english: 'diverse', turkish: 'çeşitli' },
    { english: 'crucial', turkish: 'çok önemli' },
    { english: 'persist', turkish: 'ısrar etmek' },
    { english: 'acquire', turkish: 'elde etmek' },
    { english: 'precise', turkish: 'kesin' },
    { english: 'impact', turkish: 'etki' }
];  useEffect(() => {
    if (wordPairs && wordPairs.length > 0) {
      const shuffledCards = wordPairs.flatMap((pair, index) => [
        { 
          text: pair.english, 
          pairId: index, 
          isEnglish: true, 
          uniqueId: `eng_${index}` 
        },
        { 
          text: pair.turkish, 
          pairId: index, 
          isEnglish: false, 
          uniqueId: `tr_${index}` 
        }
      ]);
      
      setCards(shuffledCards.sort(() => Math.random() - 0.5));
    }
  }, [wordPairs]);  const handleCardPress = (uniqueId) => {
    if (flipped.length === 2) return;
    if (flipped.includes(uniqueId)) return;
    if (matched.includes(uniqueId)) return;

    setFlipped([...flipped, uniqueId]);

    if (flipped.length === 1) {
      const firstCard = cards.find(card => card.uniqueId === flipped[0]);
      const secondCard = cards.find(card => card.uniqueId === uniqueId);

      if (
        (firstCard.isEnglish && !secondCard.isEnglish && firstCard.pairId === secondCard.pairId) ||
        (!firstCard.isEnglish && secondCard.isEnglish && firstCard.pairId === secondCard.pairId)
      ) {
        setMatched([...matched, flipped[0], uniqueId]);
        setScore(score + 10);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }

    if (matched.length === cards.length - 2) {
      setTimeout(() => {
        setGameOver(true);
      }, 500);
    }
  };

  const resetGame = () => {
    const shuffledCards = [...wordPairs, ...wordPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <View style={gameStyles.container}>
      <Text style={gameStyles.scoreText}>Score: {score}</Text>      {!gameOver ? (
        <View style={gameStyles.cardGrid}>
          {Array.isArray(cards) && cards.map((card) => (
            <TouchableOpacity
              key={card.uniqueId}
              style={[
                gameStyles.card,
                (flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)) &&
                  gameStyles.cardFlipped,
              ]}
              onPress={() => handleCardPress(card.uniqueId)}
            >              <Text style={[
                gameStyles.cardText,
                {fontSize: card.text.length > 8 ? 14 : 16}
              ]}>
                {flipped.includes(card.uniqueId) || matched.includes(card.uniqueId)
                  ? card.text
                  : '?'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={gameStyles.gameOverContainer}>
          <Text style={gameStyles.gameOverText}>Congratulations!</Text>
          <Text style={gameStyles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity
            style={gameStyles.playAgainButton}
            onPress={resetGame}
          >
            <Text style={gameStyles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={gameStyles.closeButton}
        onPress={onClose}
      >
        <Text style={gameStyles.closeButtonText}>Close Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const WordScrambleGame = ({ onClose }) => {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  const words = [
    'language', 'vocabulary', 'grammar', 'sentence', 'learning',
    'practice', 'study', 'education', 'knowledge', 'understanding'
  ];

  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const startNewRound = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setUserInput('');
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const checkAnswer = () => {
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 10);
      startNewRound();
    } else {
      shakeAnimation();
      setGameOver(true);
    }
  };

  return (
    <View style={gameStyles.container}>
      {!gameOver ? (
        <>
          <Text style={gameStyles.scoreText}>Score: {score}</Text>
          <Animated.Text 
            style={[
              gameStyles.scrambledWord,
              { transform: [{ translateX: shake }] }
            ]}
          >
            {scrambledWord}
          </Animated.Text>
          <TextInput
            style={gameStyles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Enter the word"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={gameStyles.checkButton}
            onPress={checkAnswer}
          >
            <Text style={gameStyles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={gameStyles.gameOverContainer}>
          <Text style={gameStyles.gameOverText}>Game Over!</Text>
          <Text style={gameStyles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity
            style={gameStyles.playAgainButton}
            onPress={() => {
              setScore(0);
              setGameOver(false);
              startNewRound();
            }}
          >
            <Text style={gameStyles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={gameStyles.closeButton}
        onPress={onClose}
      >
        <Text style={gameStyles.closeButtonText}>Close Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function LearnScreen() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [wordsLearned, setWordsLearned] = useState(15);
  const [dailyGoal, setDailyGoal] = useState(20);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size={40} style={styles.logo} />
        <Text style={styles.title}>Learn English</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.streakCard}>
          <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
          <Text style={styles.streakText}>{dailyStreak} Day Streak!</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(wordsLearned / dailyGoal) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {wordsLearned}/{dailyGoal} words today
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Learning Games</Text>
        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderLeftColor: game.color }]}
              onPress={() => setSelectedGame(game.id)}
            >
              <MaterialCommunityIcons 
                name={game.icon} 
                size={30} 
                color={game.color} 
              />
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameDescription}>{game.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>      <Modal
        visible={selectedGame !== null}
        animationType="slide"
        onRequestClose={() => setSelectedGame(null)}
      >
        {selectedGame === 'wordscramble' && (
          <WordScrambleGame onClose={() => setSelectedGame(null)} />
        )}
        {selectedGame === 'wordmatch' && (
          <WordMatchGame onClose={() => setSelectedGame(null)} />
        )}
        {selectedGame === 'flashcards' && (
          <FlashCardGame onClose={() => setSelectedGame(null)} />
        )}
        {selectedGame === 'spelling' && (
          <SpellingGame onClose={() => setSelectedGame(null)} />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardFlipped: {
    backgroundColor: '#50C878',
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
  },
  finalScore: {
    fontSize: 24,
    marginBottom: 30,
    color: '#666',
  },
  playAgainButton: {
    backgroundColor: '#50C878',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  playAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrambledWord: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4A90E2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    marginBottom: 30,
  },
  playAgainButton: {
    backgroundColor: '#50C878',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

// Flash Card Game Component
const FlashCardGame = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  const flashCards = [
    { word: 'Apple', translation: 'Elma', example: 'I eat an apple every day.' },
    { word: 'House', translation: 'Ev', example: 'This is my house.' },
    { word: 'Car', translation: 'Araba', example: 'I drive a red car.' },
    { word: 'Dog', translation: 'Köpek', example: 'The dog is sleeping.' },
    { word: 'Cat', translation: 'Kedi', example: 'The cat is playing.' }
  ];

  const handleNext = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setGameOver(true);
    }
  };

  return (
    <View style={gameStyles.container}>
      <Text style={gameStyles.scoreText}>Card {currentIndex + 1}/{flashCards.length}</Text>
      <TouchableOpacity
        style={gameStyles.flashCard}
        onPress={() => setIsFlipped(!isFlipped)}
      >
        <Text style={gameStyles.flashCardText}>
          {isFlipped ? flashCards[currentIndex].translation : flashCards[currentIndex].word}
        </Text>
        {isFlipped && (
          <Text style={gameStyles.exampleText}>{flashCards[currentIndex].example}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={gameStyles.nextButton} onPress={handleNext}>
        <Text style={gameStyles.nextButtonText}>
          {currentIndex === flashCards.length - 1 ? 'Finish' : 'Next Card'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={gameStyles.closeButton} onPress={onClose}>
        <Text style={gameStyles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

// Spelling Game Component
const SpellingGame = ({ onClose }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const words = [
    { word: 'beautiful', hint: 'Looking nice and attractive' },
    { word: 'elephant', hint: 'A large gray animal with a trunk' },
    { word: 'computer', hint: 'Electronic device for processing data' },
    { word: 'hospital', hint: 'Place for medical treatment' },
    { word: 'mountain', hint: 'Very high natural elevation' }
  ];

  useEffect(() => {
    startNewWord();
  }, []);

  const startNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUserInput('');
  };

  const checkSpelling = () => {
    if (userInput.toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(score + 1);
      if (score + 1 === words.length) {
        setGameOver(true);
      } else {
        startNewWord();
      }
    } else {
      setGameOver(true);
    }
  };

  return (
    <View style={gameStyles.container}>
      {!gameOver ? (
        <>
          <Text style={gameStyles.scoreText}>Score: {score}</Text>
          <Text style={gameStyles.hintText}>Hint: {currentWord.hint}</Text>
          <TextInput
            style={gameStyles.spellingInput}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type the word..."
            autoCapitalize="none"
          />
          <TouchableOpacity style={gameStyles.checkButton} onPress={checkSpelling}>
            <Text style={gameStyles.checkButtonText}>Check Spelling</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={gameStyles.gameOverContainer}>
          <Text style={gameStyles.gameOverText}>Game Over!</Text>
          <Text style={gameStyles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity
            style={gameStyles.playAgainButton}
            onPress={() => {
              setScore(0);
              setGameOver(false);
              startNewWord();
            }}
          >
            <Text style={gameStyles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={gameStyles.closeButton} onPress={onClose}>
        <Text style={gameStyles.closeButtonText}>Close Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  streakCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 5,
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 15,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A2A',
    marginTop: 10,
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 12,
    color: '#666',
  },
});