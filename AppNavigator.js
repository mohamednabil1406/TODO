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
            <Stack.Navigator
                initialRouteName="TaskList"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1e90ff',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="TaskList"
                    component={TaskListScreen}
                    options={{ title: 'To-do List' }}
                />
                <Stack.Screen
                    name="AddTask"
                    component={AddTaskScreen}
                    options={{ title: 'Add New Task' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
