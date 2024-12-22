import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function BottomNavBar() {
  const [selected, setSelected] = useState(0); // 0 is home, 1 is search, 2 is profile
  const [homeIcon, setHomeIcon] = useState(
    require("../../assets/home-icon.png")
  );
  const [searchIcon, setSearchIcon] = useState(
    require("../../assets/search-icon.png")
  );
  const [profileIcon, setProfileIcon] = useState(
    require("../../assets/person-icon.png")
  );
  const [selectionPos, setSelectionPos] = useState("center");

  useEffect(() => {}, []);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <BlurView
        style={{
          overflow: "hidden",
          borderRadius: 30,
          marginBottom: 30,
          paddingBottom: 5,
          paddingLeft: 20,
          paddingRight: 20,
          borderWidth: 0.17,
        }}
        intensity={100}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/home-icon.png")}
            style={styles.menuItem}
          />
          <Image
            source={require("../../assets/search-icon-filled.png")}
            style={styles.menuItem}
          />
          <Image
            source={require("../../assets/person-icon.png")}
            style={styles.menuItem}
          />
        </View>
        <View
          style={styles.selectorContainer}
        >
          <View
            style={{
              backgroundColor: "black",
              height: 4,
              width: 20,
              borderWidth: 1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          ></View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    width: 45,
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: "red",
    width: 30,
    alignSelf: "center",
    width: 170,
  },
});
