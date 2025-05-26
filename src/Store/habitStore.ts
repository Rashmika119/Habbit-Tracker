import { create } from "zustand"
import type { editStoreType, habitStoreType, habitTextType, HabitType } from "../Types/habitTypes"
import { Alert, Keyboard } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const formatDateForStorage = (date: any) => {
  if (typeof date === 'string') {
    return new Date(date).toDateString();
  }
  return date.toDateString();
};


export const useHabitTextStore = create<habitTextType>((set) => ({
  habitText: {
    id: 0,
    task: "",
    description: "",
    frequency: "",
    completed: false,
    behavior: "",
    weekDay: [],
    timeRange: "",
    completionHistory: {}, 
  },

  setHabitText: (value: string | boolean | string[] | Record<string, boolean>, key: keyof HabitType) => {
    set((state) => ({
      habitText: {
        ...state.habitText,
        [key]: value,
      },
    }))
  },
  clearHabitText: () => {
    set(() => ({
      habitText: {
        id: 0,
        task: "",
        description: "",
        frequency: "",
        completed: false,
        behavior: "",
        weekDay: [],
        timeRange: "",
        completionHistory: {},
      },
    }))
  },
}))

export const useHabitStore = create<habitStoreType>((set, get) => ({
  habits: [],
  progress: [],
  calendar: [],

  addHabit: async () => {
    const { habitText, setHabitText, clearHabitText } = useHabitTextStore.getState()
    try {
      const isDaily = habitText.frequency === "Daily"
      const isWeekDayValid = isDaily || habitText.weekDay.length > 0
      if (
        !habitText.task.trim() ||
        !habitText.description.trim() ||
        !habitText.timeRange.trim() ||
        !habitText.behavior.trim() ||
        !isWeekDayValid
      ) {
        Alert.alert("Please fill all the fields")
        return
      }
      const newHabit = {
        id: Math.random(),
        task: habitText.task,
        description: habitText.description,
        frequency: habitText.frequency,
        completed: false,
        behavior: habitText.behavior,
        weekDay: habitText.weekDay,
        timeRange: habitText.timeRange,
        completionHistory: {}, // Initialize empty completion history
      }
      set((state) => ({
        habits: [...state.habits, newHabit],
      }))
      clearHabitText()
      await AsyncStorage.setItem("my-habit", JSON.stringify(get().habits))
      Alert.alert("Habit Added Successfully")
      Keyboard.dismiss()
    } catch (error) {
      console.log(error)
    }
  },

  deleteHabit: async (id: number | undefined) => {
    try {
      const { habits } = get()
      const newHabits = habits.filter((habit) => habit.id !== id)
      await AsyncStorage.setItem("my-habit", JSON.stringify(newHabits))
      set({
        habits: newHabits,
      })
    } catch (error) {
      console.log("Delete error: ", error)
    }
  },

  // Replace your handleDone function with this:
  handleDone: async (id: number, date?: string) => {
    try {
      const { habits } = get()
      const dateKey = formatDateForStorage(date || new Date())

      console.log(" DEBUG handleDone:");
      console.log("- habitId:", id);
      console.log("- date param:", date);
      console.log("- dateKey used:", dateKey);

      const newHabits = habits.map((habit) => {
        if (habit.id === id) {
          const updatedHistory = { ...habit.completionHistory }

          console.log("Before update:", updatedHistory);

          // Toggle completion for the specific date only
          if (updatedHistory[dateKey]) {
            delete updatedHistory[dateKey]
            console.log(" Unmarked for:", dateKey);
          } else {
            updatedHistory[dateKey] = true
            console.log(" Marked complete for:", dateKey);
          }

          console.log(" After update:", updatedHistory);

          return {
            ...habit,
            completionHistory: updatedHistory,
            completed: !!updatedHistory[dateKey],
          }
        }
        return habit
      })

      await AsyncStorage.setItem("my-habit", JSON.stringify(newHabits))
      set({ habits: newHabits })
    } catch (error) {
      console.log("Error in handleDone: ", error)
    }
  },

  // Helper function to check if habit is completed on specific date
  isHabitCompletedOnDate: (habitId: number, date: string) => {
    const { habits } = get()
    const habit = habits.find((h) => h.id === habitId)
    const dateKey = formatDateForStorage(date)

    console.log("Checking completion for:", dateKey);
    console.log("Completion history:", habit?.completionHistory);

    return habit?.completionHistory?.[dateKey] || false
  },
  // Helper function to get completion status for today
  updateHabitsForToday: () => {
    const { habits } = get()
    const today = new Date().toDateString()

    const updatedHabits = habits.map((habit) => ({
      ...habit,
      completed: habit.completionHistory?.[today] || false,
    }))

    set({ habits: updatedHabits })
  },

  editHabit: async (id: number, newValue: Partial<HabitType>) => {
    const { habits } = get()
    const newHabitList = [...habits]
    const index = newHabitList.findIndex((habit) => habit.id === id)
    if (index < 0) return

    newHabitList[index] = {
      ...newHabitList[index],
      ...newValue,
    }

    await AsyncStorage.setItem("my-habit", JSON.stringify(newHabitList))
    set(() => ({ habits: newHabitList }))
  },

  setHabits: (habits: HabitType[]) => {
    set(() => ({
      habits: habits,
    }))
  },

  setProgress: (progress: any[]) => {
    set(() => ({
      progress: progress,
    }))
  },

  setCalendar: (calendar: any[]) => {
    set(() => ({
      calendar: calendar,
    }))
  },
  clearStore:async () => {
     await AsyncStorage.removeItem("my-habit")
    set(() => ({
      habits:[],
      progress: [],
      calendar: [],
    }))
  },
}))

export const useEditStore = create<editStoreType>((set) => ({
  editId: null,
  setEditId: (id: number) => {
    set(() => ({
      editId: id,
    }))
  },
  clearEditId: () => {
    set(() => ({
      editId: null,
    }))
  },
}))
