import { useCallback, useEffect, useState } from "react"
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEditStore, useHabitStore } from "../Store/habitStore"
import HabitItem from "../Components/HabitItem"
import { useFocusEffect } from "@react-navigation/native"
import { useThemeStore } from "../Store/themeStore"
import { darkTheme, lightTheme } from "../Themes/colors"

// Helper function to get the date for a specific weekday
const getDateForWeekDay = (weekDayName: string) => {
  const today = new Date();
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayOfWeek = today.getDay();
  const targetDayOfWeek = weekDays.indexOf(weekDayName);
  
  const dayDifference = targetDayOfWeek - currentDayOfWeek;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dayDifference);
  
  return targetDate.toDateString();
};

// Helper function to get current week's date range (Monday to Sunday)
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days since Monday (Monday = 0, Tuesday = 1, etc.)
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  // Get Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);
  
  // Generate all 7 days of the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date.toDateString());
  }
  
  return weekDates;
};

function TaskScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Daily") // 'Daily' or 'Weekly'
  const [selectedBehavior, setSelectedBehavior] = useState("Good") // 'Good' or 'Bad'
  const [selectedWeekDay, setSelectedWeekDay] = useState("Monday") // For weekly filtering

  const { habits, setHabits, isHabitCompletedOnDate } = useHabitStore((state) => state)
  const { setEditId } = useEditStore()

   const { isDarkMode } = useThemeStore()
  const theme = isDarkMode ? darkTheme : lightTheme
  const styles = createStyles(theme)

  // Week days for filtering
  const weekDays = [
    { short: "M", full: "Monday" },
    { short: "T", full: "Tuesday" },
    { short: "W", full: "Wednesday" },
    { short: "Th", full: "Thursday" },
    { short: "F", full: "Friday" },
    { short: "S", full: "Saturday" },
    { short: "Su", full: "Sunday" },
  ]

  // Get current day
  const today = new Date()
  const currentWeekDay = today.toLocaleDateString("en-US", { weekday: "long" })
  const todayString = today.toDateString()

  // Add this to ensure store loads data on first mount:
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const habitsData = await AsyncStorage.getItem("my-habit")
        if (habitsData) {
          const parsedHabits = JSON.parse(habitsData)
          const habitsWithHistory = parsedHabits.map((habit: any) => ({
            ...habit,
            completionHistory: habit.completionHistory || {},
          }))
          setHabits(habitsWithHistory)
        }
      } catch (error) {
        console.log(error)
      }
    }
    
    // Only initialize if habits array is empty
    if (habits.length === 0) {
      initializeStore()
    }
  }, [])

  // Set current weekday as default
  useEffect(() => {
    setSelectedWeekDay(currentWeekDay)
  }, [currentWeekDay])

  // Calculate weekly progress for ALL habits across the entire week
  const getWeeklyProgressForAllHabits = (behavior: string) => {
    const weekDates = getCurrentWeekDates();
    const weekDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    let totalPossibleCompletions = 0;
    let totalActualCompletions = 0;
    
    // For each day of the week
    weekDates.forEach((dateString, index) => {
      const dayName = weekDayNames[index];
      
      // Get all habits that should be done on this day
      const habitsForThisDay = habits.filter(habit => {
        if (habit.behavior !== behavior) return false;
        
        // Daily habits count every day
        if (habit.frequency === "Daily") return true;
        
        // Weekly habits only count on their specified days
        if (habit.frequency === "Weekly") {
          return habit.weekDay.includes(dayName);
        }
        
        return false;
      });
      
      // Count possible and actual completions for this day
      totalPossibleCompletions += habitsForThisDay.length;
      
      const completedHabits = habitsForThisDay.filter(habit => 
        isHabitCompletedOnDate(habit.id, dateString)
      ).length;
      
      totalActualCompletions += completedHabits;
    });
    
    return totalPossibleCompletions === 0 ? 0 : (totalActualCompletions / totalPossibleCompletions) * 100;
  };

  // Calculate Daily Progress for today (for the filtered habits list)
  const getDailyProgress = (behavior: string) => {
    const dailyHabits = habits.filter((habit) => habit.frequency === "Daily" && habit.behavior === behavior)
    const completedHabits = dailyHabits.filter((habit) => isHabitCompletedOnDate(habit.id, todayString)).length
    const totalHabits = dailyHabits.length
    return totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100
  }

  // Calculate Weekly Progress for selected day (for the filtered habits list)
  const getWeeklyProgress = (behavior: string) => {
    const weeklyHabits = habits.filter(
      (habit) => habit.frequency === "Weekly" && habit.behavior === behavior && habit.weekDay.includes(selectedWeekDay),
    )
    
    const weekDayDate = getDateForWeekDay(selectedWeekDay);
    const completedHabits = weeklyHabits.filter((habit) => isHabitCompletedOnDate(habit.id, weekDayDate)).length
    const totalHabits = weeklyHabits.length
    return totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100
  }

  // Get filtered habits based on current selections
  const getFilteredHabits = () => {
    let filteredHabits

    if (selectedPeriod === "Daily") {
      filteredHabits = habits.filter((habit) => habit.frequency === "Daily" && habit.behavior === selectedBehavior)
    } else {
      filteredHabits = habits.filter(
        (habit) =>
          habit.frequency === "Weekly" &&
          habit.behavior === selectedBehavior &&
          habit.weekDay.includes(selectedWeekDay),
      )
    }

    const checkDate = selectedPeriod === "Daily" ? todayString : getDateForWeekDay(selectedWeekDay);
    const timeOrder = { Morning: 1, Afternoon: 2, Evening: 3, Night: 4 }

    return filteredHabits.sort((a, b) => {
      const aCompleted = isHabitCompletedOnDate(a.id, checkDate)
      const bCompleted = isHabitCompletedOnDate(b.id, checkDate)

      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1
      }
      return timeOrder[a.timeRange as keyof typeof timeOrder] - timeOrder[b.timeRange as keyof typeof timeOrder]
    })
  }

  // Use weekly progress for ALL habits for the progress circles
  const goodWeeklyProgress = getWeeklyProgressForAllHabits("Good");
  const badWeeklyProgress = getWeeklyProgressForAllHabits("Bad");
  
  const filteredHabits = getFilteredHabits()

  const getHabitItemDate = () => {
    return selectedPeriod === "Daily" ? todayString : getDateForWeekDay(selectedWeekDay);
  }

 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <ImageBackground source={require("../Assets/taskBackground.png")} style={styles.background} resizeMode="cover">
          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Tasks</Text>
              <Text style={styles.userName}>Analyze your tasks</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <Text style={styles.weekSubtitle}>Resets on every Monday</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View style={[styles.fill, { height: `${goodWeeklyProgress}%`, backgroundColor: theme.progress.good }]} />
                <Text style={styles.percentText}>{Math.round(goodWeeklyProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Good Habits</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View style={[styles.fill, { height: `${badWeeklyProgress}%`, backgroundColor: theme.progress.bad }]} />
                <Text style={styles.percentText}>{Math.round(badWeeklyProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Bad Habits</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Filter Habits</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "Daily" && styles.selectedButton]}
              onPress={() => setSelectedPeriod("Daily")}
            >
              <Text style={[styles.buttonText, selectedPeriod === "Daily" && styles.selectedButtonText]}>Daily</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "Weekly" && styles.selectedButton]}
              onPress={() => setSelectedPeriod("Weekly")}
            >
              <Text style={[styles.buttonText, selectedPeriod === "Weekly" && styles.selectedButtonText]}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedPeriod === "Weekly" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekDayContainer}>
              {weekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.weekDayButton, selectedWeekDay === day.full && styles.selectedWeekDay]}
                  onPress={() => setSelectedWeekDay(day.full)}
                >
                  <Text style={[styles.weekDayText, selectedWeekDay === day.full && styles.selectedWeekDayText]}>
                    {day.short}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habit Type</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.filterButton, selectedBehavior === "Good" && styles.selectedButton]}
              onPress={() => setSelectedBehavior("Good")}
            >
              <Text style={[styles.buttonText, selectedBehavior === "Good" && styles.selectedButtonText]}>Good</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedBehavior === "Bad" && styles.selectedButton]}
              onPress={() => setSelectedBehavior("Bad")}
            >
              <Text style={[styles.buttonText, selectedBehavior === "Bad" && styles.selectedButtonText]}>Bad</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedPeriod} {selectedBehavior} Habits
            {selectedPeriod === "Weekly" && ` - ${selectedWeekDay}`}
          </Text>

          {filteredHabits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {selectedBehavior.toLowerCase()} {selectedPeriod.toLowerCase()} habits found
                {selectedPeriod === "Weekly" && ` for ${selectedWeekDay}`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredHabits}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setEditId(item.id)
                    navigation.navigate("Edit")
                  }}
                >
                  <HabitItem habit={item} selectedDate={getHabitItemDate()} />
                </TouchableOpacity>
              )}
              style={styles.habitsList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.tertiary,
  },
  headerSection: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: theme.background.overlay,
  },
  header: {
    marginTop: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: theme.background.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.border.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.primary,
    marginBottom: 15,
  },
  weekSubtitle: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 15,
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.button.primary,
    backgroundColor: theme.background.card,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.button.primary,
    backgroundColor: theme.background.card,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: theme.button.primary,
    borderColor: theme.button.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.button.primary,
  },
  selectedButtonText: {
    color: theme.text.inverse,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  progressBar: {
    alignItems: "center",
    paddingVertical: 10,
    width: "45%",
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: theme.progress.background,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  percentText: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 18,
    color: theme.text.primary,
  },
  progressLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
  },
  weekDayContainer: {
    flexDirection: "row",
  },
  weekDayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.button.primary,
    backgroundColor: theme.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    elevation: 1,
  },
  selectedWeekDay: {
    backgroundColor: theme.button.primary,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.button.primary,
  },
  selectedWeekDayText: {
    color: theme.text.inverse,
  },
  habitsContainer: {
    backgroundColor: theme.background.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: theme.border.primary,
  },
  habitsList: {
    maxHeight: 400,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.text.secondary,
    textAlign: "center",
  },
})

export default TaskScreen