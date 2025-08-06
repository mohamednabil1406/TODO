// AddTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTaskScreen = ({ navigation, route }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCategory, setTaskCategory] = useState('');

    const handleAddTask = async () => {
        if (!taskName.trim()) {
            Alert.alert('Validation Error', 'Task name is required.');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            name: taskName.trim(),
            description: taskDescription.trim(),
            category: taskCategory.trim(),
        };

        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            const existingTasks = storedTasks ? JSON.parse(storedTasks) : [];
            const updatedTasks = [...existingTasks, newTask];

            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            navigation.goBack();
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'Failed to save the task.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Task</Text>

            <TextInput
                style={styles.input}
                placeholder="Task Name *"
                value={taskName}
                onChangeText={setTaskName}
            />
            <TextInput
                style={styles.input}
                placeholder="Task Description"
                value={taskDescription}
                onChangeText={setTaskDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Task Category"
                value={taskCategory}
                onChangeText={setTaskCategory}
            />

            <Button title="Add Task" onPress={handleAddTask} />
            <Button title="Go Back" onPress={() => navigation.goBack()} color="#808080" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#add8e6',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#b0c4de',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
});

export default AddTaskScreen;
