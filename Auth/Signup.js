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
import auth from '@react-native-firebase/auth';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Zocial from "react-native-vector-icons/Zocial";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

const navigation = useNavigation()

const handleSignup = async () => {
  console.log('Sign-up button clicked.');
  console.log(`Email entered: ${email}`);
  console.log(`Password entered: ${password}`);

  // Validate input fields
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password.');
    console.log('Error: Email or password field is empty.');
    return;
  }

  const UserData = {
    email: email,
    password: password, // For security, avoid saving plaintext passwords. Hash it if you must store it.
  };

  try {
    // Save user data in AsyncStorage
    await AsyncStorage.setItem('usertoken', JSON.stringify(UserData));
    console.log('User data successfully saved in AsyncStorage.');

    // Firebase sign-up
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid; // Get the user ID from Firebase

    console.log('User account created & signed in!');
    console.log('User details:', userCredential.user);

    // Save user data to Firestore
    await firestore()
      .collection('users')
      .doc(userId) // Use userId as the document ID for better organization
      .set({
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(), // Store server timestamp
      });

    console.log('User data successfully saved in Firestore.');

    Alert.alert('Success', 'Account created and signed in!');
  } catch (error) {
    console.error('Error occurred during sign-up:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      console.log('Error: Email address is already in use.');
      Alert.alert('Error', 'That email address is already in use!');
    } else if (error.code === 'auth/invalid-email') {
      console.log('Error: Invalid email address.');
      Alert.alert('Error', 'That email address is invalid!');
    } else if (error.code === 'auth/weak-password') {
      console.log('Error: Weak password. Must be at least 6 characters.');
      Alert.alert(
        'Error',
        'The password is too weak! It must be at least 6 characters long.'
      );
    } else {
      // Handle unexpected errors
      console.error('Unhandled error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }
};
  

  // Helper function to check if the email is valid
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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
          Let's get started!
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

        {/* Signup Button */}
        <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
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
      <TouchableOpacity onPress={()=>navigation.navigate("Signin")} >
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={{ color: "#4267B2", fontWeight: "bold" }}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Signup;

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
