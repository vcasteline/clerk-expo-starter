import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import MyProfileScreen from '../screens/profile/MyProfileScreen';
import InstructorsScreen from '../screens/instructors/InstructorsScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ScheduleStack from '../screens/ScheduleStack';
import InstructorStack from '../screens/InstructorStack';
import ProfileStack from '../screens/ProfileStack';
import HomeStack from '../screens/HomeStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomNav: React.FC = () => {
  return (
    
      <Tab.Navigator
        screenOptions={ ({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'ScheduleStack') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'ProfileStack') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'InstructorStack') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'HomeStack') {
              iconName = focused ? 'home' : 'home-outline';
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3D4AF5',
          tabBarInactiveTintColor: 'gray',
        })}
      >
         <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
            tabBarLabel:() => {return null},
          }}
        />
        <Tab.Screen
          name="ScheduleStack"
          component={ScheduleStack}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
            tabBarLabel:() => {return null},
          }}
        />
        <Tab.Screen
          name="InstructorStack"
          component={InstructorStack}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
            tabBarLabel:() => {return null},
          }}
        />
         <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
            tabBarLabel:() => {return null},
          }}
        />
      </Tab.Navigator>

  );
};

export default BottomNav;