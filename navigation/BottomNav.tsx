import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import ScheduleScreen from '../screens/ScheduleScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import InstructorsScreen from '../screens/InstructorsScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomNav: React.FC = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Schedule') {
              iconName = 'calendar';
            } else if (route.name === 'MyProfile') {
              iconName = 'person';
            } else if (route.name === 'Instructors') {
              iconName = 'people';
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
         {/* <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        /> */}
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Instructors"
          component={InstructorsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>

  );
};

export default BottomNav;