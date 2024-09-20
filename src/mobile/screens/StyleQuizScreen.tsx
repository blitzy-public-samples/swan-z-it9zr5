import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Header } from 'src/mobile/components/organisms/Header';
import { useAuth, useTheme } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE, StyleLines } from 'src/shared/constants/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  images: string[];
}

interface QuizAnswer {
  questionId: string;
  answer: string;
}

const StyleQuizScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { fetchData } = useApi();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchData('/api/style-quiz/questions');
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz questions. Please try again.');
        setLoading(false);
      }
    };

    loadQuizQuestions();
  }, [fetchData]);

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers([...userAnswers, { questionId, answer }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await fetchData('/api/style-quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ answers: userAnswers }),
      });
      navigation.navigate('QuizResults');
    } catch (err) {
      setError('Failed to submit quiz results. Please try again.');
      setLoading(false);
    }
  };

  const renderQuestionOption = (option: string, image: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.optionItem}
      onPress={() => handleAnswer(questions[currentQuestionIndex].id, option)}
    >
      <Image source={{ uri: image }} style={styles.optionImage} />
      <Text style={styles.optionText}>{option}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading quiz questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={() => setError(null)} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Header title="Style Quiz" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) =>
            renderQuestionOption(option, currentQuestion.images[index], index)
          )}
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button title="Next" onPress={handleNext} style={styles.nextButton} />
        ) : (
          <Button title="Submit" onPress={handleSubmit} style={styles.nextButton} />
        )}
      </ScrollView>
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionImage: {
    width: '100%',
    height: 150,
  },
  optionText: {
    padding: 10,
    textAlign: 'center',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  nextButton: {
    marginTop: 20,
  },
});

export default StyleQuizScreen;