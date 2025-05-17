import React, { useEffect, useState } from "react";
import { BackHandler, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useEditStore, useHabitStore, useHabitTextStore } from "../Store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HabitItem from "../Components/HabitItem";

function HomeScreen({ navigation }: any) {

  useEffect(() => {
    const onBackPress = () => {
      BackHandler.exitApp()
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandler.remove();
  }, []);

  const { habitText, setHabitText } = useHabitTextStore(state => state);
  const { habits, addHabit, deleteHabit, handleDone, setHabits } = useHabitStore(state => state);

  useEffect(() => {
    const getHabits = async () => {
      try {
        const habits = await AsyncStorage.getItem("my-habit");
        if (habits) {
          setHabits(JSON.parse(habits));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getHabits();
  }, []);


  // Get the current date
  const today = new Date();
  //Get the Week Day in String
  const weekDay = today.toLocaleDateString('en-US', { weekday: 'long' });
  //Get the Day with Suffix
  const day = today.getDate();

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21)
      return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  const dayWithSuffix = `${day}${getDaySuffix(day)}`;
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const year = today.getFullYear();

  //Get the Date in the format (Monday , 23rd Decemeber 2025)
  const formattedDate = `${weekDay}, ${dayWithSuffix} of ${month}, ${year}`;

  // Move state here (top level of the component)
  const tasks = [
    { id: 1, task: "Exercise", completed: false, behavior: "Good", weekDay: "EveryDay", time: "Morning" },
    { id: 2, task: "Meditation", completed: true, behavior: "Good", weekDay: "WednesDay", time: "Afternoon" },
    { id: 3, task: "Reading", completed: false, behavior: "Good", weekDay: "Monday", time: "Evening" },
    { id: 4, task: "Skipping Dinner", completed: true, behavior: "Bad", weekDay: "EveryDay", time: "Night" },
  ];




  //const [checked, setChecked] = useState([false, false, false]);
  const todayHabits=habits.filter(habit=>habit.frequency==="Daily" || habit.frequency=='Weekly' && habit.weekDay.includes(weekDay));
  const completedTasks = todayHabits.filter(habit=>habit.completed).length;
  const totalTodayTasks = tasks.length; 
  const progress = (completedTasks / totalTodayTasks) * 100;

  const { setEditId } = useEditStore();

  //sort habits
  const timeOrder={
    Morning:1,
    Afternoon:2,
    Evening:3,
    Night:4,
  }
  const sortedHabits=habits
  .filter(item=>
    item.frequency==='Daily' ||
    (item.frequency==='Weekly' && item.weekDay.includes(weekDay))
  )
  
  .sort((a,b)=>{
    if(a.completed !== b.completed){
      return a.completed ? 1 : -1;
    }
    return timeOrder[a.timeRange as keyof typeof timeOrder] - 
    timeOrder[b.timeRange as keyof typeof timeOrder];
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <ImageBackground
          source={require('../Assets/background.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Good day</Text>
              <Text style={styles.userName}>Hi Rashmika</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

        </ImageBackground>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.circle}>
              <View
                style={[
                  styles.fill,
                  { height: `${progress}%`, backgroundColor: '#5271FF' }
                ]}
              />
              <Text style={styles.percentText}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </View>
        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>Today habits</Text>
         <ScrollView style={styles.habitsList}>
            <FlatList
              data={sortedHabits}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>
                <TouchableOpacity onPress={() => {
                  setEditId(item.id);
                  navigation.naviagte('Edit');
                }}>
                  {
                    <HabitItem habit={item} />
                  }
                </TouchableOpacity>
                
              }
            />
         </ScrollView>

        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(165, 192, 237, 0.1)',
  },
  headerSection: {
    height: 180,
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
    marginTop: 20,
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
  dateContainer: {
    marginTop: 16,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  progressBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
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
    fontSize: 22,
    color: '#333333',
  },
  tasksList: {
    gap: 8,
  },

  icon: {
    width: 30,
    height: 30,
    tintColor: '#666666',
  },
  iconLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  habitsContainer: {
    paddingHorizontal: 20,
    padding:20,
    borderRadius: 16,
    backgroundColor: '#FFF',
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
  },

  addIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5271FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#5271FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    bottom: 10,
  },
  addIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  habitsList:{
      height: '55%',
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#F5F7FA',
  }
});

export default HomeScreen;
