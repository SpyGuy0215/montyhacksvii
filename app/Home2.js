import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { Image, Button, Text, Icon } from "@rneui/themed";
import {useRoute} from '@react-navigation/native';

import app from "../firebaseConfig";
import {collection, doc, getDoc, getFirestore} from 'firebase/firestore';
import { useState } from "react";

export default function Home2({ navigation }) {
  const route = useRoute();
  const user = route.params?.user;
  const [stuffdata, setData] = useState({});
  const db = getFirestore(app);

  useEffect(() => {
    let docSnap = [];
    const docRef = doc(db, "users", user.uid);
    const fetchData = async () => {
      docSnap = await getDoc(docRef);
      await setData(docSnap.data());
    }
    fetchData()
    .then(() => {
      setData(docSnap.data())
      console.log(stuffdata)
      console.log('^^^')
    })
  }, []);

  return (
    <View style={{ flex: 1, alignContent: 'space-between', padding: 10, backgroundColor: '#CAD2C5'}}>
    <ListedOpportunities navigation={navigation} text="Are you passionate about photography and interested in the events at the Reynolds Museum? This volunteer opportunity allows you to expand your skills as a photographer/videographer and capture the magic of each event taking place at the Reynolds Museum!"/>
    <ListedOpportunities navigation={navigation} text="Active volunteer position in a non-profit faith-based Thrift Store. Sometimes working in production sorting and pricing donations. Other times working in the front of store placing merchandise on the racks and shelves. Opportunity to interact with customers." />
    <ListedOpportunities navigation={navigation} text="Frontline volunteer position that interacts directly with our donors. Receive and sort donations as soon as they arrive. Greet and thank the donors with a smile reminding them what a difference their donation will make in the lives of others." />
    <View style={{flex: 1}}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Search", {uid: user.uid})} >
        <Icon name="search" color="white"></Icon>
      </TouchableOpacity>
    </View>
    </View>
  );
}

function ListedOpportunities({ navigation, text}) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('Info')}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.itemStyle}>{text}</Text>
                <Text>{text}</Text>
                </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
  },
  listItem: {
    flex: 1, 
    borderColor: 'black', 
    borderWidth: 1, 
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#84A98C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
    marginTop: 40
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
