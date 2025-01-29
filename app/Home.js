import React from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Pressable,
    Image,
    ScrollView,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDocs, collection, getFirestore, query } from "firebase/firestore";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const auth = getAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            console.log("user:", user);
            getFavoriteData(user).then(() => {
                console.log("favorites:", favorites.length);
            });
        });
    }, []);

    async function getFavoriteData(user) {
        const db = getFirestore();
        console.log(user);
        console.log(auth.currentUser);
        if (user === null) {
            console.log("cooked");
            return;
        }
        // get user's favorites
        console.log("getting favorites");
        const querySnapshot = await getDocs(
            collection(db, "users", user.uid, "favorites")
        );
        console.log("GET request sent...");
        console.log(querySnapshot);
        try {
            let tempData = [];
            querySnapshot.forEach((doc) => {
                tempData.push(doc.data());
            });
            setFavorites(tempData);
            console.log("favorites inside:", tempData.length);
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }
    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <Text style={styles.headerText}>Home</Text>
            <Text style={styles.subHeaderText} className={"mb-3"}>
                Favorites
            </Text>
            <FlatList
                data={favorites}
                renderItem={({ item }) => (
                    <ListItem item={item} navigation={navigation} />
                )}
                keyExtractor={(item) => item.id}
                className={"max-h-[400]"}
                onRefresh={() => {
                    setIsLoading(true);
                    getFavoriteData(user);
                    setIsLoading(false);
                }}
                refreshing={isLoading}
            />
            <Text style={styles.subHeaderText}>Your Opportunities</Text>
            <Text className={"mt-2"}>Feature coming soon!</Text>
        </SafeAreaView>
    );
}
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
                className={
                    "flex flex-row bg-white my-2 border-b border-gray-200 pb-2"
                }
            >
                <View className={'w-3/4'}>
                    <Text
                        numberOfLines={2}
                        style={{
                            marginTop: 5,
                            fontWeight: "600",
                            fontSize: "19",
                        }}
                        className={"truncate whitespace-nowrap"}
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
                </View>
                <View className={'w-1/4'}>
                    <Image
                        source={{ uri: "https:" + item.organization.logo }}
                        style={{
                            height: 90,
                            width: 90,
                            resizeMode: "contain",
                            alignSelf: "center",
                        }}
                    />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerText: {
        fontSize: 40,
        fontWeight: "bold",
    },
    subHeaderText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
});
