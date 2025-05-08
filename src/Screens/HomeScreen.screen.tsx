import React, { useEffect, useState } from "react";
import { BackHandler, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useHabitStore, useHabitTextStore } from "../Store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    return () =>backHandler.remove();
  },[]);

  const{habitText,setHabitText}=useHabitTextStore(state=>state);
  const{habits,addHabit,deleteHabit,handleDone,setHabits}=useHabitStore(state=>state);

  useEffect(()=>{
    const getHabits=async()=>{
      try{
        const habits=await AsyncStorage.getItem("my-habit");
        if(habits){
          setHabits(JSON.parse(habits));
        }
      }catch (error) {
        console.log(error);
      }
    };
    getHabits();
  },[]);


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

  //Function to get the relevant time icon
  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'Morning':
        return require("../Assests/morning.png");
      case 'Afternoon':
        return require("../Assests/afternoon.png");
      case 'Evening':
        return require("../Assests/evening.png");
      case 'Night':
        return require("../Assests/night.png");
      default:
        return null;
    }

  };


  const [checked, setChecked] = useState([false, false, false]);

  const completedTasks = checked.filter(Boolean).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  const toggleCheckBox = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <ImageBackground
          source={require('../Assests/background.jpg')}
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}> Today Tasks</Text>
          <View style={styles.tasksList}>
            {tasks.map((task, index) => (
              <View key={index} style={styles.task}>
                <CheckBox
                  value={checked[index]}
                  onValueChange={() => toggleCheckBox(index)}
                  tintColors={{ true: '#5271FF', false: '#CCCCCC' }}
                />
                <Text style={styles.taskText}>{task.task}</Text>
                <Image source={require("../Assests/delete.png")} style={styles.deleteIcon}></Image>
              </View>
            ))}
          </View>

        </View>

      </View>


      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.iconContainer}>
            <Image source={require("../Assests/home.png")} style={styles.icon} />
            <Text style={styles.iconLabel}>Home</Text>
          </View>
          <View style={styles.addIconContainer}>
            <Image source={require("../Assests/add.png")} style={styles.addIcon} />
          </View>
          <View style={styles.iconContainer}>
            <Image source={require("../Assests/task.png")} style={styles.icon} />
            <Text style={styles.iconLabel}>Tasks</Text>
          </View>
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
  task: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(111, 154, 227, 0.13)',
    borderRadius: 10,
    marginVertical: 4,
  },
  taskText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333333',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: '#5271FF',
    marginLeft: 'auto',
    tintColor: "rgba(249, 15, 15, 0.95)"
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default HomeScreen;
