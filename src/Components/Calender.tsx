"use client"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"
import { useHabitStore } from "../Store/habitStore"
import { useThemeStore } from "../Store/themeStore"
import { getTheme } from "../Themes/colors"


const Calendar = ({ onDateSelect }: { onDateSelect?: (date: string) => void }) => {
  const [progressData, setProgressData] = useState<{ [date: string]: number }>({})
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString())
  const { habits, isHabitCompletedOnDate } = useHabitStore()
  const { isDarkMode } = useThemeStore()
  
  const theme = getTheme(isDarkMode)

  useEffect(() => {
    const loadProgress = async () => {
      const data: { [date: string]: number } = {}
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = date.toDateString()
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" })

        const dayHabits = habits.filter((habit) => {
          if (habit.behavior !== "Good") return false
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

  useEffect(() => {
    const today = new Date().toDateString()
    setSelectedDate(today)
    if (onDateSelect) {
      onDateSelect(today)
    }
  }, [])

  const getColor = (progress: number) => {
    if (isDarkMode) {
      // Dark mode colors with better contrast
      if (progress === 100) return '#10B981' // Bright green
      if (progress > 50) return '#059669' // Medium green
      if (progress > 0) return '#065F46' // Dark green
      return '#374151' // Dark gray
    } else {
      // Light mode colors
      if (progress === 100) return '#10B981' // Green
      if (progress > 50) return '#6EE7B7' // Light green
      if (progress > 0) return '#D1FAE5' // Very light green
      return '#F3F4F6' // Light gray
    }
  }

  const getTextColor = (progress: number, isToday: boolean, isSelected: boolean) => {
    if (isSelected || isToday) {
      return theme.button.primary // Use theme primary color for selected/today
    }
    
    if (isDarkMode) {
      // Dark mode text colors
      if (progress === 100) return '#FFFFFF' // White text on bright green
      if (progress > 50) return '#FFFFFF' // White text on medium green
      if (progress > 0) return '#D1FAE5' // Light green text on dark green
      return '#D1D5DB' // Light gray text on dark background
    } else {
      // Light mode text colors
      if (progress === 100) return '#FFFFFF' // White text on green
      if (progress > 50) return '#065F46' // Dark green text on light green
      if (progress > 0) return '#047857' // Medium green text on very light green
      return '#374151' // Dark text on light background
    }
  }

  const getProgressTextColor = (progress: number) => {
    if (isDarkMode) {
      if (progress >= 50) return '#FFFFFF' // White on darker backgrounds
      return '#D1D5DB' // Light gray on lighter backgrounds
    } else {
      if (progress >= 50) return '#FFFFFF' // White on darker backgrounds
      return '#374151' // Dark text on lighter backgrounds
    }
  }

  const handleDatePress = (dateStr: string) => {
    setSelectedDate(dateStr)
    if (onDateSelect) {
      onDateSelect(dateStr)
    }
  }

  const styles = createStyles(theme)

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
            <Text style={[
              styles.dayText, 
              { color: getTextColor(progress, isToday, isSelected) },
              isToday && styles.todayText, 
              isSelected && styles.selectedText
            ]}>
              {day}
            </Text>
            {progress > 0 && (
              <Text style={[
                styles.progressText, 
                { color: getProgressTextColor(progress) }
              ]}>
                {Math.round(progress)}%
              </Text>
            )}
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const createStyles = (theme: any) => StyleSheet.create({
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
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: theme.border.primary,
  },
  dayText: {
    fontWeight: "600",
    fontSize: 15,
  },
  progressText: {
    fontWeight: "500",
    fontSize: 8,
    marginTop: 1,
  },
  todayBox: {
    borderWidth: 2,
    borderColor: theme.button.primary,
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: theme.button.primary,
    transform: [{ scale: 1.05 }],
  },
  todayText: {
    fontWeight: "700",
  },
  selectedText: {
    fontWeight: "700",
  },
})

export default Calendar