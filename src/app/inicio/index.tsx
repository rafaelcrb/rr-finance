import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const InicioScreen = () => {
  const expenses = [
    { id: '1', description: 'Compra de supermercado', amount: 'R$ 200' },
    { id: '2', description: 'Gasolina', amount: 'R$ 150' },
  ];

  const revenues = [
    { id: '1', description: 'Salário', amount: 'R$ 3000' },
    { id: '2', description: 'Freelance', amount: 'R$ 500' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo das Finanças</Text>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total de Despesas: R$ 350</Text>
        <Text style={styles.summaryText}>Total de Receitas: R$ 3500</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Despesas</Text>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receitas</Text>
        <FlatList
          data={revenues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Link href="/despesas" style={styles.button}>
          <Text style={styles.buttonText}>Adicionar Despesa</Text>
        </Link>
        <Link href="/receitas" style={styles.button}>
          <Text style={styles.buttonText}>Adicionar Receita</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  summary: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    color: '#4caf50',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#2d2d2d',
    marginBottom: 5,
    borderRadius: 8,
  },
  itemText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    textDecorationLine: 'none', // Adicione essa linha
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InicioScreen;
