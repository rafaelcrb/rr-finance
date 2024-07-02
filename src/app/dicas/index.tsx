import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Dica {
  id: string;
  title: string;
  description: string;
}

const DicasScreen: React.FC = () => {
  const [dicas, setDicas] = useState<Dica[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDicas = async () => {
    try {
      const fetchedDicas: Dica[] = [
        { id: '1', title: 'Economize em energia elétrica', description: 'Desligue os aparelhos da tomada quando não estiverem em uso.' },
        { id: '2', title: 'Planejamento financeiro', description: 'Crie um orçamento mensal e siga-o rigorosamente.' },
        // Adicione mais dicas conforme necessário
      ];
      setDicas(fetchedDicas);
    } catch (error) {
      console.error("Erro ao buscar dicas: ", error);
    }
  };

  useEffect(() => {
    fetchDicas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDicas();
    setRefreshing(false);
  };

  const footerButtons = [
    { icon: 'home', route: '/inicio' },
    { icon: 'bar-chart', route: '/graficos' },
    { icon: 'plus-circle', route: '', onPress: () => console.log('Adicionar item') },
    { icon: 'lightbulb-o', route: '/dicas' },
    { icon: 'cog', route: '/menu' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <View style={styles.menuIcon}>
            <View style={styles.bar}></View>
            <View style={styles.bar}></View>
            <View style={styles.bar}></View>
          </View>
        </TouchableOpacity>
        <Text style={styles.financeSummaryTitle}>Dicas de Finanças</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {dicas.map((dica) => (
          <View key={dica.id} style={styles.dicaBox}>
            <Text style={styles.dicaTitle}>{dica.title}</Text>
            <Text style={styles.dicaDescription}>{dica.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {footerButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.footerButton}
            onPress={button.onPress || (() => router.push(button.route))}
          >
            <FontAwesome name={button.icon} size={32} color="black" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  menuIcon: {
    flexDirection: 'column',
  },
  bar: {
    width: 25,
    height: 3,
    backgroundColor: '#000000',
    marginVertical: 2,
  },
  financeSummaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#000000',
    left: 65
  },
  scrollView: {
    paddingVertical: 20,
    marginTop: 70,
  },
  dicaBox: {
    backgroundColor: '#1E2923',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  dicaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff'
  },
  dicaDescription: {
    fontSize: 16,
    color: '#fff'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#4caf50',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default DicasScreen;
