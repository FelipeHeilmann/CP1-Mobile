import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from './screens/UserListScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import EditUserScreen from './screens/EditUserScreen';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen name="EditUser" component={EditUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
