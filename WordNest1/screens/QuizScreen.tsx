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

const mockQuestions = {
  YDS: [
    {
      id: 1,
      question: "The word 'endeavor' is closest in meaning to:",
      options: ['attempt', 'success', 'failure', 'achievement'],
      correct: 0,
    },
    // Add more questions...
  ],
  'YÖKDİL': [
    {
      id: 1,
      question: "Choose the correct synonym for 'abundant':",
      options: ['plentiful', 'scarce', 'rare', 'limited'],
      correct: 0,
    },
    // Add more questions...
  ],
  YDT: [
    {
      id: 1,
      question: "Select the best antonym for 'benevolent':",
      options: ['malevolent', 'kind', 'generous', 'charitable'],
      correct: 0,
    },
    // Add more questions...
  ],
};

export default function QuizScreen() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const handleExamSelect = (examType) => {
    setSelectedExam(examType);
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    if (index === mockQuestions[selectedExam][currentQuestion].correct) {
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
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.examTitle}>{selectedExam}</Text>
          <Text style={styles.questionText}>
            {mockQuestions[selectedExam][currentQuestion].question}
          </Text>

          <ScrollView style={styles.optionsContainer}>
            {mockQuestions[selectedExam][currentQuestion].options.map((option, index) => (
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

          <View style={styles.bottomBar}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedExam(null)}
            >
              <Text style={styles.backButtonText}>Change Exam</Text>
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
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examButtonText: {
    fontSize: 18,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '500',
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});