// AddTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTaskScreen = ({ navigation, route }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCategory, setTaskCategory] = useState('');

    const handleAddTask = () => {
        if (!taskName || !taskDescription || !taskCategory) {
            alert('Please fill in all fields');
            return;
        }

        const newTask = {
            id: Math.random().toString(),
            name: taskName,
            description: taskDescription,
            category: taskCategory,
        };

        // Retrieve the existing tasks from AsyncStorage
        const existingTasks = route.params.tasks || [];

        // Update the tasks with the new task
        const updatedTasks = [...existingTasks, newTask];

        // Save the updated tasks to AsyncStorage
        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks))
            .then(() => {
                // Update the tasks state in TaskListScreen
                route.params.setTasks(updatedTasks);
            })
            .catch((error) => {
                console.error('Error saving tasks to AsyncStorage:', error);
            });
        navigation.setOptions({
            params: {
                tasks: updatedTasks,
            },
        });
        // Navigate back to TaskListScreen
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Task Screen</Text>

            <TextInput
                style={styles.input}
                placeholder="Task Name"
                value={taskName}
                onChangeText={(text) => setTaskName(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Task Description"
                value={taskDescription}
                onChangeText={(text) => setTaskDescription(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Task Category"
                value={taskCategory}
                onChangeText={(text) => setTaskCategory(text)}
            />

            <Button title="Add Task" onPress={handleAddTask} />

            <Button
                title="Go Back"
                onPress={() => navigation.goBack()}
                color="#808080"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#add8e6', // Light blue background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333', // Dark text color
    },
    input: {
        height: 40,
        borderColor: '#b0c4de', // Lighter blue border color
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: 'white', // White background
    },
});

export default AddTaskScreen;
