import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";

import { initializeApp } from "firebase/app";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./app/Login";
import Home from "./app/Home";
import Home2 from "./app/Home2";
import SignUp from "./app/SignUp";
import Search from "./app/Search";
import Info from "./app/Info";

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(true);


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home2} />
        <Stack.Screen name="Search" component={Search} screenOptions={{headerShown: false}}/>
        <Stack.Screen name="Info" component={Info} />
      </Stack.Navigator>
    </NavigationContainer>
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
