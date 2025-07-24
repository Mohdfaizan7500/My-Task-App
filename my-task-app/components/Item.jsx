import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { s, vs } from 'react-native-size-matters';
import Checkbox from '../components/CheckBox';
import PriorityBadge from '../components/PriorityBadge';
import { useTask } from '../context/TaskProvider';

const Item = ({ item, onLongPress, toggleModal }) => {
    const { updateTask, deleteTask, OnComponentOpen } = useTask();
    const ref = useRef();
    const navigation = useNavigation();

    const toggleComplete = async (task) => {
        toggleModal(true);
        await updateTask(task.id, { ...task, isDone: !task.isDone, isStop: false });
        toggleModal(false);
    };

    const leftSwipe = (item) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Add Task', { task: item });
                ref.current.close();
            }}
            style={styles.leftSwipe}
        >
            <FontAwesome5 name="edit" size={s(24)} color="#fff" />
        </TouchableOpacity>
    );

    const rightSwipe = (item) => (
        <TouchableOpacity
            onPress={() => {
                confirmDelete(item);
                ref.current.close();
            }}
            style={[styles.leftSwipe, styles.rightSwipe]}
        >
            <MaterialCommunityIcons name="delete" size={s(30)} color="#fff" />
        </TouchableOpacity>
    );

    const confirmDelete = (item) => {
        Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => deleteTask(item.id) },
        ]);
    };

    useEffect(() => {
        if (!item.opened) {
            ref.current.close();
        }
    });

    return (
        <View>
            <Swipeable
                ref={ref}
                friction={2}
                renderLeftActions={() => leftSwipe(item)}
                renderRightActions={() => rightSwipe(item)}
                onSwipeableWillOpen={() => {
                    OnComponentOpen(item.id);
                }}
            >
                <TouchableOpacity activeOpacity={0.9} onLongPress={() => onLongPress()}>
                    <View style={[styles.taskCard, item.isDone && styles.completedTask]}>
                        <View style={styles.taskRow}>
                            <Checkbox checked={item.isDone} onPress={() => { toggleComplete(item); }} />
                            <View style={styles.taskContent}>
                                <View style={styles.taskHeader}>
                                    <View style={{ width: Dimensions.get('window').width - s(150) }}>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            style={[styles.taskTitle, item.isDone && styles.completedText]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                    <View>
                                        <PriorityBadge priority={item.priority} />
                                    </View>
                                </View>
                                <Text style={styles.taskDate}>Due: {item.duedate}</Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[styles.taskDescription, item.isDone && styles.completedText]}
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.timeBox}>
                            {item.isStop ?
                                <Ionicons name="alarm-outline" size={s(20)} color="gray" /> :
                                <MaterialIcons name="alarm-off" size={s(20)} color="gray" />
                            }
                            <Text style={styles.time}>{item.duetime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
};

export default Item;

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: 'white',
        padding: s(16),
        borderRadius: s(8),
        marginBottom: vs(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: Dimensions.get("window").width - s(20),
        alignSelf: 'center',
        overflow: 'hidden',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    taskTitle: {
        fontSize: s(18),
        fontWeight: 'bold',
    },
    taskDescription: {
        color: '#666',
        marginBottom: vs(8),
        marginEnd: s(100),
    },
    taskDate: {
        fontStyle: 'italic',
        marginBottom: vs(8),
        color: '#888',
    },
    completedTask: {
        opacity: 0.7,
        backgroundColor: '#f8f8f8',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    leftSwipe: {
        backgroundColor: "#3498db",
        width: s(70),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: vs(12),
        borderTopStartRadius: s(8),
        borderBottomStartRadius: s(8),
    },
    rightSwipe: {
        backgroundColor: "#e74c3c",
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
        borderTopEndRadius: s(8),
        borderBottomEndRadius: s(8),
    },
    time: {
        color: "gray",
        fontSize: s(10),
    },
    timeBox: {
        flexDirection: "row",
        position: "absolute",
        bottom: vs(10),
        right: s(15),
        gap: s(5),
        justifyContent: "center",
        alignItems: "center",
    },
});
