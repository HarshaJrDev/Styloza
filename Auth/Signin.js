import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Zocial from "react-native-vector-icons/Zocial";
import { useNavigation } from "@react-navigation/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigation()

  const handleSignin =  async () => {
    console.log('Sign-in button clicked.');
    console.log(`Email entered: ${email}`);
    console.log(`Password entered: ${password}`);



    const UserData = {
      email:email,
      password:password,

    }


try {

  await AsyncStorage.setItem("usertoken",JSON.stringify(UserData))
  
} catch (error) {
  console.log("is error while AsynStorage",error);
  
  
}

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      console.log('Error: Email or password field is empty.');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('User signed in!');
        console.log('User details:', userCredential.user);
        Alert.alert('Success', 'Signed in successfully!');
        navigation.navigate("Home")
        
      })
      .catch(error => {
        console.log('Error occurred during sign-in:', error);
        if (error.code === 'auth/user-not-found') {
          console.log('Error: No user found with this email.');
          Alert.alert('Error', 'No user found with this email.');
        } else if (error.code === 'auth/invalid-email') {
          console.log('Error: Invalid email address.');
          Alert.alert('Error', 'That email address is invalid!');
        } else if (error.code === 'auth/wrong-password') {
          console.log('Error: Incorrect password.');
          Alert.alert('Error', 'Incorrect password. Please try again.');
        } else {
          console.error('Unhandled error:', error);
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#fff" }}>
      {/* Logo Section */}
      <View
        style={{
          marginTop: SCREEN_HEIGHT * 0.1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: SCREEN_HEIGHT * 0.15, width: SCREEN_HEIGHT * 0.15 }}
          source={require("../assets/Image/approve.png")}
        />
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 20,
            marginTop: 10,
            color: "#333",
          }}
        >
          Welcome Back!
        </Text>
      </View>

      {/* Input Fields */}
      <View style={{ width: SCREEN_WIDTH * 0.9, marginTop: SCREEN_HEIGHT * 0.05 }}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Zocial name="email" size={20} color="#aaa" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {isValidEmail(email) && (
            <Feather name="check-circle" size={20} color="green" />
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#aaa" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Signin Button */}
        <TouchableOpacity onPress={handleSignin} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#4267B2" }]}>
          <Ionicons name="logo-facebook" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#DB4437" }]}>
          <Ionicons name="logo-google" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#000000" }]}>
          <Ionicons name="logo-apple" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <TouchableOpacity onPress={()=>navigation.navigate("Signup")}>
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={{ color: "#4267B2", fontWeight: "bold" }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  signupButton: {
    backgroundColor: "#0088D1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.5,
  },
  socialButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    marginTop: 20,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#555",
  },
});