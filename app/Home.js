import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { Image, Button, Text, Icon } from "@rneui/themed";
import { useRoute } from "@react-navigation/native";

import app from "../firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState } from "react";

export default function Home({ navigation }) {
  const route = useRoute();
  const user = route.params?.user;
  const [stuffdata, setData] = useState({});
  const db = getFirestore(app);

  useEffect(() => {
    let docSnap = [];
    const docRef = doc(db, "users", user.uid);
    const fetchData = async () => {
      docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      await setData(docSnap.data());
    };
    fetchData().then(() => {
      setData(docSnap.data());
      console.log(stuffdata);
      console.log("^^^");
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignContent: "space-between",
        padding: 10,
        backgroundColor: "#CAD2C5",
      }}
    >
      {/* <FlatList
            data={[stuffdata]}
            keyExtractor={(item) => item.starredOpportunities[34302].description}
            renderItem={({ item }) => (
              <View styles={{flex: 1}}>
                <Text>Hello</Text>
              </View>
            )}
      /> */}
      <FlatList
        data={() => {
          let docSnap = [];
          const docRef = doc(db, "users", user.uid);
          const fetchData = async () => {
            docSnap = await getDoc(docRef);
            console.log(docSnap.data());
            const returnThing = await docSnap.data().starredOpportunities[34302].description;
            return returnThing; 
          };
          console.log(fetchData());
          console.log("^^^")
          return [fetchData()/starredOpportunities[34302].description];
        }}
        keyExtractor={(item) => item.starredOpportunities[34302].description}
        renderItem={({ item }) => (
          <View styles={{ flex: 1 }}>
            <Text>Hello</Text>
          </View>
        )}
      />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Search", { uid: user.uid })}
        >
          <Icon name="search" color="white"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListedOpportunities({ navigation, text }) {
  return (
    <TouchableOpacity
      style={styles.listItem}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.itemStyle}>{text}</Text>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    flexDirection: "row",
    flex: 1,
    borderWidth: 1,
  },
  listItem: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#84A98C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 100,
    backgroundColor: "#2F3E46",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 40,
  },
});
