import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox, Image } from "react-native";

import { initializeApp } from "firebase/app";

import { createStaticNavigation, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./app/Login";
import Home from "./app/Home";
import SignUp from "./app/SignUp";
import Search from "./app/Search";
import Search_LEGACY from "./app/Search_LEGACY";
import Info from "./app/Info";
import { useEffect } from "react";

const SearchStack = createNativeStackNavigator({
  screenOptions:{
    headerShown: false,
  },
  screens: {
    Search: {
      screen: Search,
    },
    Info: {
      screen: Info,
    }
  }
});
const Tabs = createBottomTabNavigator({
  screenOptions:{
    headerShown: false,
    tabBarShowLabel: false,
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        tabBarIcon: (tabInfo) => {
          return (
            <Image source={
              tabInfo.focused ? require('./assets/home-icon-filled.png') : require('./assets/home-icon.png')} style={{resizeMode: 'contain', height: 40, marginTop: 20}}/>
          )
        }
      }
    },
    Search : {
      screen: SearchStack,
      options: {
        tabBarIcon: (tabInfo) => {
          return (
            <Image source={tabInfo.focused ? 
              require('./assets/search-icon-filled.png') : require('./assets/search-icon.png')} style={{resizeMode: 'contain', height: 40, marginTop: 20}}/>
          )
        }
      },
    }
  }
});

const Navigation = createStaticNavigation(Tabs);



export default function App() {
  return (
    <Navigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
