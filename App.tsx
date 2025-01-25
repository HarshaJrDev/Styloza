import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import OnBoarding from './screens/OnBoarding';
import Signup from './Auth/Signup';
import Signin from './Auth/Signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';  // Import Firebase auth

const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const App = () => {

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginCredentials = async () => {
      try {
        const token = await AsyncStorage.getItem('usertoken');
        setIsLogin(Boolean(token));
      } catch (error) {
        console.error('Error checking login credentials:', error);
        setIsLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginCredentials();
  }, []);

  // Handle sign-out
  const signOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('usertoken');
      setIsLogin(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4756ca" />
      </View>
    );
  }

  const AuthScreen = () => (
    <AuthStack.Navigator initialRouteName='OnBoarding'>
      <AuthStack.Screen name="Signin" component={Signin} options={{headerShown: false}}/>
      <AuthStack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <AuthStack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
      <AuthStack.Screen name="OnBoarding" component={OnBoarding} options={{headerShown: false}}/>
    </AuthStack.Navigator>
  );

  const HomeScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          headerRight: () => (
            <Button onPress={signOut} title="Sign Out" color="#0088D1" />
          ),
        }}
      />
    </HomeStack.Navigator>
  );

  return (
    <PaperProvider>
      <NavigationContainer>
        {isLogin ? <HomeScreen /> : <AuthScreen />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
