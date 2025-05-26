import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabitStore, useHabitTextStore } from "../Store/habitStore";
import { useThemeStore } from "../Store/themeStore";
import { darkTheme, lightTheme } from "../Themes/colors";


const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ["Morning", "Afternoon", "Evening", "Night"];

export default function AddScreen() {
    const { habits, addHabit } = useHabitStore(state => state);
    const { isDarkMode } = useThemeStore();
    
    const theme = isDarkMode ? darkTheme : lightTheme;
    const styles = createStyles(theme);

    const habitText = useHabitTextStore(state => state.habitText);
    const setHabitText = useHabitTextStore(state => state.setHabitText);
    const [days, setDays] = useState<string[]>([]);

    const toggleDay = (day: string) => {
        const updatedDays = habitText.weekDay.includes(day)
            ? habitText.weekDay.filter(d => d !== day)
            : [...habitText.weekDay, day];
        setHabitText(updatedDays, "weekDay");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSection}>
                <ImageBackground source={require("../Assets/headerbackground.png")} style={styles.background} resizeMode="cover">
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <Text style={styles.welcomeText}>Add a vision to your life</Text>
                            <Text style={styles.userName}>Add Your Tasks</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.detailsContainer}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Enter the title of your task</Text>
                        <TextInput
                            style={styles.inputTitle}
                            placeholder="Habit Title"
                            placeholderTextColor={theme.input.placeholder}
                            value={habitText.task}
                            onChangeText={(text) => setHabitText(text, "task")}
                            multiline={true}
                            textAlignVertical='top'
                            autoCorrect={false}
                        />
                        <Text style={styles.label}>Enter the description of your task</Text>
                        <TextInput
                            style={styles.inputDescription}
                            placeholder="Habit Description"
                            placeholderTextColor={theme.input.placeholder}
                            value={habitText.description}
                            onChangeText={(text) => setHabitText(text, "description")}
                            multiline={true}
                            textAlignVertical="top"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Select the frequency of your task</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={habitText.frequency}
                                onValueChange={(itemValue) => setHabitText(itemValue, "frequency")}
                                style={styles.picker}
                                dropdownIconColor={theme.text.primary}
                            >
                                <Picker.Item label="Daily" value="Daily" color={theme.text.primary} />
                                <Picker.Item label="Weekly" value="Weekly" color={theme.text.primary} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Select the day of your task</Text>
                        <View style={styles.daysWrapper}>
                            {allDays.map((day) => (
                                <View key={day + habitText.weekDay.join(",")} style={styles.checkBoxItem}>
                                    <CheckBox
                                        disabled={habitText.frequency === "Daily"}
                                        value={habitText.weekDay.includes(day)}
                                        onValueChange={() => toggleDay(day)}
                                        tintColors={{ true: theme.button.primary, false: theme.border.secondary }}
                                    />
                                    <Text style={[
                                        styles.dayText,
                                        habitText.frequency === "Daily" && styles.disabledText
                                    ]}>
                                        {day}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Select Time of Day</Text>
                        <RadioButton.Group 
                            onValueChange={(itemValue) => setHabitText(itemValue, "timeRange")} 
                            value={habitText.timeRange}
                        >
                            <View style={styles.timeWrapper}>
                                {timeOptions.map((timeRange) => (
                                    <View key={timeRange} style={styles.timeOption}>
                                        <RadioButton 
                                            value={timeRange} 
                                            color={theme.button.primary}
                                            uncheckedColor={theme.border.secondary}
                                        />
                                        <Text style={styles.timeText}>{timeRange}</Text>
                                    </View>
                                ))}
                            </View>
                        </RadioButton.Group>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Is that habit good/bad</Text>
                        <RadioButton.Group 
                            onValueChange={(itemValue) => { setHabitText(itemValue, "behavior") }} 
                            value={habitText.behavior}
                        >
                            <View style={styles.behaviorRow}>
                                <View style={[styles.behaviorOption, styles.good]}>
                                    <RadioButton 
                                        value="Good" 
                                        color={theme.button.primary}
                                        uncheckedColor={theme.border.secondary}
                                    />
                                    <Text style={styles.behaviorText}>Good</Text>
                                </View>
                                <View style={[styles.behaviorOption, styles.bad]}>
                                    <RadioButton 
                                        value="Bad" 
                                        color={theme.button.primary}
                                        uncheckedColor={theme.border.secondary}
                                    />
                                    <Text style={styles.behaviorText}>Bad</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
                            <Text style={styles.buttonText}>Add Habit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.tertiary,
    },
    headerSection: {
        height: 120,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",
        elevation: 5,
        shadowColor: theme.shadow.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    background: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        backgroundColor: theme.background.overlay,
    },
    header: {
        marginTop: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
        opacity: 0.9,
    },
    userName: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: "bold",
        marginTop: 4,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    detailsContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: theme.text.primary,
    },
    inputTitle: {
        borderWidth: 1,
        borderColor: theme.input.border,
        backgroundColor: theme.input.background,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        minHeight: 50,
        color: theme.text.primary,
    },
    inputDescription: {
        borderWidth: 1,
        borderColor: theme.input.border,
        backgroundColor: theme.input.background,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        color: theme.text.primary,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: theme.input.border,
        borderRadius: 10,
        backgroundColor: theme.input.background,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: theme.text.primary,
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
        backgroundColor: theme.background.card,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.border.primary,
        shadowColor: theme.shadow.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    dayText: {
        marginLeft: 8,
        fontSize: 15,
        color: theme.text.primary,
    },
    disabledText: {
        color: theme.text.disabled,
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
        backgroundColor: theme.background.card,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.border.primary,
        shadowColor: theme.shadow.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    timeText: {
        marginLeft: 8,
        fontSize: 15,
        color: theme.text.primary,
    },
    behaviorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    behaviorOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background.card,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.border.primary,
        width: '48%',
        justifyContent: 'center',
    },
    good: {
        backgroundColor: theme.isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#d4edda',
    },
    bad: {
        backgroundColor: theme.isDarkMode ? 'rgba(248, 113, 113, 0.2)' : '#f8d7da',
    },
    behaviorText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
        color: theme.text.primary,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 30,
    },
    addButton: {
        backgroundColor: theme.button.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: theme.button.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: theme.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    },
});