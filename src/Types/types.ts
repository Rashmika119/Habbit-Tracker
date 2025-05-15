export type HabitType={
    id:number;
    task:string;
    description:string;
    frequency:string;
    completed:boolean;
    behavior:string;
    weekDay:string[];
    timeRange:string;
}

export type habitTextType={
    habitText:HabitType;
    setHabitText:(value:string | boolean | string[],key:keyof HabitType)=>void;
    clearHabitText: ()=> void;
}

export type habitStoreType={
    habits:HabitType[];
    addHabit:()=>void;
    deleteHabit:(id:number | undefined) => void;
    handleDone : (id:number) =>void;
    editHabit: (id:number,newValue:Partial<HabitType>)=>void;
    setHabits:(habits:HabitType[])=>void;
}