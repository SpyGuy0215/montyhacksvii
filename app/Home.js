import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export default function Home() {
    const auth = getAuth();

    useEffect(() => {
        getFavoriteData();
    }, [])

    async function getFavoriteData(){   
        const user = auth.currentUser;
    }
    return(
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} >
            <Text style={styles.headerText}>Home</Text>
            <Text style={styles.subHeaderText}>Favorites</Text>
            <Text style={styles.subHeaderText}>Your Opportunities</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20
    },
    headerText:{
        fontSize: 40,
        fontWeight: 'bold'
    },
    subHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20
    }
})