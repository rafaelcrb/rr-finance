import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { router } from 'expo-router';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

const ConfiguracoesScreen: React.FC = () => {
  const [isProfileEditModalVisible, setProfileEditModalVisible] = useState(false);
  const [isSalaryInsertModalVisible, setSalaryInsertModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email || '');
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData?.name || ''); // Supondo que o campo no Firestore seja 'name'
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleProfileEditModal = () => {
    setProfileEditModalVisible(!isProfileEditModalVisible);
  };

  const toggleSalaryInsertModal = () => {
    setSalaryInsertModalVisible(!isSalaryInsertModalVisible);
  };

  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!isChangePasswordModalVisible);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmação de Logout',
      'Você tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => {
            router.push('/(login)');
            Alert.alert('Logout', 'Você foi desconectado.');
          }
        }
      ],
      { cancelable: false }
    );
  };

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


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Substitua pela URL da imagem de perfil
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={toggleProfileEditModal}>
          <FontAwesome name="pencil" size={20} color="#fff" />
          <Text style={styles.editProfileText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configurações Gerais</Text>
        <TouchableOpacity style={styles.settingsItem} onPress={toggleSalaryInsertModal}>
          <View style={styles.settingsIconWrapper}>
            <FontAwesome name="money" size={20} color="#fff" />
          </View>
          <Text style={styles.settingsText}>Inserir salario</Text>
          <FontAwesome name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={toggleChangePasswordModal}>
          <View style={styles.settingsIconWrapper}>
            <FontAwesome name="lock" size={20} color="#fff" />
          </View>
          <Text style={styles.settingsText}>Alterar senha</Text>
          <FontAwesome name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
          <View style={styles.settingsIconWrapper}>
            <FontAwesome name="sign-out" size={20} color="#fff" />
          </View>
          <Text style={styles.settingsText}>Sair</Text>
          <FontAwesome name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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

      <Modal isVisible={isProfileEditModalVisible} onBackdropPress={toggleProfileEditModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          <TextInput placeholder="Nome" style={styles.input} />
          <TextInput placeholder="Email" style={styles.input} />
          <Button title="Salvar" onPress={toggleProfileEditModal} />
        </View>
      </Modal>

      <Modal isVisible={isSalaryInsertModalVisible} onBackdropPress={toggleSalaryInsertModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Inserir Salário</Text>
          <TextInput placeholder="Salário" style={styles.input} />
          <Button title="Salvar" onPress={toggleSalaryInsertModal} />
        </View>
      </Modal>

      <Modal isVisible={isChangePasswordModalVisible} onBackdropPress={toggleChangePasswordModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alterar Senha</Text>
          <TextInput placeholder="Senha Atual" style={styles.input} secureTextEntry />
          <TextInput placeholder="Nova Senha" style={styles.input} secureTextEntry />
          <Button title="Salvar" onPress={toggleChangePasswordModal} />
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 80,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  settingsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2923',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingsIconWrapper: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
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
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
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

export default ConfiguracoesScreen;
