import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox, Image } from "react-native";

import { initializeApp } from "firebase/app";

import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./app/Login";
import Home from "./app/Home";
import SignUp from "./app/SignUp";
import Search from "./app/Search";
import Info from "./app/Info";
import { useEffect } from "react";
import Profile from "./app/Profile";

const HomeStack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
    },
    screens: {
        Home: {
            screen: Home,
        },
        Info: {
            screen: Info,
        },
    }
}); 

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

const AuthStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Profile: {
      screen: Profile,
    },
    Login: {
      screen: Login,
    },
    SignUp: {
      screen: SignUp,
    }
  }
})

const Tabs = createBottomTabNavigator({
  screenOptions:{
    headerShown: false,
    tabBarShowLabel: false,
  },
  screens: {
    Home: {
      screen: HomeStack,
      options: {
        tabBarIcon: (tabInfo) => {
          return (
            <Image source={
              tabInfo.focused ? require('./assets/home-icon-filled.png') : require('./assets/home-icon.png')} style={{resizeMode: 'contain', height: 40, marginTop: 20}}/>
          )
        }
      }
    },
    SearchStack : {
      screen: SearchStack,
      options: {
        tabBarIcon: (tabInfo) => {
          return (
            <Image source={tabInfo.focused ? 
              require('./assets/search-icon-filled.png') : require('./assets/search-icon.png')} style={{resizeMode: 'contain', height: 40, marginTop: 20}}/>
          )
        }
      },
    },
    AuthStack: {
      screen: AuthStack,
      options: {
        tabBarIcon: (tabInfo) => {
          return (
            <Image source={tabInfo.focused ? 
              require('./assets/person-icon-filled.png') : require('./assets/person-icon.png')} style={{resizeMode: 'contain', height: 40, marginTop: 20}}/>
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
