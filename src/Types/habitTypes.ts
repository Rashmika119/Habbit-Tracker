export type HabitType = {
  id: number
  task: string
  description: string
  frequency: string
  completed: boolean
  behavior: string
  weekDay: string[]
  timeRange: string
  completionHistory: Record<string, boolean> // Add completion history tracking
}

export type habitTextType = {
  habitText: HabitType
  setHabitText: (value: string | boolean | string[] | Record<string, boolean>, key: keyof HabitType) => void
  clearHabitText: () => void
}

export type habitStoreType = {
  habits: HabitType[]
  progress: any[]
  calendar: any[]

  addHabit: () => void
  deleteHabit: (id: number | undefined) => void
  handleDone: (id: number, date?: string) => void // Updated to accept optional date
  editHabit: (id: number, newValue: Partial<HabitType>) => void
  setHabits: (habits: HabitType[]) => void
  setProgress: (progress: any[]) => void
  setCalendar: (calendar: any[]) => void
  isHabitCompletedOnDate: (habitId: number, date: string) => boolean // Add helper function
  updateHabitsForToday: () => void // Add helper function
}

export type editStoreType = {
  editId: number | null
  setEditId: (id: number) => void
  clearEditId: () => void
}
