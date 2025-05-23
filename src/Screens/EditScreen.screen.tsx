import { useEffect, useState } from "react";
import { Alert, BackHandler, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEditStore, useHabitStore } from "../Store/habitStore";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "@react-native-community/checkbox";
import { RadioButton } from "react-native-paper";

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ["Morning", "Afternoon", "Evening", "Night"];

export default function EditScreen({ navigation }: any) {
    const { editId, clearEditId } = useEditStore();
    const { habits, deleteHabit, editHabit } = useHabitStore();
    const selectedHabit = habits.find(habit => habit.id == editId);

    // Initialize with default values to prevent undefined issues
    const [editedHabit, setEditedHabit] = useState({
        task: selectedHabit?.task || "",
        description: selectedHabit?.description || "",
        frequency: selectedHabit?.frequency || "Daily",
        completed: selectedHabit?.completed || false,
        behavior: selectedHabit?.behavior || "Good",
        weekDay: selectedHabit?.weekDay || [],
        timeRange: selectedHabit?.timeRange || "Morning",
    });

    // Fixed toggleDay function to work with editedHabit state
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

    // Add validation to prevent rendering if no habit is selected
    if (!selectedHabit) {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../Assets/headerbackground.png')}
                    style={styles.header}
                    resizeMode="cover"
                >
                    <TouchableOpacity
                        style={styles.backButtonContainer}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require("../Assets/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Edit Your Tasks</Text>
                </ImageBackground>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No habit selected for editing</Text>
                </View>
            </View>
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
        // Add validation
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
        <View style={styles.container}>
            <ImageBackground
                source={require('../Assets/headerbackground.png')}
                style={styles.header}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={styles.backButtonContainer}
                    onPress={() => {
                        clearEditId();
                        navigation.goBack();
                    }}
                >
                    <Image source={require("../Assets/back.png")} style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Your Tasks</Text>
            </ImageBackground>
            
            <ScrollView style={styles.detailsContainer}>
                <View style={styles.section}>
                    <Text style={styles.label}>Enter the title of your task</Text>
                    <TextInput 
                        style={styles.inputTitle}
                        value={editedHabit.task}
                        onChangeText={(text) => setEditedHabit({ ...editedHabit, task: text })}
                        multiline={true}
                        textAlignVertical="top"
                        placeholder="Habit Title"
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
                        autoCorrect={false}
                    />
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Select the frequency of your task
                    </Text>
                    <Picker
                        selectedValue={editedHabit.frequency}
                        onValueChange={(value) => setEditedHabit({ ...editedHabit, frequency: value })}
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
                            <View key={day} style={styles.checkBoxItem}>
                                <CheckBox
                                    disabled={editedHabit.frequency === "Daily"}
                                    value={editedHabit.weekDay.includes(day)}
                                    onValueChange={() => toggleDay(day)}
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
                        onValueChange={(value) => setEditedHabit({...editedHabit, timeRange: value})} 
                        value={editedHabit.timeRange}
                    >
                        <View style={styles.timeWrapper}>
                            {timeOptions.map((timeRange) => (
                                <View key={timeRange} style={styles.timeOption}>
                                    <RadioButton value={timeRange} />
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
                
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={editConfirm}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                        <Text style={styles.buttonText}>Delete Habit</Text>
                    </TouchableOpacity>
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
        
        backgroundColor: 'rgba(4, 96, 98, 0.52)',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
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
        tintColor: '#333',
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
        fontSize: 16,
        minHeight: 50,
    },
    inputDescription: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        backgroundColor: '#fff',
        height: 50,
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
    disabledText: {
        color: '#9ca3af',
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
    timeText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#374151',
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
        backgroundColor: '#d4edda',
    },
    bad: {
        backgroundColor: '#f8d7da',
    },
    behaviorText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    buttonsContainer: {
        marginTop: 30,
        marginBottom: 50,
        gap: 15,
    },
    editButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#dc3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    errorText: {
        fontSize: 18,
        color: '#dc3545',
        textAlign: 'center',
    },
});