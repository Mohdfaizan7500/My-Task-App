import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TaskProvider } from '../context/TaskProvider';
import AddTask from '../screens/AddTask';
import Splash from '../screens/Splash';
import TaskList from '../screens/TaskList';

const Stack = createNativeStackNavigator();

const Navigation = () => {

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    // Optional: Request notification permissions
    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
    };
    requestPermissions();
  }, []);


  return (
    <TaskProvider>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={Splash} />
        <Stack.Screen name='Task List' component={TaskList} />
        <Stack.Screen name='Add Task' component={AddTask} />
      </Stack.Navigator>
    </TaskProvider>
  )
}


export default Navigation

const styles = StyleSheet.create({})