import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'tasks';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskListScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedTask, setEditedTask] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTasks();
        });
        return unsubscribe;
    }, [navigation]);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const saveTasks = async (updatedTasks) => {
        try {
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const handleDeleteTask = (taskId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const handleEditTask = (taskId) => {
        setEditingTask(taskId);
        const taskToEdit = tasks.find((task) => task.id === taskId);
        setEditedTask({ ...taskToEdit });
    };

    const handleSaveTask = () => {
        if (!editedTask || !editedTask.name.trim()) {
            Alert.alert('Validation Error', 'Task name is required.');
            return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updatedTasks = tasks.map((task) =>
            task.id === editingTask ? { ...editedTask } : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        setEditingTask(null);
        setEditedTask(null);
    };

    const getCategoryStyle = (category) => {
        switch (category.toLowerCase()) {
            case 'work':
                return styles.categoryWork;
            case 'personal':
                return styles.categoryPersonal;
            case 'shopping':
                return styles.categoryShopping;
            default:
                return { backgroundColor: '#9ca3af' }; // Gray
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
                <Text style={[styles.taskName, item.completed && styles.completedText]}>
                    {item.name}
                </Text>
                {item.description ? (
                    <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
                        {item.description}
                    </Text>
                ) : null}
                {item.category ? (
                    <Text style={[styles.taskCategory, getCategoryStyle(item.category)]}>
                        {item.category}
                    </Text>
                ) : null}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                    <View style={styles.deleteButton}>
                        <Ionicons name="trash" size={24} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditTask(item.id)}>
                    <View style={styles.editButton}>
                        <Ionicons name="create" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No tasks available</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    style={styles.flatList}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask')}
            >
                <Ionicons name="add" size={36} color="white" />
            </TouchableOpacity>

            <Modal
                visible={editingTask !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setEditingTask(null);
                    setEditedTask(null);
                }}
            >
                <View style={styles.editTaskModal}>
                    <View style={styles.editTaskContainer}>
                        <Text style={styles.editTaskTitle}>Edit Task</Text>
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Task Name *"
                            value={editedTask?.name}
                            onChangeText={(text) =>
                                setEditedTask((prev) => ({ ...prev, name: text }))
                            }
                        />
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Task Description"
                            value={editedTask?.description}
                            onChangeText={(text) =>
                                setEditedTask((prev) => ({ ...prev, description: text }))
                            }
                        />
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Task Category"
                            value={editedTask?.category}
                            onChangeText={(text) =>
                                setEditedTask((prev) => ({ ...prev, category: text }))
                            }
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                            <Ionicons name="checkmark-circle" size={36} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: '#f0f4f8',
    },
    flatList: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    taskInfo: {
        flex: 1,
    },
    taskName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    taskCategory: {
        fontSize: 12,
        color: '#fff',
        alignSelf: 'flex-start',
        marginTop: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        fontWeight: '600',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    categoryWork: {
        backgroundColor: '#f97316', // Orange
    },
    categoryPersonal: {
        backgroundColor: '#3b82f6', // Blue
    },
    categoryShopping: {
        backgroundColor: '#10b981', // Green
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
    },
    editButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 8,
    },
    addButton: {
        backgroundColor: '#6366f1',
        borderRadius: 30,
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 24,
        right: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 10,
    },
    editTaskModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    editTaskContainer: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 20,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 12,
    },
    editTaskTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111',
        textAlign: 'center',
    },
    editTaskInput: {
        height: 48,
        borderColor: '#d1d5db',
        borderWidth: 1,
        marginBottom: 18,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4f46e5',
        borderRadius: 30,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TaskListScreen;
