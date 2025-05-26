import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useHabitStore } from "../Store/habitStore"
import { useThemeStore } from "../Store/themeStore"

import CheckBox from "@react-native-community/checkbox"
import { getTheme } from "../Themes/colors"

type HabitType = {
  id: number
  task: string
  description: string
  frequency: string
  completed: boolean
  behavior: string
  weekDay: string[]
  timeRange: string
  completionHistory: Record<string, boolean>
}

const HabitItem = ({ habit, selectedDate }: { habit: HabitType; selectedDate?: string }) => {
  const { handleDone, deleteHabit, isHabitCompletedOnDate } = useHabitStore((state) => state)
  const { isDarkMode } = useThemeStore()

  const theme = getTheme(isDarkMode)
  const styles = createStyles(theme)

  const currentDate = selectedDate || new Date().toDateString()
  const isCompleted = isHabitCompletedOnDate(habit.id, currentDate)

  const confirmDelete = () => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.task}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(habit.id),
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  // Get your time range icons
  const getTimeIcon = (time: string) => {
    switch (time) {
      case "Morning":
        return require("../Assets/morning.png")
      case "Afternoon":
        return require("../Assets/afternoon.png")
      case "Evening":
        return require("../Assets/evening.png")
      case "Night":
        return require("../Assets/night.png")
      default:
        return require("../Assets/morning.png") // fallback
    }
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.habitCard,
        isCompleted && styles.completedCard,
        habit.behavior === "Good" ? styles.goodHabit : styles.badHabit
      ]}>

        {/* Left side - Checkbox and content */}
        <View style={styles.leftContent}>
          <CheckBox
            value={isCompleted}
            onValueChange={() => handleDone(habit.id, currentDate)}
            tintColors={{
              true: habit.behavior === "Good" ? "#10B981" : "#EF4444",
              false: theme.border.secondary
            }}
            style={styles.checkbox}
          />

          <View style={styles.textContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.habitTitle, isCompleted && styles.completedText]}>
                {habit.task}
              </Text>
              {/* Clean text badge */}
              <View style={styles.behaviorBadge}>
                <Text style={styles.frequencyText}>
                  {habit.frequency}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.timeContainer}>
                <Image
                  source={getTimeIcon(habit.timeRange)}
                  style={[styles.timeIcon, { tintColor: theme.text.secondary }]}
                />
              </View>
              <Text style={styles.frequencyText}>
                {habit.frequency}
              </Text>
            </View>
          </View>
        </View>

        {/* Right side - Delete button */}
        <TouchableOpacity
          onPress={confirmDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={require("../Assets/delete.png")}
            style={[styles.deleteIcon, { tintColor: theme.text.secondary }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginVertical: 2, // Reduced from 4
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.background.card,
    borderRadius: 12, // Reduced from 16
    padding: 10, // Reduced from 16
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 1 }, // Reduced shadow
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  goodHabit: {
    borderLeftWidth: 3, // Reduced from 4
    borderLeftColor: "#10B981",
  },
  badHabit: {
    borderLeftWidth: 3, // Reduced from 4
    borderLeftColor: "#EF4444",
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: theme.isDarkMode ? "#1F2937" : "#F9FAFB",
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8, // Reduced from 12
    transform: [{ scale: 1.1 }], // Slightly smaller
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2, // Reduced from 4
  },
  habitTitle: {
    fontSize: 15, // Reduced from 16
    fontWeight: "600",
    color: theme.text.primary,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: theme.text.disabled,
  },
  // Clean text badge
  behaviorBadge: {
    paddingHorizontal: 6, 
    paddingVertical: 1, 
    borderRadius: 10, 
    marginLeft: 6, 
  },
  badgeText: {
    fontSize: 9, 
    fontWeight: "600",
    textTransform: "uppercase",
  },
  goodBadgeText: {
    color: "#166534",
  },
  badBadgeText: {
    color: "#991B1B",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Reduced from 12
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Reduced from 6
  },
  timeIcon: {
    width: 14, // Reduced from 16
    height: 14, // Reduced from 16
    resizeMode: 'contain',
  },
  timeText: {
    fontSize: 13, // Reduced from 14
    color: theme.text.secondary,
    fontWeight: "500",
  },
  frequencyText: {
    fontSize: 11, // Reduced from 12
    color: theme.text.secondary,
    backgroundColor: theme.isDarkMode ? "#374151" : "#F3F4F6",
    paddingHorizontal: 6, // Reduced from 8
    paddingVertical: 1, // Reduced from 2
    borderRadius: 6, // Reduced from 8
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8, // Reduced from 12
    borderRadius: 10, // Reduced from 12
    backgroundColor: theme.isDarkMode ? "#374151" : "#F3F4F6",
    marginLeft: 8, // Reduced from 12
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 18, // Reduced from 20
    height: 18, // Reduced from 20
    resizeMode: 'contain',
  },
})

export default HabitItem