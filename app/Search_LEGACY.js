import { set } from "firebase/database";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const API_URL = "https://www.volunteerconnector.org/api/search/";

export default function Search_LEGACY({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("fetching data");
    const fetchData = async () => {
      const f = await fetch(API_URL);
      const response = await f.json();
      setData(response["results"]);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={{ fontWeight: "bold", fontSize: 40 }}>Opportunities</Text>
      {data.length == 0 ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => navigation.navigate('Info', {data: item})}>
                  <Text style={styles.itemStyle}>{item.title}</Text>
                  <Text>
                    {item.description.length < 150
                      ? item.description
                      : item.description.slice(0, 150) + "..."}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#CAD2C5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#B0C4B1",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});