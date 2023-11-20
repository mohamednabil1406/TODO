// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './screens/TaskListScreen';
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="TaskList">
                <Stack.Screen name="TaskList" component={TaskListScreen} />
                <Stack.Screen name="AddTask" component={AddTaskScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
