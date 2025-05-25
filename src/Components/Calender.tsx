"use client"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"
import { useHabitStore } from "../Store/habitStore"

const Calendar = ({ onDateSelect }: { onDateSelect?: (date: string) => void }) => {
  const [progressData, setProgressData] = useState<{ [date: string]: number }>({})
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString())
  const { habits, isHabitCompletedOnDate } = useHabitStore()

  useEffect(() => {
    const loadProgress = async () => {
      const data: { [date: string]: number } = {}
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = date.toDateString()
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

        // Calculate progress based on habit completion for this specific date
        const dayHabits = habits.filter((habit) => {
          if (habit.behavior !== "Good") return false // Only count good habits for progress
          if (habit.frequency === "Daily") return true
          if (habit.frequency === "Weekly") return habit.weekDay.includes(dayName)
          return false
        })

        const completedHabits = dayHabits.filter((habit) => isHabitCompletedOnDate(habit.id, dateString)).length

        const totalHabits = dayHabits.length
        const progress = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100

        data[dateString] = progress
      }
      setProgressData(data)
    }

    if (habits.length > 0) {
      loadProgress()
    }
  }, [habits, isHabitCompletedOnDate])

  // Set today as default selected date
  useEffect(() => {
    const today = new Date().toDateString()
    setSelectedDate(today)
    if (onDateSelect) {
      onDateSelect(today)
    }
  }, [])

  const getColor = (progress: number) => {
    if (progress === 100) return "#166534"
    if (progress > 50) return "#4ade80"
    if (progress > 0) return "#bbf7d0"
    return "#f3f4f6"
  }

  const handleDatePress = (dateStr: string) => {
    setSelectedDate(dateStr)
    if (onDateSelect) {
      onDateSelect(dateStr)
    }
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
    >
      {Object.entries(progressData).map(([dateStr, progress]) => {
        const date = new Date(dateStr)
        const day = date.getDate()
        const isToday = new Date().toDateString() === date.toDateString()
        const isSelected = selectedDate === dateStr

        return (
          <TouchableOpacity
            key={dateStr}
            style={[
              styles.dayBox,
              { backgroundColor: getColor(progress) },
              isToday && styles.todayBox,
              isSelected && styles.selectedBox,
            ]}
            onPress={() => handleDatePress(dateStr)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayText, isToday && styles.todayText, isSelected && styles.selectedText]}>{day}</Text>
            {progress > 0 && <Text style={styles.progressText}>{Math.round(progress)}%</Text>}
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(152, 164, 236, 0.99)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "rgba(51, 4, 99, 0.32)",
  },
  dayText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  progressText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 8,
    marginTop: 1,
  },
  todayBox: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: "#5271FF",
    transform: [{ scale: 1.05 }],
  },
  todayText: {
    fontWeight: "700",
  },
  selectedText: {
    fontWeight: "700",
    color: "#5271FF",
  },
})

export default Calendar
