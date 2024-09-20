import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StyleQuizQuestion } from '../../components/StyleQuiz';
import { updateStyleProfile } from '../../redux/slices/userSlice';
import { submitStyleQuiz } from '../../services/api';
import { generateStyleProfile } from '../../utils/styleHelpers';
import { validateQuizResponses } from '../../utils/validation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const QUIZ_QUESTIONS = [
  // Array of quiz questions and options
  // Example: { id: 1, question: 'What's your preferred style?', options: ['Casual', 'Formal', 'Sporty'] }
];

const StyleQuiz: React.FC = () => {
  const [quizResponses, setQuizResponses] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);

  const handleQuestionResponse = (questionIndex: number, response: string) => {
    setQuizResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: response,
    }));

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(questionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const isValid = validateQuizResponses(quizResponses);
      if (!isValid) {
        throw new Error('Invalid quiz responses');
      }

      await submitStyleQuiz(quizResponses);
      const styleProfile = generateStyleProfile(quizResponses);
      dispatch(updateStyleProfile(styleProfile));

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // TODO: Implement error handling
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Style Quiz</Text>
        {QUIZ_QUESTIONS[currentQuestionIndex] && (
          <StyleQuizQuestion
            question={QUIZ_QUESTIONS[currentQuestionIndex]}
            onAnswer={(response) => handleQuestionResponse(currentQuestionIndex, response)}
          />
        )}
        {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 && (
          <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default StyleQuiz;