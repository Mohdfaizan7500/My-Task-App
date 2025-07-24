import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTask } from '../context/TaskProvider';

const AddTodo = ({ navigation, route }) => {
  // State management for task form
  const { addTask, updateTask } = useTask();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState('');
  const [tempSelectedTime, setTempSelectedTime] = useState(new Date());
  const [ModalVisibal, setModalVisibal] = useState(false);

  // Check if in edit mode
  const isEdit = route.params?.task;
  const [task, setTask] = useState(isEdit ? route.params.task : {
    id: Date.now().toString(),
    title: '',
    description: '',
    priority: 'medium',
    duedate: new Date().toISOString().split('T')[0],
    duetime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notificationId: '',
    isDone: false,
    isStop: true,
    opened: false
  });

  // Notification handler
  async function schedulePushNotification() {
    setModalVisibal(true);
    try {
      const NotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title:  `Time to complete:${task.title}`,
          body: task.description,
          data: { data: 'goes here' }
        },
        trigger: { 
           type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3 }
      });
      task.notificationId = NotificationId;
      setModalVisibal(false);
    } catch (e) {
      setModalVisibal(false);
      console.log(e);
    }
  }

  // Date/time formatters
  const formatDisplayDate = (dateString) => dateString
    ? new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Select Date';

  const formatDisplayTime = (time) => time
    ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Select Time';

  // Priority styling helpers
  const getPriorityColor = (priority) => ({
    high: '#ff6b6b', medium: '#ffd166', low: '#06d6a0'
  })[priority];

  const getPriorityButtonStyle = (priorityLevel) => ({
    backgroundColor: task.priority === priorityLevel ? getPriorityColor(priorityLevel) : '#f0f0f0',
    borderColor: getPriorityColor(priorityLevel),
    borderWidth: task.priority === priorityLevel ? 0 : 1
  });

  const getPriorityTextStyle = (priorityLevel) => ({
    color: task.priority === priorityLevel ? 'white' : getPriorityColor(priorityLevel),
    fontWeight: task.priority === priorityLevel ? 'bold' : 'normal'
  });

  // Form submission handler
  const handleSave = async () => {
    if (!task.title.trim()) return Alert.alert('Validation Error', 'Title is required');
    if (!task.duedate) return Alert.alert('Validation Error', 'Due Date is required');
    if (!task.duetime) return Alert.alert('Validation Error', 'Due Time is required');

    await schedulePushNotification();
    if (!task.notificationId) return Alert.alert('Validation Error', 'Notification id not Generated');

    setModalVisibal(true);
    try {
      isEdit ? updateTask(task.id, task) : addTask(task);
      setModalVisibal(false);
      navigation.goBack();
    } catch (e) {
      setModalVisibal(false);
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Title */}
        <Text style={styles.header}>{isEdit ? 'Edit Task' : 'Add New Task'}</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Task Title Input */}
          <Text style={styles.label}>Title*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            placeholderTextColor="gray"
            value={task.title}
            onChangeText={(text) => setTask({ ...task, title: text })}
          />

          {/* Task Description Input */}
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter task description"
            placeholderTextColor="gray"
            multiline
            value={task.description}
            onChangeText={(text) => setTask({ ...task, description: text })}
          />

          {/* Priority Selection */}
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {['high', 'medium', 'low'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.priorityOption, getPriorityButtonStyle(level)]}
                onPress={() => setTask({ ...task, priority: level })}
              >
                <Text style={[styles.priorityOptionText, getPriorityTextStyle(level)]}>
                  {level.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Due Date Picker */}
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowCalendar(true)}>
            <Text style={task.duedate ? styles.dateText : styles.placeholderText}>
              {formatDisplayDate(task.duedate)}
            </Text>
            <MaterialIcons name="calendar-today" size={s(20)} color="#6200ee" />
          </TouchableOpacity>

          {/* Due Time Picker */}
          <Text style={styles.label}>Due Time</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
            <Text style={task.duetime ? styles.dateText : styles.placeholderText}>
              {task.duetime || formatDisplayTime(tempSelectedTime)}
            </Text>
            <MaterialIcons name="access-time" size={s(20)} color="#6200ee" />
          </TouchableOpacity>
        </View>

        {/* Calendar Modal */}
        <Modal visible={showCalendar} animationType="slide" transparent>
          <View style={styles.calendarModal}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={(day) => setTempSelectedDate(day.dateString)}
                markedDates={{ [tempSelectedDate]: { selected: true, selectedColor: '#6200ee' } }}
                theme={{
                  calendarBackground: '#ffffff',
                  selectedDayBackgroundColor: '#6200ee',
                  selectedDayTextColor: '#ffffff'
                }}
              />
              <View style={styles.calendarButtons}>
                <TouchableOpacity style={[styles.calendarButton, styles.cancelButton]} onPress={() => setShowCalendar(false)}>
                  <Text style={styles.calendarButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.calendarButton, styles.confirmButton]} onPress={() => {
                  setTask({ ...task, duedate: tempSelectedDate });
                  setShowCalendar(false);
                }}>
                  <Text style={styles.calendarButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={tempSelectedTime}
            mode="time"
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              setTempSelectedTime(selectedDate);
              setTask({ ...task, duetime: formatDisplayTime(selectedDate) });
            }}
          />
        )}

        {/* Form Action Buttons */}
        <View style={styles.formActions}>
          <Button title="Cancel" color="#ff6b6b" onPress={() => navigation.goBack()} />
          <Button title={isEdit ? "Update Task" : "Add Task"} onPress={handleSave} />
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Modal visible={ModalVisibal} transparent>
        <View style={styles.loadingModal}>
          <ActivityIndicator size={50} color="gray" />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: s(16)
  },
  header: {
    fontSize: s(24),
    fontWeight: 'bold',
    marginBottom: s(20),
    color: '#333'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: s(16),
    borderRadius: s(8),
    marginBottom: s(16)
  },
  label: {
    fontWeight: 'bold',
    marginBottom: s(8),
    color: '#333'
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: s(12),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: s(16)
  },
  multilineInput: {
    minHeight: s(80)
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(16)
  },
  priorityOption: {
    flex: 1,
    padding: s(12),
    marginHorizontal: s(4),
    borderRadius: s(8),
    alignItems: 'center'
  },
  priorityOptionText: {
    fontWeight: 'bold'
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: s(12),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: s(16)
  },
  dateText: {
    color: '#333'
  },
  placeholderText: {
    color: '#999'
  },
  calendarModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  calendarContainer: {
    margin: s(20),
    backgroundColor: 'white',
    borderRadius: s(10),
    padding: s(10)
  },
  calendarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(10)
  },
  calendarButton: {
    flex: 1,
    padding: s(12),
    borderRadius: s(6),
    alignItems: 'center',
    marginHorizontal: s(5)
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: s(1),
    borderColor: '#d3d3d3'
  },
  confirmButton: {
    backgroundColor: '#6200ee'
  },
  calendarButtonText: {
    fontWeight: 'bold',
    color: "#fff"
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  loadingModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.34)"
  }
});

export default AddTodo;
