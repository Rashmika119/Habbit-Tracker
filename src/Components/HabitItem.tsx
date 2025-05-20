import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHabitStore } from "../Store/habitStore";
import CheckBox from "@react-native-community/checkbox";
import { useState } from "react";

type HabitType = {
    id: number;
    task: string;
    description: string;
    frequency: string;
    completed: boolean;
    behavior: string;
    weekDay: string[];
    timeRange: string;
}

const HabitItem = ({ habit }: { habit: HabitType }) => {
    const [checked, setChecked] = useState([false, false, false]);

    const { handleDone, deleteHabit } = useHabitStore(state => state)
    const confirmDelete = () => {
        Alert.alert("Delete Habit",
            `Are you sure you want to delete this Habit --${habit.task}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => deleteHabit(habit.id)
                }
            ],
            {
                cancelable: true,

            }
        )
    };

    //Function to get the relevant time icon
    const getTimeIcon = (time: string) => {
        switch (time) {
            case 'Morning':
                return require("../Assets/morning.png");
            case 'Afternoon':
                return require("../Assets/afternoon.png");
            case 'Evening':
                return require("../Assets/evening.png");
            case 'Night':
                return require("../Assets/night.png");
            default:
                return null;
        }

    };

    return (
        <View>
            <View style={[
                styles.task,
                habit.behavior === 'Good' ?
                    styles.goodHabit : styles.badHabit]}>
                <CheckBox
                    value={habit.completed}
                    onValueChange={() => handleDone(habit.id)}
                    tintColors={{ true: '#5271FF', false: '#CCCCCC' }}
                />
                <Image
                    source={getTimeIcon(habit.timeRange)}
                    style={styles.timeIcon}
                />

                <Text style={[styles.taskText, habit.completed && styles.habotTextCompleted]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {habit.task}
                </Text>
                <TouchableOpacity onPress={() => confirmDelete()}
                    style={styles.deleteButton}>
                    <Image source={require("../Assets/delete.png")} style={styles.deleteIcon}></Image>
                </TouchableOpacity>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    task: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'rgba(111, 154, 227, 0.13)',
        borderRadius: 10,
        marginVertical: 4,
    },
    goodHabit: {
        backgroundColor: 'rgba(173, 230, 181, 0.2)', // light greenish
    },

    badHabit: {
        backgroundColor: 'rgba(255, 189, 189, 0.2)', // light reddish
    },


    taskText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
    },
    habotTextCompleted: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontWeight: '400',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#FEE2E2',
        marginLeft: 12,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        tintColor: '#EF4444',
    },
    timeIcon: {
        width: 30,
        height: 30,
        marginHorizontal: 8,
        resizeMode: 'cover',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#dddddd',
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },


})
export default HabitItem