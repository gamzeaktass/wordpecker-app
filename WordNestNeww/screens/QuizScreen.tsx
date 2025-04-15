import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const examTypes = ['YDS', 'YÖKDİL', 'YDT'];

const generateQuestions = (examType: string) => {
  const allQuestions = [];

  const questionTemplates = {
    synonym: (word: string) => `Choose the synonym for "${word}"`,
    antonym: (word: string) => `Select the antonym for "${word}"`,
    completion: (sentence: string) => `Complete the sentence: "${sentence}..."`,
    definition: (definition: string) => `Which word matches this definition: "${definition}"`,
    context: (sentence: string, blank: string) => `Choose the best word to fill in the blank: "${sentence.replace('___', '_____')}"`
  };

  const questionBank = [
    {
      type: 'synonym',
      word: 'elaborate',
      options: ['detailed', 'simple', 'brief', 'plain'],
      correct: 0
    },
    {
      type: 'antonym',
      word: 'ambiguous',
      options: ['clear', 'vague', 'confusing', 'blurred'],
      correct: 0
    },
    {
      type: 'completion',
      sentence: 'Despite the rain, they continued to',
      options: ['walk', 'stop', 'hide', 'drive'],
      correct: 0
    },
    {
      type: 'definition',
      definition: 'Someone who loves and supports their country',
      options: ['patriot', 'traitor', 'citizen', 'immigrant'],
      correct: 0
    },
    {
      type: 'context',
      sentence: 'He was so tired that he could hardly ___ his eyes.',
      options: ['keep open', 'sleep', 'close', 'blink'],
      correct: 0
    },
    {
      type: 'synonym',
      word: 'benevolent',
      options: ['kind', 'evil', 'selfish', 'hostile'],
      correct: 0
    },
    {
      type: 'definition',
      definition: 'An explanation of the meaning of a word or phrase',
      options: ['definition', 'translation', 'description', 'interpretation'],
      correct: 0
    },
    {
      type: 'completion',
      sentence: 'She decided to apply for the job even though she lacked experience',
      options: ['because she was confident', 'so she quit', 'as it rained', 'but it was hard'],
      correct: 0
    },
    {
      type: 'antonym',
      word: 'hostile',
      options: ['friendly', 'aggressive', 'mean', 'cold'],
      correct: 0
    },
    {
      type: 'context',
      sentence: 'They were excited to ___ their new home.',
      options: ['move into', 'sell', 'build', 'leave'],
      correct: 0
    }
  ];

  for (let testIndex = 0; testIndex < 20; testIndex++) {
    const testQuestions = [];

    for (let questionIndex = 0; questionIndex < 20; questionIndex++) {
      const random = questionBank[Math.floor(Math.random() * questionBank.length)];

      let questionText = '';
      if (random.type === 'synonym') {
        questionText = questionTemplates.synonym(random.word);
      } else if (random.type === 'antonym') {
        questionText = questionTemplates.antonym(random.word);
      } else if (random.type === 'completion') {
        questionText = questionTemplates.completion(random.sentence);
      } else if (random.type === 'definition') {
        questionText = questionTemplates.definition(random.definition);
      } else if (random.type === 'context') {
        questionText = questionTemplates.context(random.sentence, '___');
      }

      testQuestions.push({
        id: questionIndex + 1,
        testId: testIndex + 1,
        question: questionText,
        options: random.options,
        correct: random.correct,
        points: 5
      });
    }

    allQuestions.push(testQuestions);
  }

  return allQuestions;
};


const mockQuestions = {
  YDS: generateQuestions('YDS'),
  'YÖKDİL': generateQuestions('YÖKDİL'),
  YDT: generateQuestions('YDT')
};

export default function QuizScreen() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  const handleTestSelect = (testNumber) => {
    setSelectedTest(testNumber);
    setCurrentQuestion(0);
    setScore(0);
    setTestCompleted(false);
    setSelectedAnswer(null);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      if (currentQuestion < 19) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setTestCompleted(true);
      }
    }
  };

  const handleExamSelect = (examType) => {
    setSelectedExam(examType);
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    if (index === mockQuestions[selectedExam][selectedTest - 1][currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedExam ? (
        <View style={styles.examSelection}>
          <Text style={styles.title}>Select Exam Type</Text>
          {examTypes.map((exam) => (
            <TouchableOpacity
              key={exam}
              style={styles.examButton}
              onPress={() => handleExamSelect(exam)}
            >
              <Text style={styles.examButtonText}>{exam}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : !selectedTest ? (
        <ScrollView style={styles.testSelection}>
          <Text style={styles.title}>{selectedExam} Tests</Text>
          <View style={styles.testGrid}>
            {Array.from({ length: 20 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={styles.testButton}
                onPress={() => handleTestSelect(i + 1)}
              >
                <Text style={styles.testButtonText}>Test {i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedExam(null)}
          >
            <Text style={styles.backButtonText}>← Back to Exam Selection</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : testCompleted ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Test Completed!</Text>
          <Text style={styles.resultScore}>Your Score: {score * 5}/100</Text>
          <Text style={styles.resultDetails}>Correct Answers: {score}/20</Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => setSelectedTest(null)}
          >
            <Text style={styles.returnButtonText}>Return to Test Selection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.examTitle}>{selectedExam} - Test {selectedTest}</Text>
          <View style={styles.quizContent}>
            <View style={styles.quizHeader}>
              <Text style={styles.testInfo}>Question {currentQuestion + 1}/20</Text>
              <Text style={styles.scoreText}>Score: {score * 5}</Text>
            </View>
            <Text style={styles.questionText}>
              {mockQuestions[selectedExam][selectedTest - 1][currentQuestion].question}
            </Text>
            <ScrollView style={styles.optionsContainer}>
              {mockQuestions[selectedExam][selectedTest - 1][currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.nextButton,
                selectedAnswer === null && styles.disabledButton
              ]}
              onPress={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion === 19 ? 'Finish Test' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  examSelection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 20,
    textAlign: 'center',
  },
  examButton: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  examButtonText: {
    fontSize: 18,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '500',
  },
  testSelection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testButton: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 20,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    color: '#2A2A2A',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#E8F0FE',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 16,
    color: '#2A2A2A',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4A90E2',
  },
  resultScore: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultDetails: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  returnButton: {
    padding: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
