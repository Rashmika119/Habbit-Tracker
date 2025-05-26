import { useEffect, useState } from "react";
import { Alert, BackHandler, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEditStore, useHabitStore } from "../Store/habitStore";
import { useThemeStore } from "../Store/themeStore";

import { Picker } from "@react-native-picker/picker";
import CheckBox from "@react-native-community/checkbox";
import { RadioButton } from "react-native-paper";
import { darkTheme, lightTheme } from "../Themes/colors";

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ["Morning", "Afternoon", "Evening", "Night"];

export default function EditScreen({ navigation }: any) {
    const { editId, clearEditId } = useEditStore();
    const { habits, deleteHabit, editHabit } = useHabitStore();
    const { isDarkMode } = useThemeStore();
    
    const theme = isDarkMode ? darkTheme : lightTheme;
    const styles = createStyles(theme);
    
    const selectedHabit = habits.find(habit => habit.id == editId);

    const [editedHabit, setEditedHabit] = useState({
        task: selectedHabit?.task || "",
        description: selectedHabit?.description || "",
        frequency: selectedHabit?.frequency || "Daily",
        completed: selectedHabit?.completed || false,
        behavior: selectedHabit?.behavior || "Good",
        weekDay: selectedHabit?.weekDay || [],
        timeRange: selectedHabit?.timeRange || "Morning",
    });

    const toggleDay = (day: string) => {
        const updatedDays = editedHabit.weekDay.includes(day)
            ? editedHabit.weekDay.filter(d => d !== day)
            : [...editedHabit.weekDay, day];

        setEditedHabit({ ...editedHabit, weekDay: updatedDays });
    };

    useEffect(() => {
        const onBackPress = () => {
            clearEditId();
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);

    if (!selectedHabit) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerSection}>
                    <ImageBackground
                        source={require('../Assets/headerbackground.png')}
                        style={styles.background}
                        resizeMode="cover"
                    >
                        <View style={styles.overlay}>
                            <TouchableOpacity
                                style={styles.backButtonContainer}
                                onPress={() => navigation.goBack()}
                            >
                                <Image source={require("../Assets/back.png")} style={styles.backButton} />
                            </TouchableOpacity>
                            <View style={styles.header}>
                                <Text style={styles.welcomeText}>Something went wrong</Text>
                                <Text style={styles.userName}>Edit Your Tasks</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No habit selected for editing</Text>
                </View>
            </SafeAreaView>
        );
    }

    const confirmDelete = () => {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete the habit -- ${selectedHabit?.task}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        deleteHabit(selectedHabit?.id);
                        clearEditId();
                        navigation.goBack();
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const editConfirm = () => {
        if (!editedHabit.task.trim()) {
            Alert.alert("Error", "Task name cannot be empty");
            return;
        }

        Alert.alert(
            "Edit Confirmation",
            `Are you sure you want to save the changes you have done?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        editHabit(selectedHabit.id, editedHabit);
                        clearEditId();
                        navigation.goBack();
                    }
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSection}>
                <ImageBackground source={require("../Assets/edit.png")} style={styles.background} resizeMode="cover">
                    <View style={styles.overlay}>
                        <TouchableOpacity
                            style={styles.backButtonContainer}
                            onPress={() => {
                                clearEditId();
                                navigation.goBack();
                            }}
                        >
                            <Image source={require("../Assets/back.png")} style={styles.backButton} />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.welcomeText}>Make your mistakes, restart journey</Text>
                            <Text style={styles.userName}>Edit Your Tasks</Text>
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
                            value={editedHabit.task}
                            onChangeText={(text) => setEditedHabit({ ...editedHabit, task: text })}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Habit Title"
                            placeholderTextColor={theme.input.placeholder}
                            autoCorrect={false}
                        />
                        <Text style={styles.label}>Enter the description of your task</Text>
                        <TextInput
                            style={styles.inputDescription}
                            value={editedHabit.description}
                            onChangeText={(text) => setEditedHabit({ ...editedHabit, description: text })}
                            multiline={true}
                            textAlignVertical='top'
                            placeholder="Habit Description"
                            placeholderTextColor={theme.input.placeholder}
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Select the frequency of your task</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={editedHabit.frequency}
                                onValueChange={(value) => setEditedHabit({ ...editedHabit, frequency: value })}
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
                                <View key={day} style={styles.checkBoxItem}>
                                    <CheckBox
                                        disabled={editedHabit.frequency === "Daily"}
                                        value={editedHabit.weekDay.includes(day)}
                                        onValueChange={() => toggleDay(day)}
                                        tintColors={{ true: theme.button.primary, false: theme.border.secondary }}
                                    />
                                    <Text style={[
                                        styles.dayText,
                                        editedHabit.frequency === "Daily" && styles.disabledText
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
                            onValueChange={(value) => setEditedHabit({ ...editedHabit, timeRange: value })}
                            value={editedHabit.timeRange}
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
                            onValueChange={(value) => setEditedHabit({ ...editedHabit, behavior: value })}
                            value={editedHabit.behavior}
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

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.editButton} onPress={editConfirm}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                            <Text style={styles.buttonText}>Delete Habit</Text>
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
    backButtonContainer: {
        position: 'absolute',
        left: 20,
        top: 20,
        zIndex: 1,
    },
    backButton: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: theme.background.secondary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, // Extra padding at bottom
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
    buttonsContainer: {
        marginTop: 30,
        marginBottom: 30, // Reduced from 50 since we have padding in scrollContent
        gap: 15,
    },
    editButton: {
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
    deleteButton: {
        backgroundColor: theme.button.danger,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: theme.button.danger,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.background.secondary,
    },
    errorText: {
        fontSize: 18,
        color: theme.text.error,
        textAlign: 'center',
    },
});