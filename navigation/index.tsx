import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Navigation() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const checkUserSignedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsSignedIn(!!token);
        setIsLoaded(true);
        SplashScreen.hideAsync();
      } catch (e) {
        console.log('Failed to load the token');
      }
    };

    checkUserSignedIn();
  }, []);

  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator isSignedIn={isSignedIn} />
    </NavigationContainer>
  );
}
interface RootNavigatorProps {
  isSignedIn: boolean;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<RootNavigatorProps> = ({ isSignedIn }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {isSignedIn ? (
      <>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Main' }}
        />
      </>
    ) : (
      <>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen} 
          options={{ title: 'Main' }}
        />
      </>
    )}
  </Stack.Navigator>
);
