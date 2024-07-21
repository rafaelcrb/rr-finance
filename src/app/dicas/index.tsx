import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Dica {
  id: string;
  title: string;
  description: string;
}

const fetchedDicas: Dica[] = [
  { id: '1', title: 'Economize em energia elétrica', description: 'Desligue os aparelhos da tomada quando não estiverem em uso.' },
  { id: '2', title: 'Planejamento financeiro', description: 'Crie um orçamento mensal e siga-o rigorosamente.' },
  { id: '3', title: 'Registre suas despesas', description: 'Mantenha um registro detalhado de todas as suas despesas diárias, mensais e anuais.' },
  { id: '4', title: 'Pague suas dívidas', description: 'Priorize o pagamento de suas dívidas para evitar juros altos.' },
  { id: '5', title: 'Evite compras por impulso', description: 'Planeje suas compras e evite gastar em coisas desnecessárias.' },
  { id: '6', title: 'Faça um fundo de emergência', description: 'Reserve uma quantia para imprevistos, como consertos de carro ou emergências médicas.' },
  { id: '7', title: 'Invista em educação financeira', description: 'Leia livros e participe de cursos sobre finanças pessoais.' },
  { id: '8', title: 'Compare preços', description: 'Antes de fazer uma compra, compare preços em diferentes lojas para garantir que você está obtendo o melhor valor.' },
  { id: '9', title: 'Use aplicativos de finanças', description: 'Utilize aplicativos para monitorar suas finanças e manter o controle de suas despesas.' },
  { id: '10', title: 'Defina metas financeiras', description: 'Estabeleça metas claras, como comprar uma casa, viajar ou se aposentar mais cedo.' },
  { id: '11', title: 'Reveja assinaturas e serviços', description: 'Verifique suas assinaturas mensais e cancele aquelas que você não utiliza.' },
  { id: '12', title: 'Faça um orçamento familiar', description: 'Inclua todos os membros da família no planejamento financeiro para garantir que todos estão comprometidos com as metas financeiras.' },
];

const DicasScreen: React.FC = () => {
  const [dicas, setDicas] = useState<Dica[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDicas = async () => {
    try {
      // Seleciona uma dica diferente a cada dia
      const today = new Date().getDate();
      const dicaDoDia = fetchedDicas[today % fetchedDicas.length];
      setDicas([dicaDoDia]);
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
