import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View} from "react-native";
import CheckBox from '@react-native-community/checkbox';

function HomeScreen({ navigation }: any) {
    // Get the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString();

    // Move state here (top level of the component)
    const tasks = ['task 1', 'task 2', 'task 3'];
    const [checked, setChecked] = useState([false, false, false]);

    const completedTasks = checked.filter(Boolean).length;
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;

    const toggleCheckBox = (index: number) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSection}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Good day</Text>
                    <Text style={styles.headerText}>Hi Rashmika</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
            </View>

            <View style={styles.todayProgressSection}>
                <Text style={styles.todayProgressText}>Today Progress</Text>
                <View style={styles.progressBarContainer}>
                    <View style={styles.circle}>
                        <View
                            style={[
                                styles.fill,
                                { height: `${progress}%`, backgroundColor: '#3498db' }
                            ]}
                        />
                        <Text style={styles.percentText}>{Math.round(progress)}%</Text>
                    </View>
                </View>
            </View>

            <View style={styles.taskContainer}>
                <Text style={styles.todayTasksHeader}> Today Tasks</Text>
                {tasks.map((task, index) => (
                    <View key={index} style={styles.task}>
                        <CheckBox
                            value={checked[index]}
                            onValueChange={() => toggleCheckBox(index)}
                        />
                        <Text>{task}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.footer}>
                <Text>Home</Text>
                <Text>Add</Text>
                <Text>Tasks</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    headerSection: {},
    header: {},
    headerText: { fontSize: 18 },
    dateContainer: {},
    dateText: { color: 'gray' },
    todayProgressSection: { marginTop: 20 },
    todayProgressText: { fontSize: 20, fontWeight: 'bold' },
    progressBarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    fill: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    percentText: {
        position: 'absolute',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },
    todayTasksHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    taskContainer: {
        marginTop: 20,
        gap: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        
    },
    task: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        marginVertical: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f4f8',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});

export default HomeScreen;
