import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';

const TaskContext = createContext();

const data = [
    {
        id: 1,
        title: "Grocery Shopping",
        description: "This task involves creating a comprehensive shopping list for weekly grocery needs. Users can specify items such as fruits (e.g., apples, bananas), vegetables (e.g., carrots, spinach), dairy products (e.g., milk, cheese), and snacks (e.g., chips, granola bars). The task can include a due date for when the shopping should be completed, and users can check off items as they shop. Additionally, users can set reminders to ensure they don’t forget to buy essential items",
        priority: "high",
        isDone: false,
        duedate: "2025-07-20",
        duetime: '10:42 pm',
        opened: false,
        isStop: true,
        notificationId: "",
    },
    {
        id: 2,
        title: "Finish Project Report",
        description: "This task focuses on completing a detailed project report that outlines the objectives, findings, and conclusions of a specific project. Users can include key points that need to be addressed in the report, such as background information, methodology, results, and recommendations. The task can have a deadline for submission, and users can break it down into subtasks for each section (e.g., research, writing, and editing) to manage their time effectively and ensure thoroughness.",
        priority: "medium",
        isDone: false,
        duedate: "2025-07-20",
        duetime: "9:00 pm",
        opened: false,
        isStop: true,
        notificationId: "",
    },
    {
        id: 3,
        title: "Plan Weekend Hike",
        description: "This task involves organizing a hiking trip for the upcoming weekend. Users can specify the hiking location, trail details, and any necessary preparations. The task can include a checklist of items to pack, such as water, snacks, a first aid kit, and appropriate clothing. Users can also set a time to meet with friends or family for the hike, ensuring everyone is on the same page. Additionally, users can research the trail conditions and weather forecast to ensure a safe and enjoyable experience.",
        priority: "low",
        isDone: false,
        duedate: "2025-07-20",
        duetime: "9:00 pm",
        opened: false,
        isStop: true,
        notificationId: "",
    },
    {
        id: 4,
        title: "Schedule Doctor's Appointment",
        description: "This task is about arranging a visit to the doctor for a routine check-up or specific health concerns. Users can include important details such as the doctor's name, contact information, and preferred dates and times for the appointment. The task can also allow users to note any specific health issues they want to discuss during the visit. Setting reminders for follow-up actions, such as calling the doctor's office or preparing questions for the appointment, can help users stay organized and proactive about their health.",
        priority: "high",
        isDone: false,
        duedate: "2025-07-20",
        duetime: "9:00 pm",
        opened: false,
        isStop: true,
        notificationId: "",
    }
];

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([...data]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = async () => {
        try {
            let temp = await AsyncStorage.getItem("task");
            if (temp) {
                setTasks(JSON.parse(temp));
            } else {
                setTasks([...data]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        try {
            fetchTasks();
        } catch (e) {
            console.log(e);
        }
    }, []);

    const searchTasks = (query) => {
        return tasks.filter(t => (
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.description.toLowerCase().includes(query.toLowerCase()) ||
            t.priority.toLowerCase().includes(query.toLowerCase())
        ));
    };

    const filteredTasks = searchQuery ? searchTasks(searchQuery) : tasks;

    const addTask = async (item) => {
        console.log(item);
        try {
            const updatedTasks = [item, ...tasks];
            await AsyncStorage.setItem("task", JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
        } catch (error) {
            console.log(error);
            Alert.alert("Error: Check Console");
        }
    };

    const updateTask = async (id, updateItem) => {
        try {
            if (updateItem.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(updateItem.notificationId);
            }
            const updatedTasks = tasks.map(t => t.id === id ? updateItem : t);
            setTasks(updatedTasks);
            await AsyncStorage.setItem("task", JSON.stringify(updatedTasks));
        } catch (e) {
            console.log(e);
        }
    };

    const deleteTask = (id) => {
        try {
            const updatedTasks = tasks.filter(t => t.id !== id);
            setTasks(updatedTasks);
            AsyncStorage.setItem("task", JSON.stringify(updatedTasks));
        } catch (e) {
            console.log(e);
        }
    };

    const OnComponentOpen = (id) => {
        console.log(id);
        let tempData = tasks;
        tempData.map((item) => {
            item.opened = item.id === id; // Set opened state based on the id
        });
        setTasks([...tempData]); // Update tasks state
    };

    return (
        <TaskContext.Provider value={{ tasks, filteredTasks, updateTask, deleteTask, addTask, setSearchQuery, searchQuery, OnComponentOpen }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => useContext(TaskContext);
