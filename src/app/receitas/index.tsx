import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const RevenueScreen: React.FC = () => {
  const [valor, setValor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const router = useRouter();

  const handleAddRevenue = async () => {
    if (!valor.trim()) {
      Alert.alert('Erro', 'O campo de valor não pode estar vazio!');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const receita = { valor, description, date: new Date() };

      try {
        const docRef = await addDoc(collection(db, `usuarios/${uid}/receitas`), receita);
        console.log('Documento escrito com ID: ', docRef.id);
      } catch (e) {
        console.error('Erro ao adicionar documento: ', e);
        Alert.alert('Erro', 'Não foi possível adicionar a receita!');
        return;
      }

      console.log('Receita adicionada:', { valor, description });
      router.back();
    } else {
      Alert.alert('Erro', 'Usuário não está logado!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adicionar Receita</Text>
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
        value={valor}
        onChangeText={setValor}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddRevenue}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={router.back}>
        <Text style={styles.buttonText}>Voltar</Text>
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
    borderRadius: 30,
    alignItems: 'center',
    margin: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RevenueScreen;
