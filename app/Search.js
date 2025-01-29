import React, { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ScrollView,
    Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getDocs, collection, getFirestore, updateDoc } from "firebase/firestore";

const API_LIST = [
    {
        url: "https://www.volunteerconnector.org/api/search/",
        name: "Volunteer Connector",
        schema: "volunteerconnector",
        searchLinkDepth: 10,
    },
];

function ListItem({ item, navigation }) {
    return (
        <View style={styles.item}>
            <Pressable
                onPress={() => {
                    Haptics.selectionAsync();
                    navigation.navigate("Info", {
                        item: item,
                    });
                }}
            >
                <Image
                    source={{ uri: "https:" + item.organization.logo }}
                    style={{
                        width: 256,
                        height: 100,
                        resizeMode: "contain",
                        alignSelf: "center",
                    }}
                />
                <Text
                    style={{ marginTop: 5, fontWeight: "600", fontSize: "22" }}
                >
                    {item.title}
                </Text>
                <Text
                    style={{
                        marginLeft: 2,
                        marginTop: 2,
                        fontWeight: "400",
                        fontSize: "12",
                    }}
                >
                    {item.organization.name}
                </Text>
            </Pressable>
        </View>
    );
}

export default function Search() {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();
    const db = getFirestore();

    useEffect(() => {
        fetchData();    
    }, []);

    async function fetchData() {
        // fetch compiled data from Firebase
        try {
            const querySnapshot = await getDocs(
                collection(db, "opportunities")
            );
            let i = 0;
            let tempData = [];
            querySnapshot.forEach((doc) => {
                tempData.push(doc.data());
            });
            setData(tempData);
            console.log("i: " + i);
            
        } catch (e) {
            console.log("error: " + e);
        }
    }
    
    async function repairData(){
        // check data from firebase for missing fields
        const d = new Date(); 
        try{
            const querySnapshot = await getDocs(collection(db, "opportunities"));
            // check if missing field:
            // timeAdded
            // if missing, add it in
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                if (!data.timeAdded) {
                    console.log('updating missing field...')
                    updateDoc(doc.ref, {timeAdded: d.getTime()})
                    .then(() => { 
                        console.log('updated doc: ', doc.id);
                    })
                    .catch((error) => {
                        console.log('error updating doc: ', doc.id, error);
                    })
                }
            });
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                width: "100%",
            }}
            edges={["top", "right", "left"]}
        >
            {data.length == 0 ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <FlatList
                        style={{ flex: 1, width: "93%", marginLeft: 1 }}
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <>
                                <ListItem item={item} navigation={navigation} />
                                <View
                                    style={{
                                        borderBottomColor: "lightgray",
                                        borderBottomWidth: 1.2,
                                    }}
                                />
                            </>
                        )}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchData()
                                .then(() => {
                                    setRefreshing(false);
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }}
                        refreshing={refreshing}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

styles = StyleSheet.create({
    item: {
        backgroundColor: "white",
        width: "100%",
        height: "fit",
        marginTop: 12,
        marginBottom: 12,
    },
});
