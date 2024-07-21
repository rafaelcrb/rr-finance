import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, RefreshControl, Modal, TextInput, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Item {
  id: string;
  description: string;
  valor: string;
  date: Timestamp;
  [key: string]: any;
}

interface Section {
  title: string;
  data: Item[];
  total: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  startPeriod: string;
  endPeriod: string;
  onPressPeriod: (isStart: boolean) => void;
}

const InicioScreen: React.FC = () => {
  const [despesas, setDespesas] = useState<Item[]>([]);
  const [receitas, setReceitas] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [despesaStartPeriodo, setDespesaStartPeriodo] = useState<moment.Moment | null>(moment().subtract(1, 'months').startOf('month'));
  const [despesaEndPeriodo, setDespesaEndPeriodo] = useState<moment.Moment | null>(moment().endOf('month'));
  const [receitaStartPeriodo, setReceitaStartPeriodo] = useState<moment.Moment | null>(moment().subtract(1, 'months').startOf('month'));
  const [receitaEndPeriodo, setReceitaEndPeriodo] = useState<moment.Moment | null>(moment().endOf('month'));
  const [isDespesaResumoExpandido, setIsDespesaResumoExpandido] = useState(true);
  const [isReceitaResumoExpandido, setIsReceitaResumoExpandido] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState<{ tipo: string; isStart: boolean }>({ tipo: '', isStart: false });
  const router = useRouter();




  const fetchData = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error('Usuário não está logado!');
      return;
    }

    const uid = user.uid;


    try {
      console.log('Atualizando...');
      const despesasCollection = collection(db, `usuarios/${uid}/despesas`);
      const despesasQuery = query(despesasCollection, where('date', '>=', despesaStartPeriodo!.toDate()), where('date', '<=', despesaEndPeriodo!.toDate()));
      const despesasSnapshot = await getDocs(despesasQuery);
      const despesasList = despesasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
      setDespesas(despesasList);

      const receitasCollection = collection(db, `usuarios/${uid}/receitas`);
      const receitasQuery = query(receitasCollection, where('date', '>=', receitaStartPeriodo!.toDate()), where('date', '<=', receitaEndPeriodo!.toDate()));
      const receitasSnapshot = await getDocs(receitasQuery);
      const receitasList = receitasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
      setReceitas(receitasList);
      console.log('Dados atualizado com sucesso!.');
    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [despesaStartPeriodo, despesaEndPeriodo, receitaStartPeriodo, receitaEndPeriodo]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const calculateTotal = (items: Item[]) => {
    return items.reduce((total, item) => total + parseFloat(item.valor), 0).toFixed(2);
  };

  const calculatePercentages = (items: Item[], total: number) => {
    return items.map(item => ({
      ...item,
      percentage: ((parseFloat(item.valor) / total) * 100).toFixed(2)
    }));
  };

  const totalDespesas = parseFloat(calculateTotal(despesas));
  const totalReceitas = parseFloat(calculateTotal(receitas));

  const despesasWithPercentages = calculatePercentages(despesas, totalDespesas);
  const receitasWithPercentages = calculatePercentages(receitas, totalReceitas);

  const footerButtons = [
    { icon: 'home', route: '/inicio' },
    { icon: 'bar-chart', route: '/graficos' },
    { icon: 'plus-circle', route: '', onPress: () => setModalVisible(true) },
    { icon: 'lightbulb-o', route: '/dicas' },
    { icon: 'cog', route: '/menu' },
  ];

  const handleAddOption = (option: string) => {
    setModalVisible(false);
    if (option === 'despesa') {
      router.push('/despesas');
    } else if (option === 'receita') {
      router.push('/receitas');
    }
  };

  const user = auth.currentUser;

    if (!user) {
      console.error('Usuário não está logado!');
      return;
    }

    const uid = user.uid;

  const handleDeleteDespesa = async (id: string, tipo: string) => {
    const collectionName = tipo === 'despesa' ? 'receitas' : `usuarios/${uid}/despesas`;
    await deleteDoc(doc(db, collectionName, id));
    await fetchData();
  };

  const handleDeleteReceita = async (id: string, tipo: string) => {
    const collectionName = tipo === 'despesa' ? 'despesas' :`usuarios/${uid}/receitas`;
    await deleteDoc(doc(db, collectionName, id));
    await fetchData();
  };

  const handleEditDespesa = async () => {
    if (selectedItem) {
      const collectionName = selectedItem.dateType === 'despesa' ? 'receitas' : `usuarios/${uid}/despesas`;
      const itemDoc = doc(db, collectionName, selectedItem.id);
      await updateDoc(itemDoc, {
        description: selectedItem.description,
        valor: selectedItem.valor,
      });
      await fetchData();
      setEditModalVisible(false);
    }
  };

  const handleEditReceita = async () => {
    if (selectedItem) {
      const collectionName = selectedItem.dateType === 'despesa' ? 'despesas' : `usuarios/${uid}/receitas`;
      const itemDoc = doc(db, collectionName, selectedItem.id);
      await updateDoc(itemDoc, {
        description: selectedItem.description,
        valor: selectedItem.valor,
      });
      await fetchData();
      setEditModalVisible(false);
    }
  };

  const showDatePicker = (tipo: string, isStart: boolean) => {
    setDatePickerVisible({ tipo, isStart });
  };

  const hideDatePicker = () => {
    setDatePickerVisible({ tipo: '', isStart: false });
  };

  const handleConfirm = (date: Date) => {
    const selectedDate = moment(date);
    if (datePickerVisible.tipo === 'despesa') {
      datePickerVisible.isStart ? setDespesaStartPeriodo(selectedDate) : setDespesaEndPeriodo(selectedDate);
    } else if (datePickerVisible.tipo === 'receita') {
      datePickerVisible.isStart ? setReceitaStartPeriodo(selectedDate) : setReceitaEndPeriodo(selectedDate);
    }
    hideDatePicker();
  };

  const sections: Section[] = [
    {
      title: 'Despesas',
      data: isDespesaResumoExpandido ? despesasWithPercentages : [],
      total: totalDespesas.toFixed(2),
      isExpanded: isDespesaResumoExpandido,
      onToggleExpand: () => setIsDespesaResumoExpandido(!isDespesaResumoExpandido),
      startPeriod: despesaStartPeriodo ? despesaStartPeriodo.format('DD/MM/YYYY') : '',
      endPeriod: despesaEndPeriodo ? despesaEndPeriodo.format('DD/MM/YYYY') : '',
      onPressPeriod: (isStart: boolean) => showDatePicker('despesa', isStart),
    },
    {
      title: 'Receitas',
      data: isReceitaResumoExpandido ? receitasWithPercentages : [],
      total: totalReceitas.toFixed(2),
      isExpanded: isReceitaResumoExpandido,
      onToggleExpand: () => setIsReceitaResumoExpandido(!isReceitaResumoExpandido),
      startPeriod: receitaStartPeriodo ? receitaStartPeriodo.format('DD/MM/YYYY') : '',
      endPeriod: receitaEndPeriodo ? receitaEndPeriodo.format('DD/MM/YYYY') : '',
      onPressPeriod: (isStart: boolean) => showDatePicker('receita', isStart),
    },
  ];

  const handleItemPress = (item: Item, sectionTitle: string) => {
    setSelectedItem({ ...item, dateType: sectionTitle.toLowerCase() });
    setEditModalVisible(true);
  };

  const saldoCor = totalReceitas - totalDespesas >= 0 ? 'green' : 'red';

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
        <Text style={styles.financeSummaryTitle}>Resumo de Finanças</Text>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.totalLabel}>Total Despesas: </Text>
        <Text style={styles.totalValue}>R$ {totalDespesas.toFixed(2)}</Text>
        <Text style={styles.totalLabel}>Total Receitas: </Text>
        <Text style={styles.totalValue}>R$ {totalReceitas.toFixed(2)}</Text>
        <Text style={[styles.totalLabel, { color: saldoCor }]}>
          {totalReceitas - totalDespesas >= 0 ? 'Saldo Positivo: ' : 'Saldo Negativo: '}R$ {(totalReceitas - totalDespesas).toFixed(2)}
        </Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section }) => (
          <TouchableOpacity onPress={() => handleItemPress(item, section.title)} style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
              <Text style={styles.itemText}>{item.percentage}%</Text>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => (
          <TouchableWithoutFeedback onPress={section.onToggleExpand}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionPeriod}>
                {section.startPeriod} - {section.endPeriod}
              </Text>
              <TouchableOpacity onPress={() => section.onPressPeriod(true)}>
                <Ionicons name="calendar" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => section.onPressPeriod(false)}>
                <Ionicons name="calendar" size={20} color="black" />
              </TouchableOpacity>
              <Ionicons
                name={section.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

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

      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Item</Text>
            {selectedItem && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Descrição"
                  value={selectedItem.description}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Valor"
                  value={selectedItem.valor}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, valor: text })}
                />

                {selectedItem.dateType === 'despesas' ? (
                  <>
                    <TouchableOpacity style={styles.modalButton} onPress={handleEditDespesa}>
                      <Text style={styles.modalButtonText}>Salvar Despesa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        Alert.alert(
                          'Confirmação',
                          'Você tem certeza que deseja excluir esta despesa?',
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Excluir',
                              style: 'destructive',
                              onPress: async () => {
                                if (selectedItem) {
                                  await handleDeleteDespesa(selectedItem.id, selectedItem.dateType);
                                  setEditModalVisible(false);
                                }
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.modalButtonText}>Excluir Despesa</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.modalButton} onPress={handleEditReceita}>
                      <Text style={styles.modalButtonText}>Salvar Receita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        Alert.alert(
                          'Confirmação',
                          'Você tem certeza que deseja excluir esta receita?',
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Excluir',
                              style: 'destructive',
                              onPress: async () => {
                                if (selectedItem) {
                                  await handleDeleteReceita(selectedItem.id, selectedItem.dateType);
                                  setEditModalVisible(false);
                                }
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.modalButtonText}>Excluir Receita</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity style={styles.modalButton} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>


      <DateTimePickerModal
        isVisible={!!datePickerVisible.tipo}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
  summaryBox: {
    backgroundColor: '#1E2923',
    borderRadius: 10,
    padding: 20,
    marginTop: 70,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff'
  },
  totalValue: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff'
  },
  saldoPositivo: {
    color: 'green',
  },
  saldoNegativo: {
    color: 'red',
  },
  sectionHeader: {
    backgroundColor: '#A9A9A9',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionPeriod: {
    fontSize: 14,
  },
  item: {
    backgroundColor: '#1E2923',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    color: '#fff'
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
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
  input: {
    backgroundColor: '#E1D9D1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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


});

export default InicioScreen;
