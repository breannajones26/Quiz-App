import React, { useState } from 'react';
import { Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Sample questions (with 1 of each type)
const sampleQuestions = [
  {
    question: "Bananas grow on trees",
    choices: ["True", "False"],
    correct: 0
  },
  {
    question: "Select the prime numbers",
    choices: ["2", "3", "4", "6"],
    correct: [0, 1]
  },
  {
    question: "What is the capital of France?",
    choices: ["Berlin", "Paris", "Rome"],
    correct: 1
  },
  {
    question: "Select all that fly.",
    choices: ["Parrot", "Mosquito", "Ostrich", "Ladybug"],
    correct: [0, 1, 3]
  }
];

const Question = ({ route, navigation }) => {
  const { questions, index = 0, answers = [] } = route.params;
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const question = questions[index];
  const isMultipleAnswer = Array.isArray(question.correct);

  const handleSelect = (selectedIndex) => {
    if (isMultipleAnswer) {
      setSelectedIndexes((prev) =>
        prev.includes(selectedIndex)
          ? prev.filter((i) => i !== selectedIndex)
          : [...prev, selectedIndex]
      );
    } else {
      setSelectedIndexes([selectedIndex]);
    }
  };

  const handleNext = () => {
    const updatedAnswers = [...answers, selectedIndexes];
    if (index + 1 < questions.length) {
      navigation.navigate('Question', {
        questions,
        index: index + 1,
        answers: updatedAnswers,
      });
    } else {
      navigation.navigate('Summary', {
        questions,
        answers: updatedAnswers,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{question.question}</Text>

      <View testID="choices" style={{ marginBottom: 20 }}>
        {question.choices.map((choice, idx) => {
          const isSelected = selectedIndexes.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSelect(idx)}
              style={{
                padding: 12,
                borderRadius: 6,
                backgroundColor: isSelected ? 'dodgerblue' : '#ccc',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#fff' }}>{choice}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button title="Next Question" testID="next-question" onPress={handleNext} />
    </ScrollView>
  );
};

const Summary = ({ route }) => {
  const { questions, answers } = route.params;

  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
      const userAnswer = answers[idx];
      const isCorrect =
        JSON.stringify([...correct].sort()) === JSON.stringify([...userAnswer].sort());
      return isCorrect ? score + 1 : score;
    }, 0);
  };

  const totalScore = calculateScore();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text testID="total" style={{ fontSize: 22, marginBottom: 20 }}>
        Your Score: {totalScore} / {questions.length}
      </Text>

      {questions.map((q, idx) => {
        const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
        const userAnswer = answers[idx];

        const isCorrect =
          JSON.stringify([...correct].sort()) === JSON.stringify([...userAnswer].sort());

        return (
          <View key={idx} style={{ marginBottom: 25 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{q.question}</Text>
            <Text style={{ marginVertical: 5 }}>
              {isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </Text>

            {q.choices.map((choice, choiceIndex) => {
              const isSelected = userAnswer.includes(choiceIndex);
              const isCorrectChoice = correct.includes(choiceIndex);

              let style = { fontSize: 14 };

              if (isSelected && isCorrectChoice) {
                style.fontWeight = 'bold';
              } else if (isSelected && !isCorrectChoice) {
                style.textDecorationLine = 'line-through';
              }

              return (
                <Text key={choiceIndex} style={style}>
                  {choice}
                </Text>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{
            questions: sampleQuestions,
            index: 0,
            answers: [],
          }}
        />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
