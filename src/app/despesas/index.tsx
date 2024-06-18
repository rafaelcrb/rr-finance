import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExpenseScreen = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleAddExpense = () => {
    console.log('Expense added:', { amount, description });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adicionar Despesa</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#3d3d3d',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExpenseScreen;
