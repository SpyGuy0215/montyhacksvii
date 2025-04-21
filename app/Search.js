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
    TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
    getDocs,
    collection,
    getFirestore,
    updateDoc,
    where,
    query,
    orderBy,
    limit,
    startAfter
} from "firebase/firestore";

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

export default function Search({route}) {
    const [data, setData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [sortByMode, setSortByMode] = useState("newest");
    const [locationFilterMode, setLocationFilterMode] = useState("all-locations");

    const navigation = useNavigation();
    const db = getFirestore();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData(continueFetch = false) {
        // fetch compiled data from Firebase
        try {
            const oppRef = collection(db, "opportunities");
            let q; 
            if(continueFetch) {
                const lastDoc = rawData.docs[rawData.docs.length - 1];
                console.log("lastDoc: ");
                console.log(lastDoc);
                q = query(oppRef, orderBy("timeAdded", "desc"), startAfter(lastDoc), limit(10));
            }
            else{
                q = query(oppRef, orderBy("timeAdded", "desc"), limit(10));
            }
            const querySnapshot = await getDocs(q);
            let i = 0;
            let tempData = [];
            if(continueFetch) tempData = data;
            querySnapshot.forEach((doc) => {
                tempData.push(doc.data());
            });
            setRawData(querySnapshot);
            setData(tempData);
            console.log("i: " + i);
        } catch (e) {
            console.log("error: " + e);
        }
    }

    async function repairData() {
        /*
        When data formats need to change, this function can be used to repair the data.
        It goes through every single document in the collection and checks if it has the required fields.
        Note that cleanup of old data is not done here, only the addition of new fields.
        To avoid unnecessary reads/writes, this function should only be run once and AFTER 
        the data has been cleaned up. 
        */


        // check data from firebase for missing fields
        const d = new Date();
        try {
            const querySnapshot = await getDocs(
                collection(db, "opportunities")
            );
            // check if missing field:
            // timeAdded
            // if missing, add it in
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                if (!data.timeAdded) {
                    console.log("updating missing field...");
                    updateDoc(doc.ref, { timeAdded: d.getTime() })
                        .then(() => {
                            console.log("updated doc: ", doc.id);
                        })
                        .catch((error) => {
                            console.log("error updating doc: ", doc.id, error);
                        });
                }
            });
        } catch (e) {
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
                    <View className={"flex-row w-full px-5 mb-6 h-24"}>
                        <TextInput
                            placeholder="Search"
                            className={
                                "w-3/4 border border-slate-300 rounded-lg h-3/5 my-auto p-2 mr-2"
                            }
                        />
                        <Pressable
                            className={
                                "w-1/4 h-3/5 my-auto border border-slate-300 rounded-lg"
                            }
                            onPress={() => {
                                navigation.navigate("FilterModal", {
                                    sortByMode: sortByMode,
                                    locationFilterMode: locationFilterMode,
                                });
                            }}
                        >
                            <Text className={"my-auto mx-auto"}>Filter</Text>
                        </Pressable>
                    </View>
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
                        onEndReached={() => {
                            console.log("end reached");
                            fetchData(true);
                        }}
                        onEndReachedThreshold={0.8}
                        refreshing={refreshing}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

export function FilterModal({route}) {
    const [sortByOpen, setSortByOpen] = useState(false);
    const [sortByValue, setSortByValue] = useState(null);
    const [sortByItems, setSortByItems] = useState([
        { label: "Newest", value: "newest" },
        { label: "Alphabetical Ascending", value: "asc" },
        { label: "Alphabetical Descending", value: "desc" },
    ]);
    const [locationFilterOpen, setLocationFilterOpen] = useState(false);
    const [locationFilterValue, setLocationFilterValue] = useState(null);
    const [locationFilterItems, setLocationFilterItems] = useState([
        { label: "Any Location", value: "all-locations" },
        { label: "In Person", value: "in-person" },
        { label: "Remote", value: "remote" },
    ]);

    useEffect(() => {
        handleIncomingFilterValues();
    }, [])

    function handleIncomingFilterValues() {
        console.log('Handling incoming filter values...');
        const { sortByMode, locationFilterMode } = route.params;
        setSortByValue(sortByMode);
        setLocationFilterValue(locationFilterMode);
    }

    const navigation = useNavigation();
    return (
        <View className={"mt-4 h-full"}>
            <View className={"flex-row h-10 content-between "}>
                <Pressable
                    className={"w-1/3"}
                    onPress={() => {
                        console.log("discard filter");
                        navigation.goBack();
                    }}
                >
                    <Text className={"my-auto mx-auto text-blue-500 text-lg"}>
                        Discard
                    </Text>
                </Pressable>
                <Text
                    className={
                        "w-1/3 my-auto text-xl font-semibold text-center"
                    }
                >
                    Filter
                </Text>
                <Pressable
                    className={"w-1/3 ml-auto"}
                    onPress={() => {
                        console.log("apply filter");
                    }}
                >
                    <Text
                        className={
                            "my-auto mx-auto font-bold text-blue-500 text-lg"
                        }
                    >
                        Apply
                    </Text>
                </Pressable>
            </View>
            <DropDownPicker
                textStyle={{ fontSize: 12 }}
                placeholder="Sort by..."
                className={
                    "mt-10 mb-32 border-slate-300 rounded-lg p-2"
                }
                containerStyle={{ width: '58.333%', marginLeft: '20%'}}
                dropDownContainerStyle={{marginTop: 40}}
                items={sortByItems}
                value={sortByValue}
                open={sortByOpen}
                setOpen={setSortByOpen}
                setValue={setSortByValue}
                setItems={setSortByItems}
            />
            <DropDownPicker
                textStyle={{ fontSize: 12 }}
                placeholder="Location type..."
                className={
                    " border-slate-300 rounded-lg p-2"
                }
                containerStyle={{ width: '58.333%', marginLeft: '20%'}}
                items={locationFilterItems}
                value={locationFilterValue}
                open={locationFilterOpen}
                setOpen={setLocationFilterOpen}
                setValue={setLocationFilterValue}
                setItems={setLocationFilterItems}
            />
        </View>
        
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
