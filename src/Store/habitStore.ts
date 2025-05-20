import {create} from 'zustand';
import { editStoreType, habitStoreType, habitTextType, HabitType } from '../Types/habitTypes';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useHabitTextStore=create<habitTextType>((set)=>({
   habitText: {
    id:0,
    task:"",
    description:"",
    frequency:"",
    completed:false,
    behavior:"",
    weekDay:[],
    timeRange:"",
   },

   setHabitText:(value:string | boolean | string[],key:keyof HabitType)=>{
    set((state)=>({
        habitText:{
            ...state.habitText,
            [key]:value,
        }
    }))
   },
   clearHabitText:()=>{
    set(()=>({
        habitText:{
            id:0,
            task:"",
            description:"",
            frequency:"",
            completed:false,
            behavior:"",
            weekDay:[],
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
            const isDaily=habitText.frequency==="Daily";
            const isWeekDayValid=isDaily ||habitText.weekDay.length>0;
            if(!habitText.task.trim() || !habitText.description.trim() || !habitText.timeRange.trim() || !habitText.behavior.trim() || !isWeekDayValid){
                Alert.alert("Please fill all the fields");
                return;
            }
            const newHabit={
                id:Math.random(),
                task:habitText.task,
                description:habitText.description,
                frequency:habitText.frequency,
                completed:false,
                behavior:habitText.behavior,
                weekDay:habitText.weekDay,
                timeRange:habitText.timeRange,
            };
            set((state)=>({
                habits:[...state.habits,newHabit]

            }))
            await AsyncStorage.setItem("my-habit",JSON.stringify(useHabitStore.getState().habits));
            Alert.alert("Habit Added Successfully");
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


export const useEditStore = create<editStoreType>((set) => ({
    editId: null,
    setEditId: (id: number) => {
        set(() => ({
            editId: id
        }))
    },
    clearEditId: () => {
        set(() => ({
            editId: null
        }))
    }
}))

  