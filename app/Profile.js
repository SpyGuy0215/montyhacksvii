import React, {useState, useEffect} from "react";
import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";


export default function Profile(){
    const navigation = useNavigation();
    const auth = getAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        // check if user is logged in
        if(auth.currentUser === null){
            navigation.navigate("Login");
        }

        const user = auth.currentUser;
        setName(user.displayName);
        setEmail(user.email);

    }, [])

    function handleResetPassword(){
        sendPasswordResetEmail(auth, email)
        .then(() => {
            Alert.alert('Password Reset Email Sent', 'Please check your email to reset your password.');
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
        })
    }

    function handleSignOut(){
        signOut(auth)
        .then(() => {
            navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
        })
    }

    return(
        <SafeAreaView>
            <Text style={styles.header}>{name}</Text>
            <Text style={styles.item}>Email: {email}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleResetPassword()}>
                <Text style={{fontSize: 15, fontWeight: 'bold', alignSelf: 'center'}}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSignOut()}>
                <Text style={{fontSize: 15, fontWeight: 'bold', alignSelf: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 20
    },
    item: {
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#ADEEE3',
        justifyContent: 'center',
        marginTop: 20, 
        marginBottom: 25, 
        height: 40,
        width: '50%',
        borderRadius: 10,
        alignSelf: 'center'
    }
})