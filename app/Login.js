import React from "react";
import { useState } from "react";
import { Alert, Text, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import app from '../firebaseConfig'
import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

export default function Login(){
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    function handleLogin(){
        const auth = getAuth(); 
        if(email === '' || password === ''){
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError('Please fill out all fields.');
            setShowError(true);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
            if(!userCredential.user.emailVerified){
                setError('Please verify your email.');
                setShowError(true);
                signOut(auth);
                return;
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            navigation.popToTop();
        })
        .catch((error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.log(error.code);
            if(error.code === 'auth/invalid-credential'){
                setError('Invalid credentials.');
                setShowError(true);
            }
            else if(error.code === 'auth/too-many-requests'){
                setError('Too many requests. Please try again later.');
                setShowError(true); 
            }
        })
    }

    function handleResetPassword(){
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            Alert.alert('Password Reset Email Sent', 'Please check your email to reset your password.');
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
        })
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Civic Union</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => {setEmail(email)}}/>
            <TextInput style={styles.input} placeholder="Password" autoCorrect={false} secureTextEntry={true} onChangeText={(pwd) => {setPassword(pwd)}}/>
            <View style={styles.errorView}>
                {showError && <Text style={{color: 'red'}}>{error}</Text>}
            </View>
            <TouchableOpacity style={styles.button} onPress={() =>{
                handleLogin();
            }}>
                <Text style={{fontSize: 20}}>Login</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{color: '#007BFF'}}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleResetPassword()}>
                <Text style={{fontSize: 15, fontWeight: 'bold', alignSelf: 'center'}}>Reset Password</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 45,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 35
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