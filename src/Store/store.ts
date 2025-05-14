import {create} from 'zustand';
import { habitStoreType, habitTextType, HabitType } from '../Types/types';
import { Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useHabitTextStore=create<habitTextType>((set)=>({
   habitText: {
    id:0,
    task:"",
    description:"",
    completed:false,
    behavior:"",
    weekDay:"",
    timeRange:"",
   },

   setHabitText:(text:string,key:string)=>{
    set((state)=>({
        habitText:{
            ...state.habitText,
            [key]:text,
        }
    }))
   },
   clearHabitText:()=>{
    set(()=>({
        habitText:{
            id:0,
            task:"",
            description:"",
            completed:false,
            behavior:"",
            weekDay:"",
            timeRange:"",
        }
    }))
   }
}))

export const useHabitStore=create<habitStoreType>((set)=>({
    habits:[],
    addHabit:async()=>{
        const {habitText,setHabitText,clearHabitText}=useHabitTextStore.getState();
        try{
            if(!habitText || !habitText.task || habitText.task.trim()=== ""){
                return;
            }
            const newHabit={
                id:Math.random(),
                task:habitText.task,
                description:habitText.description,
                completed:false,
                behavior:habitText.behavior,
                weekDay:habitText.weekDay,
                timeRange:habitText.timeRange,
            };
            set((state)=>({
                habits:[...state.habits,newHabit]

            }))
            await AsyncStorage.setItem("my-habit",JSON.stringify(useHabitStore.getState().habits));
            clearHabitText();
            Keyboard.dismiss();
        }catch (error){
            console.log(error);
        }
    },
    deleteHabit:async(id: number | undefined)=>{
        try{
            const {habits} =useHabitStore.getState();
            const newHabits=habits.filter((habit) => habit.id !== id);

            await AsyncStorage.setItem("my-habit", JSON.stringify(newHabits))

            set({
                habits:newHabits
            });
        }catch (error){
            console.log("Delete error: ",error);
        }
    },
    handleDone:async(id:number)=>{
        try{
            const {habits}=useHabitStore.getState();

            const newHabits=habits.map((habit)=>{
                if (habit.id===id){
                    return{...habit,completed:!habit.completed}
                }
                return habit;
            });
            await AsyncStorage.setItem("my-habit",JSON.stringify(newHabits));

            set({
                habits:newHabits
            });
        }catch(error){
            console.log("Error in handleDone: ", error);
        }
    },
    setHabits:(habits:HabitType[])=>{
        set(()=>({
            habits:habits
        }))
    },
    editHabit:async(id:number | undefined,newValue)=>{
        const {habits}=useHabitStore.getState();
        const newList=[...habits];
        const index=newList.findIndex((habit)=>habit.id===id);
        if(index<0) return
        newList[index]={
            ...newList[index],
            ...newValue,
        }
        await AsyncStorage.setItem("my-habit",JSON.stringify(newList));
        set(()=>(
            {habits:newList}
        ))
    },

}))
  