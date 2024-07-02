import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const GraficoScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [despesas, setDespesas] = useState<number[]>([]);
  const [salario, setSalario] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(2);
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const router = useRouter();

  const fetchData = async (monthIndex: number | null = 2) => {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

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

      const totalGastos = monthlyExpenses.reduce((acc, curr) => acc + curr, 0);
      setGastos(totalGastos);

      const calculatedSaldo = totalSalario - totalGastos;
      setSaldo(calculatedSaldo);

      if (monthIndex !== null && monthIndex >= 0 && monthIndex < 3) {
        setGastos(monthlyExpenses[monthIndex]);
        setSaldo((totalSalario / 3) - monthlyExpenses[monthIndex]);
      }

    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    }
  };

  useEffect(() => {
    fetchData(selectedMonthIndex);
  }, [selectedMonthIndex]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const handleAddOption = (option: string) => {
    setModalVisible(false);
    if (option === 'despesa') {
      router.push('/despesas');
    } else if (option === 'receita') {
      router.push('/receitas');
    }
  };

  const handleMonthSelect = (itemValue: number) => {
    setSelectedMonthIndex(itemValue);
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

  const pieData = despesas.map((value, index) => ({
    name: getMonthLabels()[index],
    population: value,
    color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
    legendFontColor: '#FFFFFF',
    legendFontSize: 15,
  }));

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
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
              yAxisLabel="R$"
              yAxisSuffix=""
              yLabelsOffset={0}
              
            />
          ) : (
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          )}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
          >
            <Text style={styles.switchButtonText}>
              {chartType === 'bar' ? 'Ver Gráfico de Pizza' : 'Ver Gráfico de Barras'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Selecionar Mês:</Text>
          <RNPickerSelect
            onValueChange={(value) => handleMonthSelect(value)}
            items={getMonthLabels().map((label, index) => ({ label, value: index }))}
            style={{
              inputIOS: { color: '#FFFFFF' },
              inputAndroid: { color: '#FFFFFF' },
            }}
          />

        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.totalLabel}>Salário: R$ {salario.toFixed(2)}</Text>
          <Text style={styles.totalLabel}>Gastos: R$ {gastos.toFixed(2)}</Text>
          <Text style={[styles.totalLabel, { color: saldoCor }]}>Saldo: R$ {saldo.toFixed(2)}</Text>
          {saldo < 0 && (
            <View style={styles.alertBox}>
              <FontAwesome name="exclamation-circle" size={24} color="red" />
              <Text style={styles.alertText}>Seu saldo está negativo!</Text>
            </View>
          )}
        </View>
    
      <View style={styles.footer}>
        {footerButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => button.route ? router.push(button.route) : button.onPress?.()}
            style={styles.footerButton}
          >
            <FontAwesome name={button.icon} size={30} color="black" />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={() => handleAddOption('despesa')}>
            <Text style={styles.modalOptionText}>Adicionar Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => handleAddOption('receita')}>
            <Text style={styles.modalOptionText}>Adicionar Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOptionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    padding: 10,
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
    padding: 10,
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
   
    
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  chart: {
    borderRadius: 16,
    
  },
  switchButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1E2923',
    borderRadius: 10,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  summaryBox: {
    backgroundColor: '#1E2923',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  alertText: {
    color: 'red',
    marginLeft: 10,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalOption: {
    backgroundColor: '#1E2923',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default GraficoScreen;