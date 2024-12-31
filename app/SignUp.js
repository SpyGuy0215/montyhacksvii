import React from "react";
import { Text, StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword, validatePassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";

export default function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

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
            })
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
            else if(error.code === 'auth/password-does-not-meet-requirements'){
                validatePassword(auth, password)
                .then((status) => {
                    const minPasswordLength = status.passwordPolicy.customStrengthOptions.minPasswordLength;
                    if(!status.meetsMinPasswordLength){
                        console.log(minPasswordLength);
                        setError(`Password must be at least ${minPasswordLength} characters long.`);
                    }
                    else if(!status.containsNumericCharacter){
                        setError('Password must contain at least one number.');
                    }
                    else if(!status.containsLowercaseLetter){
                        setError('Password must contain at least one lowercase letter.');
                    }
                    else if(!status.containsUppercaseLetter){
                        setError('Password must contain at least one uppercase letter.');
                    }
                    else if(!status.containsSpecialCharacter){
                        setError('Password must contain at least one special character.');
                    }
                })
            }
            setError(errorMessage);
            setShowError(true);
        })
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior='position'>
                <Text style={styles.header}>Sign Up</Text>
                <TextInput style={styles.input} placeholder="Name" onChangeText={(name) => {setName(name)}} textContentType="name"/>
                <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => {setEmail(email)}} textContentType="emailAddress"/>
                <TextInput style={styles.input} placeholder="Password" autoCorrect={false} secureTextEntry={true} 
                onChangeText={(password) => {setPassword(password)}} textContentType="password"/>
                <TextInput style={styles.input} placeholder="Retype Password" autoCorrect={false} secureTextEntry={true}
                onChangeText={(retypePassword) => {setRetypePassword(retypePassword)}} textContentType="password"/>
                <View style={styles.errorView}>
                    {showError && <Text style={{color: 'red'}}>{error}</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={() => handleSignUp()}>
                    <Text style={{fontSize: 20}}>Sign Up!</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 35,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    },
    input:{
        borderWidth: 1, 
        borderRadius: 4,
        width: '90%',
        height: 60, 
        alignSelf: 'center',
        marginTop: 30,
        padding: 8
    },
    button: {
        backgroundColor: '#86DEB7',
        width: '90%',
        height: 60,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        borderRadius: 4
    },
    errorView: {
        height: 20,
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})