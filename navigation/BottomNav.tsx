import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RootTabParamList } from "../types";
import ScheduleStack from "../screens/ScheduleStack";
import InstructorStack from "../screens/InstructorStack";
import ProfileStack from "../screens/ProfileStack";
import HomeStack from "../screens/HomeStack";

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomNav: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "ScheduleStack") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "ProfileStack") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "InstructorStack") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3D4AF5",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopWidth: 0,
          paddingTop: 5,
          borderRadius: 30,
          shadowColor: '#171717',
          shadowOffset: {width: 2, height: -4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          position: "absolute",
        },
      
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        name="ScheduleStack"
        component={ScheduleStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        name="InstructorStack"
        component={InstructorStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: () => {
            return null;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
