import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Image, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeamsScreen from './home_screens/TeamsScreen';
import ArtifactsScreen from './home_screens/ArtifactsScreen';
import SettingsScreen from './home_screens/SettingsScreen';
import { COLORS, SIZES } from '../components/theme'; //colors and font sizes 
import { Figtree_400Regular, Figtree_600SemiBold, useFonts } from '@expo-google-fonts/figtree' //font
import BottomSheet, { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BasicButton from '../components/BasicButton';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();


const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState({});

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  //load font
  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_600SemiBold,
  });

  const bottomSheetRef = useRef(null);
  const [screenIndex, setScreenIndex] = useState(1);

  const handlePress = (idx) => {
    bottomSheetRef.current?.expand();
    setScreenIndex(idx);
  };

  const INITIAL_REGION = {
    latitude: 33.778307260053026, 
    longitude: -84.39842128239762,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity style={styles.infoIconWrap} onPress={() => navigation.navigate('AboutUsScreen')}>
					<Image
						style={styles.infoIcon}
						source={require('../assets/info-button.png')}/>
				</TouchableOpacity>
      {/* <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="MapScreen">
        <Tab.Screen name="ArtifactsScreen" component={ArtifactsScreen} />
        <Tab.Screen name="MapScreen" component={MapScreen} />
        <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
      </Tab.Navigator> */}
      <MapView style={styles.map} initialRegion={INITIAL_REGION} showsBuildings showsUserLocation />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['13%', '90%']}
        index={0}
        backgroundStyle={{backgroundColor: '#FFF9D9'}}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.buttonNavigationContainer}>
            <TouchableOpacity 
                style={[styles.touchableStyle, screenIndex == 0 && styles.selectedOption]} 
                onPress={() => handlePress(0)}
            >
              <Image style={styles.icon} source={require('../assets/teams.png')} />
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.touchableStyle, screenIndex == 1 && styles.selectedOption]} 
                onPress={() => handlePress(1)}
            >
              <Image style={styles.icon} source={require('../assets/artifacts.png')} />
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.touchableStyle, screenIndex == 2 && styles.selectedOption]} 
                onPress={() => handlePress(2)}
            >
              <Image style={styles.icon} source={require('../assets/settings.png')} />
            </TouchableOpacity>
          </View>
          {(screenIndex == 0) && <TeamsScreen />}
          {(screenIndex == 1) && <ArtifactsScreen/>}
          {(screenIndex == 2) && <SettingsScreen/>}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  button: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableStyle: {
    padding: 5,
    borderRadius: 10,
  },
  buttonNavigationContainer: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectedOption: {
    backgroundColor: '#EEB210',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoIcon: {
		height: 50,
		width: 50,
		alignSelf: 'center',
		zIndex: 3,
		objectFit: 'contain',
	},
	infoIconWrap: {
		alignSelf: 'center',
		zIndex: 3,
		//width: 10,
		marginTop: 40,
		paddingLeft: 300,
		objectFit: 'contain',
	},
  icon: {
    objectFit: 'contain',
    height: 50, 
    width: 50,
  }
});


export default HomeScreen