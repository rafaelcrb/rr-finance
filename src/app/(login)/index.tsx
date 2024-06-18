import * as React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Button, } from 'react-native';
import logo from './../../../assets/imgs/Logo_RRBank.png'
import Icon from 'react-native-vector-icons/AntDesign'
import { router } from 'expo-router';
import { Formik } from "formik";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';



export interface TelaLoginProps {
}

export default function TelaLogin(props: TelaLoginProps) {

    //VARIAVEIS

    const alterarSenha = () =>
        Alert.alert('Confirmação!', 'Deseja Alterar Sua Senha?', [
            {
                text: 'SIM',
                onPress: () => console.log('Alterar Senha: SIM'),
                style: 'cancel',
            },
            { text: 'NÃO', onPress: () => console.log('Alterar Senha: NÃO') },
        ]);

    const handleLogin = async ({ email, senha }: any) => {

        await signInWithEmailAndPassword(auth, email, senha)
            .then(usuario => router.replace('/inicio'))
            .catch(erro => Alert.alert('Erro', 'Login ou senha incorreta!'));
    }


    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
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
            <View style={styles.loginBox}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>Conecte-se</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
                <Formik
                    initialValues={{ email: '', senha: '' }}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleSubmit, isSubmitting }) => (
                        <View>
                            <Text style={{ marginBottom: 5, fontWeight: 'bold', color:"#fff"}}>Login:</Text>
                            
                            <TextInput onChangeText={handleChange('email')} style={[styles.input]} placeholder="E-mail:" />
                            
                            <View style={styles.passwordContainer}>
                                <TextInput onChangeText={handleChange('senha')} style={styles.input} secureTextEntry={!isPasswordVisible} placeholder="Senha:" />
                                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
                                    <Text style={styles.togglePassword}>
                                        {isPasswordVisible ? '🙈' : '👁️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
                                <Text style={styles.buttonText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                <View style={styles.links}>
                    <TouchableOpacity onPress={alterarSenha}>
                        <Text style={styles.linkText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/cadastro')}>
                        <Text style={styles.linkText}>Cadastre-se!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>









    );
}

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
    loginBox: {
        marginTop: 120,
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
    },
    subtitle: {
        color: '#4caf50',
        marginBottom: 20,
    },
    input: {
        width: 300,
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
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
        top: 7,
    },
    togglePassword: {
        color: '#ccc',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 10,
        width: 220,
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    links: {
        flexDirection: 'column',
        marginTop: 20,
        alignItems: 'center'
    },
    linkText: {
        color: '#4caf50',
        marginHorizontal: 10,
        margin: 5
    },
    texto: {
        padding: 8,
        backgroundColor: '#BDF8E2',
        width: 315,
        height: 70,
        fontSize: 14,
        borderRadius: 15,
        shadowOpacity: 0.2
    },

});