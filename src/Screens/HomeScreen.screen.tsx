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
  Modal,
  Animated,
  Dimensions,
  Switch,
} from "react-native"
import { useEditStore, useHabitStore, useHabitTextStore } from "../Store/habitStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import HabitItem from "../Components/HabitItem"
import { useAuthStore } from "../Store/useAuthStore"
import Calendar from "../Components/Calender"
import { useTheme } from "../hooks/useTheme"
import { useUserStore, useUserTextStore } from "../Store/userStore"

const { width: screenWidth } = Dimensions.get("window")

function HomeScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString())
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [slideAnim] = useState(new Animated.Value(-screenWidth * 0.8))

  // Use theme hook
  const { theme, isDarkMode, toggleTheme, loadTheme } = useTheme()

  //exit the app functionality
  useEffect(() => {
    const onBackPress = () => {
      if (sidebarVisible) {
        closeSidebar()
        return true
      }
      return true
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)
    return () => backHandler.remove()
  }, [sidebarVisible])

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

  // Load theme on component mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Update habits for today when loaded
  useEffect(() => {
    if (loaded) {
      updateHabitsForToday()
    }
  }, [loaded])

  // Sidebar animation functions
  const openSidebar = () => {
    setSidebarVisible(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -screenWidth * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false)
    })
  }

  const clearCurrentUser = useAuthStore(state => state.clearCurrentUser)
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn)
  const clearStore = useHabitStore(state => state.clearStore)

  // Logout function
  const handleLogout = async () => {
    console.log("Logout initiated")
    try {

      // Clear auth store

      clearCurrentUser()
      setIsLoggedIn(false)

      clearStore()

      // Clear user text store if needed
      const { clearUserText, } = useUserTextStore.getState()
      clearUserText()

      // Close sidebar and navigate
      closeSidebar()
      console.log("Closed sidebar")

    } catch (error) {
      console.log("Logout error:", error)
    }
  }

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

  // Create dynamic styles
  const styles = createStyles(theme)

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar Modal */}
      <Modal visible={sidebarVisible} transparent={true} animationType="none" onRequestClose={closeSidebar}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeSidebar} />
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          
            {/* Menu Items */}
            <View style={styles.menuSection}>
              {/* Theme Toggle */}
              <View style={styles.menuItem}>
                <Text style={styles.menuText}>{isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#767577", true: theme.button.primary }}
                  thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                />
              </View>

              {/* Profile */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeSidebar()
                  // navigation.navigate("Profile")
                }}
              >
                <Text style={styles.menuText}>👤 Profile</Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.headerSection}>
        <ImageBackground source={require("../Assets/background.jpg")} style={styles.background} resizeMode="cover">
          <View style={styles.overlay}>
            <View style={styles.header}>
              {/* Menu Icon */}
              <TouchableOpacity style={styles.menuIcon} onPress={openSidebar}>
                <Text style={styles.menuIconText}>☰</Text>
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Text style={styles.welcomeText}>Good day</Text>
                <Text style={styles.userName}>{username?.toUpperCase()}</Text>
              </View>
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
                <View style={[styles.fill, { height: `${goodHabitProgress}%`, backgroundColor: theme.text.success }]} />
                <Text style={styles.percentText}>{Math.round(goodHabitProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Good</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View style={[styles.fill, { height: `${badHabitProgress}%`, backgroundColor: theme.text.error }]} />
                <Text style={styles.percentText}>{Math.round(badHabitProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Bad</Text>
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.tertiary,
      flexDirection: "column",
    },
    headerSection: {
      height: 150,
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
      
      flexDirection: "row",
      alignItems: "flex-start",
    },
    menuIcon: {
      padding: 8,
      marginRight: 12,
    },
    menuIconText: {
      fontSize: 24,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    headerContent: {
      flex: 1,
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
      paddingHorizontal: 48,
    },
    dateText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "500",
      opacity: 0.9,
    },
    // Sidebar Styles
    modalOverlay: {
      flex: 1,
      flexDirection: "row",
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sidebar: {
      width: screenWidth * 0.8,
      height: "100%",
      backgroundColor: theme.background.card,
      paddingTop: 50,
      elevation: 5,
      shadowColor: theme.shadow.primary,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.primary,
      marginBottom: 20,
    },

    menuSection: {
      flex: 1,
      paddingHorizontal: 20,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 15,
      marginBottom: 5,
      borderRadius: 10,
    },
    menuText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.primary,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.error,
    },
    streakTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text.primary,
      marginBottom: 8,
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
      paddingTop: 8,
    },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 15,
      elevation: 2,
      shadowColor: theme.shadow.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text.primary,
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
      borderColor: theme.border.secondary,
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
      color: theme.text.primary,
    },
    progressLabel: {
      color: theme.text.primary,
      marginTop: 8,
    },
    habitsContainer: {
      flex: 1,
      paddingHorizontal: 20,
      padding: 20,
      borderRadius: 16,
      backgroundColor: theme.background.card,
      shadowColor: theme.shadow.primary,
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
      borderColor: theme.button.primary,
      backgroundColor: theme.background.card,
      shadowColor: theme.shadow.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
    habitsList: {
      paddingHorizontal: 10,
      backgroundColor: theme.background.secondary,
    },
  })

export default HomeScreen
