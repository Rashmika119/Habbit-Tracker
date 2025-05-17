import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { Button, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import { useHabitStore, useHabitTextStore } from "../Store/store";

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ["Morning", "Afternoon", "Evening", "Night"]
export default function AddScreen() {

    const { habits, addHabit, setHabits } = useHabitStore(state => state);

    const { habitText, setHabitText } = useHabitTextStore(state => state)
    const [days, setDays] = useState<string[]>([]);


    const toggleDay = (day: string) => {
        const updatedDays=habitText.weekDay.includes(day)
        ?habitText.weekDay.filter(d=>d!==day)
        :[...habitText.weekDay,day];

        setHabitText(updatedDays,"weekDay");


    };


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../Assets/headerbackground.png')}
                style={styles.header}
                resizeMode="cover"
            >
                <Text style={styles.headerText}>Add Your Task Here</Text>
            </ImageBackground>
            <ScrollView style={styles.detailsContainer}>
                <View style={styles.section}>
                    <Text style={styles.label}>Enter the title of your task</Text>
                    <TextInput
                        style={styles.inputTitle}
                        placeholder="Habit Title"
                        value={habitText.task}
                        onChangeText={(text)=>setHabitText(text,"task")}
                        multiline={true}
                        textAlignVertical='top'
                        autoCorrect={false}
                    >
                    </TextInput>
                    <Text style={styles.label}>Enter the description of your task</Text>
                    <TextInput 
                    style={styles.inputDescription}
                    placeholder="Habit Description"
                    value={habitText.description}
                    onChangeText={(text)=>setHabitText(text,"description")}
                    multiline={true}
                    textAlignVertical="top"
                    autoCorrect={false}
                    >
                    </TextInput>

                </View>
                <View style={styles.section}>
                    <Text style={styles.label}
                    >
                        Select the frequency of your task
                    </Text>
                    <Picker
                        selectedValue={habitText.frequency}
                        onValueChange={(itemValue) => setHabitText(itemValue,"frequency")}
                        style={styles.picker}
                    >
                        <Picker.Item label="Daily" value="Daily" />
                        <Picker.Item label="Weekly" value="Weekly" />
                    </Picker>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Select the day of your task</Text>
                    <View style={styles.daysWrapper}>
                        {allDays.map((day) => (
                            <View key={day+habitText.weekDay.join(",")} style={styles.checkBoxItem}>
                                <CheckBox
                                    disabled={habitText.frequency === "Daily"}
                                    value={habitText.weekDay.includes(day)}
                                    onValueChange={() => toggleDay(day)}
                                />
                                <Text style={styles.dayText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Select Time of Day</Text>
                    <RadioButton.Group onValueChange={(itemValue)=>setHabitText(itemValue,"timeRange")} value={habitText.timeRange}>
                        <View style={styles.timeWrapper}>
                            {timeOptions.map((timeRange) => (
                                <View key={timeRange} style={styles.timeOption}>
                                    <RadioButton value={timeRange} />
                                    <Text>{timeRange}</Text>
                                </View>
                            ))}
                        </View>
                    </RadioButton.Group>

                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Is that habit good/bad</Text>
                    <RadioButton.Group onValueChange={(itemValue)=>{setHabitText(itemValue,"behavior")}} value={habitText.behavior}>
                        <View style={styles.behaviorRow}>
                            <View style={[styles.behaviorOption, styles.good]}>
                                <RadioButton value="Good" />
                                <Text style={styles.behaviorText}>Good</Text>
                            </View>
                            <View style={[styles.behaviorOption, styles.bad]}>
                                <RadioButton value="Bad" />
                                <Text style={styles.behaviorText}>Bad</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Add Habit" onPress={ addHabit } />
                </View>


            </ScrollView>

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(165, 192, 237, 0.1)',
        
    },
    header: {
        backgroundColor: 'rgba(4, 96, 98, 0.52)',// light gray
        paddingVertical: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
    },

    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#f9fafb',

    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#111827',
    },
    inputTitle: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    inputDescription: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    daysWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    checkBoxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    dayText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#374151',
    },
    timeWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    behaviorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    behaviorOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        width: '48%',
        justifyContent: 'center',
    },
    good: {
        backgroundColor: '#d4edda', // light green
    },

    bad: {
        backgroundColor: '#f8d7da', // light red
    },

    buttonContainer: {
        marginTop: 30,
        marginBottom: 50,

        backgroundColor: '#6366f1',
        borderRadius: 12,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    behaviorText: {
        fontSize: 16,
        fontWeight: '500',

    },
});


