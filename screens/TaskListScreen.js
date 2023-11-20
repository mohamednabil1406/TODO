// TaskListScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'tasks';

const TaskListScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        saveTasks();
        navigation.setOptions({
            title: `To-do `,
        });
    }, [tasks]);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks !== null) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks from AsyncStorage:', error);
        }
    };

    const saveTasks = async () => {
        try {
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to AsyncStorage:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
                <Text style={styles.taskName}>Name: {item.name}</Text>
                <Text style={styles.taskDescription}>Description: {item.description}</Text>
                <Text style={styles.taskCategory}>Category: {item.category}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.flatList}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask', { tasks, setTasks })}
            >
                <Ionicons name="ios-add" size={36} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#add8e6', // Light blue background
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#b0c4de', // Lighter blue border color
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        backgroundColor: 'white', // White background
    },
    taskInfo: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Dark text color
    },
    taskDescription: {
        color: '#666', // Gray text color
    },
    taskCategory: {
        color: '#3498db', // Blue text color
    },
    addButton: {
        backgroundColor: '#1e90ff', // Dodger blue background
        borderRadius: 50,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 16,
        right: '40%',
        transform: [{ translateX: -25 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        flex: 1,
    },
});

export default TaskListScreen;
