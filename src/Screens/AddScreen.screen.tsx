import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { RadioButton } from "react-native-paper";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ["Morning", "Afternoon", "Evening", "Night"]
export default function AddScreen() {
    const [time, setTime] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [days, setDays] = useState<string[]>([]);
    const [behaviour, setBehaviour] = useState('');


    const toggleDay = (day) => {
        setDays((prevDays: string[]) =>
            prevDays.includes(day)
                ? prevDays.filter(d => d !== day)
                : [...prevDays, day] 
            
);
    
};


return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text>Add Your task Here</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>enter the title of your task</Text>
            <TextInput style={styles.inputTitle}></TextInput>
            <Text style={styles.label}>enter the description of your task</Text>
            <TextInput style={styles.inputDescription}></TextInput>

        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Select the frequency of your task</Text>
            <Picker
                selectedValue={frequency}
                onValueChange={(itemValue) => setFrequency(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Daily" value="Daily" />
                <Picker.Item label="Weekly" value="Weekly" />
            </Picker>
        </View>

        <View style={styles.section}>
            <Text style={styles.label}>Select the day of your task</Text>
            {days.map((day) => (
                <View key={day} style={styles.checkBoxContainer}>
                    <CheckBox
                        disabled={frequency === "daily"}
                        value={setDays[day]}
                        onValueChange={() => toggleDay(day)}
                    />
                    <Text style={styles.dayText}>{day}</Text>
                </View>
            ))}
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Select Time of Day</Text>
            <RadioButton.Group onValueChange={setTime} value={time}>
                {timeOptions.map((timeRange) => (
                    <View style={styles.radioButtonContainer}>
                        <RadioButton value={timeRange} />
                        <Text>{timeRange}</Text>
                    </View>
                ))}
            </RadioButton.Group>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Is that habit good/bad</Text>
            <RadioButton.Group onValueChange={setBehaviour} value={behaviour}>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="Good" />
                    <Text>Good</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton value="Bad" />
                    <Text>Bad</Text>
                </View>
            </RadioButton.Group>
        </View>
        <View style={styles.buttonContainer}>
            <Button title="Add Habit" onPress={() => { /* Add your handler here */ }} />
        </View>

    </View>

);
}
const styles = StyleSheet.create({


})