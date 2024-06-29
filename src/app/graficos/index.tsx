import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const GraficoScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [despesas, setDespesas] = useState<number[]>([]);
  const [salario, setSalario] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);
  const [fixos, setFixos] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 2);

      // Fetch despesas
      const despesasCollection = collection(db, 'despesas');
      const despesasQuery = query(
        despesasCollection,
        where('date', '>=', Timestamp.fromDate(threeMonthsAgo)),
        where('date', '<=', Timestamp.fromDate(now))
      );
      const despesasSnapshot = await getDocs(despesasQuery);
      const despesasList = despesasSnapshot.docs.map(doc => doc.data()) as { valor: string; date: Timestamp }[];

      const monthlyExpenses = [0, 0, 0];
      despesasList.forEach(despesa => {
        const date = despesa.date.toDate();
        const monthDiff = now.getMonth() - date.getMonth();
        if (monthDiff >= 0 && monthDiff < 3) {
          monthlyExpenses[2 - monthDiff] += parseFloat(despesa.valor);
        }
      });
      setDespesas(monthlyExpenses);

      // Fetch receitas (salario)
      const receitasCollection = collection(db, 'receitas');
      const receitasQuery = query(
        receitasCollection,
        where('date', '>=', Timestamp.fromDate(threeMonthsAgo)),
        where('date', '<=', Timestamp.fromDate(now))
      );
      const receitasSnapshot = await getDocs(receitasQuery);
      const receitasList = receitasSnapshot.docs.map(doc => doc.data()) as { valor: string }[];

      let totalSalario = 0;
      receitasList.forEach(receita => {
        totalSalario += parseFloat(receita.valor);
      });
      setSalario(totalSalario);

      // Fetch despesas fixas
      const despesasFixasCollection = collection(db, 'despesasfixas');
      const despesasFixasQuery = query(despesasFixasCollection);
      const despesasFixasSnapshot = await getDocs(despesasFixasQuery);
      const despesasFixasList = despesasFixasSnapshot.docs.map(doc => doc.data()) as { valor: string }[];

      let totalFixos = 0;
      despesasFixasList.forEach(despesaFixa => {
        totalFixos += parseFloat(despesaFixa.valor);
      });
      setFixos(totalFixos);

      // Calculate total gastos
      const totalGastos = monthlyExpenses.reduce((acc, curr) => acc + curr, 0);
      setGastos(totalGastos);

      // Calculate saldo
      const calculatedSaldo = totalSalario - totalGastos - totalFixos;
      setSaldo(calculatedSaldo);

    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOption = (option: string) => {
    setModalVisible(false);
    if (option === 'despesa') {
      router.push('/despesas');
    } else if (option === 'receita') {
      router.push('/receitas');
    }
  };

  const footerButtons = [
    { icon: 'home', route: '/inicio' },
    { icon: 'bar-chart', route: '/graficos' },
    { icon: 'plus-circle', route: '', onPress: () => setModalVisible(true) },
    { icon: 'lightbulb-o', route: '/dicas' },
    { icon: 'cog', route: '/menu' },
  ];

  const getMonthLabels = (): string[] => {
    const now = new Date();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonth = now.getMonth();

    return [
      months[(currentMonth - 2 + 12) % 12],
      months[(currentMonth - 1 + 12) % 12],
      months[currentMonth]
    ];
  };

  const data = {
    labels: getMonthLabels(),
    datasets: [
      {
        data: despesas
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const saldoCor = saldo >= 0 ? 'green' : 'red';

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
        <Text style={styles.financeSummaryTitle}>Gráfico Financeiro</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Últimos 3 meses</Text>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.totalLabel}>Salário: R$ {salario.toFixed(2)}</Text>
        <Text style={styles.totalLabel}>Gastos: R$ {gastos.toFixed(2)}</Text>
        <Text style={styles.totalLabel}>Fixos: R$ {fixos.toFixed(2)}</Text>
        <Text style={[styles.totalLabel, { color: saldoCor }]}>Saldo: R$ {saldo.toFixed(2)}</Text>
        {saldo < 0 && (
          <View style={styles.alertBox}>
            <FontAwesome name="exclamation-circle" size={24} color="red" />
            <Text style={styles.alertText}>Alerta ligado, seu estado financeiro é deplorável, reveja seus gastos e melhore suas finanças.</Text>
          </View>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleAddOption('despesa')}>
              <Text style={styles.modalButtonText}>Adicionar Despesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleAddOption('receita')}>
              <Text style={styles.modalButtonText}>Adicionar Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#1d1d1d',
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
    borderBottomRightRadius: 20,
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
  chartContainer: {
    marginTop: 70,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  saldoPositivo: {
    color: 'green',
  },
  saldoNegativo: {
    color: 'red',
  },
  alertBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    color: 'red',
    marginLeft: 10,
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GraficoScreen;
