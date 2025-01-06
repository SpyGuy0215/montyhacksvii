import React, { useState } from "react";
import { Text, StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";

export default function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigation = useNavigation();

    function handleSignUp(){
        const auth = getAuth();

        // ensure all fields are filled
        if(name === '' || email === '' || password === '' || retypePassword === ''){
            setError('Please fill out all fields.');
            setShowError(true);
            return;
        }

        if(password !== retypePassword){
            setError('Passwords do not match.');
            setShowError(true);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setError('');
            setShowError(false);
            console.log(userCredential);
            sendEmailVerification(auth.currentUser);
            updateProfile(auth.currentUser, {
                displayName: name
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
            navigation.popTo('Login');
        })
        .catch((error) => {
            console.log(error.code);
            if (error.code === 'auth/email-already-in-use'){
                setError('Email is already in use.');
                setShowError(true);
            }
            else if(error.code === 'auth/invalid-email'){
                setError('Email is invalid.');
                setShowError(true);
            }
            else if(error.code === 'auth/weak-password'){
                setError('Password is too weak.');
                setShowError(true);
            }
            else {
                setError(error.message);
                setShowError(true);
            }
        });
    }

    function togglePasswordVisibility() {
        setPasswordVisible(!passwordVisible);
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior='position' style={styles.innerContainer}>
                <Text style={styles.header}>Sign Up</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Name" onChangeText={(name) => {setName(name)}} textContentType="name"/>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => {setEmail(email)}} textContentType="emailAddress"/>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput style={styles.passwordInput} placeholder="Password" autoCorrect={false} secureTextEntry={!passwordVisible} 
                    onChangeText={(password) => {setPassword(password)}} textContentType="password"/>
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                        <Image source={require('../assets/eye.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput style={styles.passwordInput} placeholder="Retype Password" autoCorrect={false} secureTextEntry={!passwordVisible}
                    onChangeText={(retypePassword) => {setRetypePassword(retypePassword)}} textContentType="password"/>
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                        <Image source={require('../assets/eye.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.errorView}>
                    {showError && <Text style={{color: 'red'}}>{error}</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => handleResetPassword()}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    innerContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 35,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 25
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        width: '90%',
        height: 60,
        alignSelf: 'center',
        marginTop: 30,
        paddingLeft: 8,
    },
    input: {
        flex: 1,
        height: 60,
        paddingLeft: 8,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        width: '90%',
        height: 60,
        alignSelf: 'center',
        marginTop: 30,
        paddingLeft: 8,
    },
    passwordInput: {
        flex: 1,
        height: 60,
    },
    iconContainer: {
        padding: 8,
    },
    icon: {
        width: 24,
        height: 24,
    },
    button: {
        backgroundColor: '#86DEB7',
        width: '90%', // Makes the button wider horizontally
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        borderRadius: 4,
        paddingVertical: 15,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorView: {
        height: 20,
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
