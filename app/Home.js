import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {

    function getSubscriptionData(){
        // Gets the opportunities the user is subscribed to
        // to be used in the FlatList display
        
        // TODO: Implement this function
    }
    return(
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={getSubscriptionData}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#edeeed",
        alignItems: "center",
        justifyContent: "center",
    },
})