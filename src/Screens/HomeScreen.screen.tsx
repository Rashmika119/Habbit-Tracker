"use client"

import { useEffect, useState } from "react"
import {
  BackHandler,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useEditStore, useHabitStore, useHabitTextStore } from "../Store/habitStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import HabitItem from "../Components/HabitItem"

import { useAuthStore } from "../Store/useAuthStore"
import Calendar from "../Components/Calender"

function HomeScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString())

  //exit the app functionality
  useEffect(() => {
    const onBackPress = () => {
      BackHandler.exitApp()
      return true
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)
    return () => backHandler.remove()
  }, [])

  const { habitText, setHabitText } = useHabitTextStore((state) => state)
  const { habits, addHabit, deleteHabit, handleDone, setHabits, updateHabitsForToday, isHabitCompletedOnDate } =
    useHabitStore((state) => state)

  //getting habits from async storage
  useEffect(() => {
    const getHabits = async () => {
      try {
        const habitsData = await AsyncStorage.getItem("my-habit")
        if (habitsData) {
          const parsedHabits = JSON.parse(habitsData)
          // Ensure all habits have completionHistory
          const habitsWithHistory = parsedHabits.map((habit: any) => ({
            ...habit,
            completionHistory: habit.completionHistory || {},
          }))
          setHabits(habitsWithHistory)
        }
        setLoaded(true)
      } catch (error) {
        console.log(error)
      }
    }
    getHabits()
  }, [])

  // Update habits for today when loaded
  useEffect(() => {
    if (loaded) {
      updateHabitsForToday()
    }
  }, [loaded])

  // Handle date selection from calendar
  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString)
  }

  // Get the current date or selected date
  const currentDate = new Date(selectedDate)
  const weekDay = currentDate.toLocaleDateString("en-US", { weekday: "long" })
  const day = currentDate.getDate()

  //suffixes for date
  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  //getting days,date and month to make the formatted date
  const dayWithSuffix = `${day}${getDaySuffix(day)}`
  const month = currentDate.toLocaleDateString("en-US", { month: "long" })
  const year = currentDate.getFullYear()

  //Get the Date in the format (Monday , 23rd December 2025)
  const formattedDate = `${weekDay}, ${dayWithSuffix} of ${month}, ${year}`

  // Calculate progress for selected date
  const getHabitsForDate = (behavior: string) => {
    return habits.filter((habit) => {
      if (habit.behavior !== behavior) return false
      if (habit.frequency === "Daily") return true
      if (habit.frequency === "Weekly") return habit.weekDay.includes(weekDay)
      return false
    })
  }

  const todayGoodHabits = getHabitsForDate("Good")
  const completedGoodHabits = todayGoodHabits.filter((habit) => isHabitCompletedOnDate(habit.id, selectedDate)).length
  const totalTodayGoodHabits = todayGoodHabits.length
  const goodHabitProgress = totalTodayGoodHabits === 0 ? 0 : (completedGoodHabits / totalTodayGoodHabits) * 100

  const todayBadHabits = getHabitsForDate("Bad")
  const completedBadHabits = todayBadHabits.filter((habit) => isHabitCompletedOnDate(habit.id, selectedDate)).length
  const totalTodayBadHabits = todayBadHabits.length
  const badHabitProgress = totalTodayBadHabits === 0 ? 0 : (completedBadHabits / totalTodayBadHabits) * 100

  const { setEditId } = useEditStore()

  //sort habits
  const timeOrder = {
    Morning: 1,
    Afternoon: 2,
    Evening: 3,
    Night: 4,
  }

  //sorting habits morning-->night and push bottom the completed tasks
  const sortedHabits = habits
    .filter((item) => item.frequency === "Daily" || (item.frequency === "Weekly" && item.weekDay.includes(weekDay)))
    .sort((a, b) => {
      const aCompleted = isHabitCompletedOnDate(a.id, selectedDate)
      const bCompleted = isHabitCompletedOnDate(b.id, selectedDate)

      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1
      }
      return timeOrder[a.timeRange as keyof typeof timeOrder] - timeOrder[b.timeRange as keyof typeof timeOrder]
    })

  //good habit or Bad habit
  const [selectedBehavior, setSelectedBehavior] = useState("Good")
  const goodHabits = sortedHabits.filter((habit) => habit.behavior === "Good")
  const badHabits = sortedHabits.filter((habit) => habit.behavior === "Bad")

  const filteredHabits = selectedBehavior === "Good" ? goodHabits : badHabits

  const username = useAuthStore((state) => state.currentUser?.username)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <ImageBackground source={require("../Assets/background.jpg")} style={styles.background} resizeMode="cover">
          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Good day</Text>
              <Text style={styles.userName}>{username?.toUpperCase()}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.streakContainer}>
        <Text style={styles.streakTitle}>Your good habits streak</Text>
        <View style={styles.calenderContainer}>
          <Calendar onDateSelect={handleDateSelect} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {selectedDate === new Date().toDateString() ? "Today" : "Selected Day"} Progress
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View style={[styles.fill, { height: `${goodHabitProgress}%`, backgroundColor: "#4ade80" }]} />
                <Text style={styles.percentText}>{Math.round(goodHabitProgress)}%</Text>
              </View>
              <Text>Good</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View style={[styles.fill, { height: `${badHabitProgress}%`, backgroundColor: "#f87171" }]} />
                <Text style={styles.percentText}>{Math.round(badHabitProgress)}%</Text>
              </View>
              <Text>Bad</Text>
            </View>
          </View>
        </View>

        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedDate === new Date().toDateString() ? "Today" : weekDay} habits
          </Text>

          {/*Filter buttons*/}
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

          <ScrollView style={styles.habitsList}>
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
                  <HabitItem habit={item} selectedDate={selectedDate} />
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(165, 192, 237, 0.1)",
    flexDirection: "column",
  },
  headerSection: {
    height: 150,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
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
    backgroundColor: "rgba(4, 97, 98, 0.3)",
  },
  header: {
    marginTop: 8,
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
  dateContainer: {
    marginTop: 8,
    marginBottom: 10,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    paddingLeft: 20,
  },
  streakContainer: {
    paddingTop: 20,
  },
  calenderContainer: {
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  progressBar: {
    alignItems: "center",
    paddingVertical: 10,
    width: "45%",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "#EEEEEE",
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
    fontSize: 22,
    color: "#333333",
  },
  tasksList: {
    gap: 8,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#666666",
  },
  iconLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  habitsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
    gap: 10,
  },
  filterButton: {
    width: 120,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#5271FF",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: "#5271FF",
    borderColor: "#5271FF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5271FF",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  addIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5271FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#5271FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    bottom: 10,
  },
  addIcon: {
    width: 28,
    height: 28,
    tintColor: "#FFFFFF",
  },
  habitsList: {
    paddingHorizontal: 10,
    backgroundColor: "#F5F7FA",
  },
})

export default HomeScreen
