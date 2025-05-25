import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEditStore, useHabitStore } from "../Store/habitStore";
import HabitItem from "../Components/HabitItem";

function TaskScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Daily'); // 'Daily' or 'Weekly'
  const [selectedBehavior, setSelectedBehavior] = useState('Good'); // 'Good' or 'Bad'
  const [selectedWeekDay, setSelectedWeekDay] = useState('Monday'); // For weekly filtering

  const { habits, setHabits } = useHabitStore(state => state);
  const { setEditId } = useEditStore();

  // Week days for filtering
  const weekDays = [
    { short: 'M', full: 'Monday' },
    { short: 'T', full: 'Tuesday' },
    { short: 'W', full: 'Wednesday' },
    { short: 'Th', full: 'Thursday' },
    { short: 'F', full: 'Friday' },
    { short: 'S', full: 'Saturday' },
    { short: 'Su', full: 'Sunday' }
  ];

  // Get current day
  const today = new Date();
  const currentWeekDay = today.toLocaleDateString('en-US', { weekday: 'long' });

  // Load habits from storage
  useEffect(() => {
    const getHabits = async () => {
      try {
        const habitsData = await AsyncStorage.getItem("my-habit");
        if (habitsData) {
          setHabits(JSON.parse(habitsData));
        }
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    getHabits();
  }, []);

  // Reset daily habits every day
  useEffect(() => {
    const resetDailyHabitsIfNewDay = async () => {
      const todayDate = new Date().toDateString();
      const lastResetDate = await AsyncStorage.getItem("lastDailyResetDate");
      
      if (lastResetDate !== todayDate) {
        const updatedHabits = habits.map((habit) => ({
          ...habit,
          completed: habit.frequency === 'Daily' ? false : habit.completed,
        }));
        setHabits(updatedHabits);
        await AsyncStorage.setItem("my-habit", JSON.stringify(updatedHabits));
        await AsyncStorage.setItem('lastDailyResetDate', todayDate);
      }
    };
    
    if (loaded) {
      resetDailyHabitsIfNewDay();
    }
  }, [loaded, habits]);

  // Reset weekly habits every Monday
  useEffect(() => {
    const resetWeeklyHabitsIfNewWeek = async () => {
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)).toDateString(); // Monday of current week
      const lastWeeklyResetDate = await AsyncStorage.getItem("lastWeeklyResetDate");
      
      if (lastWeeklyResetDate !== currentWeekStart && currentWeekDay === 'Monday') {
        const updatedHabits = habits.map((habit) => ({
          ...habit,
          completed: habit.frequency === 'Weekly' ? false : habit.completed,
        }));
        setHabits(updatedHabits);
        await AsyncStorage.setItem("my-habit", JSON.stringify(updatedHabits));
        await AsyncStorage.setItem('lastWeeklyResetDate', currentWeekStart);
      }
    };
    
    if (loaded) {
      resetWeeklyHabitsIfNewWeek();
    }
  }, [loaded, habits, currentWeekDay]);

  // Calculate Daily Progress
  const getDailyProgress = (behavior: string) => {
    const dailyHabits = habits.filter(habit => habit.frequency === "Daily" && habit.behavior === behavior);
    const completedHabits = dailyHabits.filter(habit => habit.completed).length;
    const totalHabits = dailyHabits.length;
    return totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  };

  // Calculate Weekly Progress
  const getWeeklyProgress = (behavior: string) => {
    const weeklyHabits = habits.filter(habit => 
      habit.frequency === "Weekly" && 
      habit.behavior === behavior && 
      habit.weekDay.includes(selectedWeekDay)
    );
    const completedHabits = weeklyHabits.filter(habit => habit.completed).length;
    const totalHabits = weeklyHabits.length;
    return totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  };

  // Get filtered habits based on current selections
  const getFilteredHabits = () => {
    let filteredHabits;
    
    if (selectedPeriod === 'Daily') {
      filteredHabits = habits.filter(habit => 
        habit.frequency === 'Daily' && 
        habit.behavior === selectedBehavior
      );
    } else {
      filteredHabits = habits.filter(habit => 
        habit.frequency === 'Weekly' && 
        habit.behavior === selectedBehavior &&
        habit.weekDay.includes(selectedWeekDay)
      );
    }

    // Sort habits by time and completion status
    const timeOrder = { Morning: 1, Afternoon: 2, Evening: 3, Night: 4 };
    
    return filteredHabits.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return timeOrder[a.timeRange as keyof typeof timeOrder] - 
             timeOrder[b.timeRange as keyof typeof timeOrder];
    });
  };

  const goodProgress = selectedPeriod === 'Daily' 
    ? getDailyProgress('Good') 
    : getWeeklyProgress('Good');
    
  const badProgress = selectedPeriod === 'Daily' 
    ? getDailyProgress('Bad') 
    : getWeeklyProgress('Bad');

  const filteredHabits = getFilteredHabits();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
              <ImageBackground
                source={require('../Assets/taskBackground.png')}
                style={styles.background}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <View style={styles.header}>
                    <Text style={styles.welcomeText}>Tasks</Text>
                    <Text style={styles.userName}>Analys your tasks</Text>
                  </View>
                </View>
      
              </ImageBackground>
            </View>

      <ScrollView style={styles.content}>
        {/* Period Toggle Buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Period</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'Daily' && styles.selectedButton
              ]}
              onPress={() => setSelectedPeriod('Daily')}
            >
              <Text style={[
                styles.buttonText,
                selectedPeriod === 'Daily' && styles.selectedButtonText
              ]}>
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'Weekly' && styles.selectedButton
              ]}
              onPress={() => setSelectedPeriod('Weekly')}
            >
              <Text style={[
                styles.buttonText,
                selectedPeriod === 'Weekly' && styles.selectedButtonText
              ]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {selectedPeriod} Progress
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View
                  style={[
                    styles.fill,
                    { height: `${goodProgress}%`, backgroundColor: '#4ade80' }
                  ]}
                />
                <Text style={styles.percentText}>{Math.round(goodProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Good</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.circle}>
                <View
                  style={[
                    styles.fill,
                    { height: `${badProgress}%`, backgroundColor: '#f87171' }
                  ]}
                />
                <Text style={styles.percentText}>{Math.round(badProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Bad</Text>
            </View>
          </View>
        </View>

        {/* Weekly Day Filter (only show for weekly) */}
        {selectedPeriod === 'Weekly' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekDayContainer}>
              {weekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.weekDayButton,
                    selectedWeekDay === day.full && styles.selectedWeekDay
                  ]}
                  onPress={() => setSelectedWeekDay(day.full)}
                >
                  <Text style={[
                    styles.weekDayText,
                    selectedWeekDay === day.full && styles.selectedWeekDayText
                  ]}>
                    {day.short}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Behavior Filter Buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habit Type</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedBehavior === 'Good' && styles.selectedButton
              ]}
              onPress={() => setSelectedBehavior('Good')}
            >
              <Text style={[
                styles.buttonText,
                selectedBehavior === 'Good' && styles.selectedButtonText
              ]}>
                Good
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedBehavior === 'Bad' && styles.selectedButton
              ]}
              onPress={() => setSelectedBehavior('Bad')}
            >
              <Text style={[
                styles.buttonText,
                selectedBehavior === 'Bad' && styles.selectedButtonText
              ]}>
                Bad
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedPeriod} {selectedBehavior} Habits
            {selectedPeriod === 'Weekly' && ` - ${selectedWeekDay}`}
          </Text>
          
          {filteredHabits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {selectedBehavior.toLowerCase()} {selectedPeriod.toLowerCase()} habits found
                {selectedPeriod === 'Weekly' && ` for ${selectedWeekDay}`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredHabits}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setEditId(item.id);
                  navigation.navigate('Edit');
                }}>
                  <HabitItem habit={item} />
                </TouchableOpacity>
              )}
              style={styles.habitsList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(165, 192, 237, 0.1)',
  },
 headerSection: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: 'rgba(4, 97, 98, 0.3)',
  },
  header: {
    marginTop: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5271FF',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5271FF',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#5271FF',
    borderColor: '#5271FF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5271FF',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressBar: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '45%',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  percentText: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333333',
  },
  progressLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  weekDayContainer: {
    flexDirection: 'row',
  },
  weekDayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5271FF',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    elevation: 1,
  },
  selectedWeekDay: {
    backgroundColor: '#5271FF',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5271FF',
  },
  selectedWeekDayText: {
    color: '#ffffff',
  },
  habitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  habitsList: {
    maxHeight: 400,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default TaskScreen;