import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Screens/Home';
import Search from './Screens/Search';
import Portfolio from './Screens/Portfolio';
import Rewards from './Screens/Rewards';
import Icon from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            // Define icons for each route
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search1';
            } else if (route.name === 'Portfolio') {
              iconName = 'folder1';
            } else if (route.name === 'Rewards') {
              iconName = 'gift';
            }
            return <Icon name={iconName} size={size} color={focused ? '"#000' : 'gray'} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
          headerShown:false
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Portfolio" component={Portfolio} />
        <Tab.Screen name="Rewards" component={Rewards} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
