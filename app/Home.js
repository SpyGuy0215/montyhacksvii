import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const [savedOpportunities, setSavedOpportunities] = useState([]);
    const auth = getAuth();
    const db = getFirestore(app);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchSavedOpportunities(user.uid);
            } else {
                setSavedOpportunities([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchSavedOpportunities = async (uid) => {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().savedOpportunities) {
            const savedOpportunities = docSnap.data().savedOpportunities;
            setSavedOpportunities(savedOpportunities);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Info', { item })}>
            <Image source={{ uri: "https:" + item.organization.logo }} style={styles.logo} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.organization}>{item.organization.name}</Text>
                <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Saved Opportunities</Text>
            <FlatList
                data={savedOpportunities}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No saved opportunities yet.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    list: {
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    organization: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});
