import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const OnBoarding = () => {
  const navigation = useNavigation()
  const dots = [
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: false },
  ];

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/Image/approve.png')}
        />
        <Text style={styles.mainText}>Get things done.</Text>
      </View>

      {/* Subtext Section */}
      <View style={styles.subTextContainer}>
        <Text style={styles.subText}>Just a click away from</Text>
        <Text style={styles.subText}>planning your tasks</Text>
      </View>

      {/* Dots Section */}
      <View style={styles.dotContainer}>
        {dots.map((dot) => (
          <View
            key={dot.id}
            style={[
              styles.dot,
              { backgroundColor: dot.active ? '#0a0' : 'gray' },
            ]}
          />
        ))}
      </View>

      {/* Right Section */}
      <View style={styles.rightContainer}>
        <TouchableOpacity  onPress={()=>navigation.navigate("Signin")} style={styles.arrowButton}>
          <AntDesign name="arrowright"  style={{right: SCREEN_HEIGHT * 0.12, bottom: SCREEN_HEIGHT * 0.05}} size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.05,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  image: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: 'contain',
  },
  mainText: {
    fontSize: SCREEN_WIDTH * 0.06,
    color: '#000',
    fontWeight: '600',
    marginTop: SCREEN_HEIGHT * 0.02,
    fontFamily: 'Poppins-SemiBold',
  },
  subTextContainer: {
    alignItems: 'center',
  },
  subText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  rightContainer: {
    right: 0,
    left: SCREEN_HEIGHT * 0.3,
    bottom: 0,
    marginTop: SCREEN_HEIGHT * 0.2,
    backgroundColor: '#0088D1',
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.4,
    borderBottomLeftRadius: SCREEN_HEIGHT * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
