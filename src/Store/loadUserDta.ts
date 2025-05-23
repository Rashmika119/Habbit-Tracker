import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from './habitStore';

 //load habits,calender and progress according to the user(user id)

export const loadUserData = async (userId: number) => {
  const habitString = await AsyncStorage.getItem(`habits-${userId}`);
  const habits = habitString ? JSON.parse(habitString) : [];

  const progressString = await AsyncStorage.getItem(`progress-${userId}`);
  const progress = progressString ? JSON.parse(progressString) : [];

  const calendarString = await AsyncStorage.getItem(`calendar-${userId}`);
  const calendar = calendarString ? JSON.parse(calendarString) : [];

  useHabitStore.getState().setHabits(habits);
  useHabitStore.getState().setProgress(progress);
  useHabitStore.getState().setCalendar(calendar);
};
