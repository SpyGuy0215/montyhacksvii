import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {useState} from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "../firebaseConfig";

export default function Login({ navigation }) {
    const [email, setEmail] = useState('null');
    const [password, setPassword] = useState('null');
    const [user, setUser] = useState('');

    function handleLogin(){
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            setUser(userCredential.user);
            navigation.navigate("Home", {user: userCredential.user});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Civic Union</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#2F3E46"
              style={styles.input}
              onChangeText={(data) => setEmail(data)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#2F3E46"
              style={styles.input}
              textContentType="password"
              onChangeText={(data) => setPassword(data)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
              <Text
                style={styles.buttonText}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <View style={styles.row}>
              <Text>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CAD2C5",
    height: "100%",
    width: "100%",
  },
  innerContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 15,
  },
  header: {
    alignItems: "center",
    marginTop: 130,
  },
  headerText: {
    color: "#354F52",
    fontWeight: "bold",
    letterSpacing: 3,
    fontSize: 45,
  },
  inputContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    spaceBetween: 16,
    marginTop: 45,
  },
  inputWrapper: {
    backgroundColor: "#B0C4B1",
    padding: 16,
    borderRadius: 20,
    width: "100%",
    marginBottom: 20,
  },
  input: {
    color: "#2F3E46",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#52796F",
    padding: 12,
    borderRadius: 20,
    marginTop: 25,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  signUpContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#5EB9A2", // Sky blue color
    marginLeft: 5,
  },
});
