import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert,} from 'react-native';
import logo from './../../../assets/imgs/Logo_RRBank.png'
import { router } from 'expo-router';
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; 
import { doc, getFirestore, setDoc } from 'firebase/firestore';

// Função para manipular registro com Firebase
const handleCadastro = async ({ email, senha, nome, contato }: any) => {
  await createUserWithEmailAndPassword(auth, email, senha)
    .then(async userCredential => {
      const user = userCredential.user;
      // Adicionar informações adicionais do usuário no Firestore
      const userRef = doc(getFirestore(), 'usuarios', user.uid);
      await setDoc(userRef, { nome, email, contato });
      router.back()
    })
    .catch(error => Alert.alert('Erro', 'Não foi possível criar a conta!'));
}

const RegisterScreen: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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
        
        <Text style={styles.slogan}>Gerencie suas finanças com facilidade e confiança com o RR-Finance.</Text>
      </View>
      <View style={styles.registerBox}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Criar nova conta</Text>
        <Text style={styles.subtitle}>Já tem registro?</Text>
        <Text onPress={() => router.push('/(login)')} style={styles.loginLink}>Faça login.</Text>
        <Formik
          initialValues={{ nome: '', email: '', contato: '', senha: '' }}
          onSubmit={handleCadastro}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                value={values.nome}
                placeholder="Nome:"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="E-mail:"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                onChangeText={handleChange('contato')}
                onBlur={handleBlur('contato')}
                value={values.contato}
                placeholder="Contato:"
                placeholderTextColor="#ccc"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('senha')}
                  onBlur={handleBlur('senha')}
                  value={values.senha}
                  placeholder="Senha:"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
                  <Text style={styles.togglePassword}>
                    {isPasswordVisible ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.buttonRegistrar} onPress={handleSubmit as any}>
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            
              <TouchableOpacity style={styles.buttonVoltar} onPress={router.back}>
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    flexDirection: 'column',
  },
  bar: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
  },
  slogan: {
    padding: 10,
    color: '#fff',
    fontSize: 16,
  },
  registerBox: {
    marginTop: 80,
    backgroundColor: '#2d2d2d',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15
  },
  subtitle: {
    color: '#4caf50',
    marginBottom: 5,
  },
  loginLink: {
    color: '#4caf50',
    marginBottom: 15
  },
  input: {
    width: 300,
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#3d3d3d',
    color: '#fff',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  togglePassword: {
    color: '#ccc',
    fontSize: 18,
  },
  buttonRegistrar: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 10,
    width: 150,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  buttonVoltar: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 10,
    width: 150,
    alignSelf: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegisterScreen;
