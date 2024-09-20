import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateStyleProfile } from '../../redux/slices/userSlice';
import { submitStyleQuiz } from '../../services/api';
import { generateStyleRecommendations } from '../../utils/styleHelpers';
import { validateQuizResponses } from '../../utils/validation';
import Header from '../components/Header';
import Footer from '../components/Footer';

const StyleQuiz: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch quiz questions from API or load from local storage
    // This is a placeholder and should be replaced with actual data fetching
    setQuestions([
      { id: 1, type: 'multipleChoice', text: 'What is your preferred style?', options: ['Casual', 'Formal', 'Sporty'] },
      { id: 2, type: 'slider', text: 'How important is comfort to you?', min: 1, max: 5 },
      { id: 3, type: 'imageSelection', text: 'Which outfit do you like most?', options: ['image1.jpg', 'image2.jpg', 'image3.jpg'] },
    ]);
  }, []);

  const handleSelection = (questionId, answer) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: answer
    }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderQuestion = (question, onSelect) => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <View>
            <Text>{question.text}</Text>
            {question.options.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => onSelect(question.id, option)}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'slider':
        // Implement slider component
        return <Text>Slider question not implemented yet</Text>;
      case 'imageSelection':
        // Implement image selection component
        return <Text>Image selection question not implemented yet</Text>;
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  const handleSubmit = async () => {
    if (validateQuizResponses(responses)) {
      try {
        await submitStyleQuiz(responses);
        const recommendations = generateStyleRecommendations(responses);
        dispatch(updateStyleProfile(recommendations));
        navigation.navigate('StyleResults', { recommendations });
      } catch (error) {
        console.error('Failed to submit quiz:', error);
        // Implement error handling UI
      }
    } else {
      // Show validation error message
      console.error('Invalid quiz responses');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        {renderQuestion(questions[currentQuestionIndex], handleSelection)}
        {currentQuestionIndex === questions.length - 1 && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text>Submit</Text>
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
  },
  content: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default StyleQuiz;

// TODO: Implement custom input components for each question type
// TODO: Add animations for question transitions
// TODO: Implement quiz branching logic
// TODO: Add progress indicator
// TODO: Implement save and resume functionality
// TODO: Ensure accessibility for all components
// TODO: Implement error handling UI
// TODO: Add loading indicator for submission process
// TODO: Optimize performance
// TODO: Implement analytics tracking