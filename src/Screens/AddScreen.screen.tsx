import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, TextInput, View } from "react-native";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function AddScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>Add Your task Here</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>enter the title of your task</Text>
                <TextInput style={styles.inputTitle}></TextInput>
            </View>
            <View style={styles.section}>
                <Text styel={styles.label}>Select the frequency of your task</Text>
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
                {days.map((day)=>(
                    <View key={day} style={styles.checkBoxContainer}>
                        <CheckBox
                        disabled={frequency==="daily"}
                        value={selectedDays[day]}
                        onValueChange={()=>toggleDay(day)}
                        />
                        <Text style={styles.dayText}>{day}</Text>
                    </View>
                ))}
            </View>

        </View>

    );
}
const styles = StyleSheet.create({


})