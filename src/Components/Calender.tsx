import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native";


const Calender = () => {
    const [progressData, setProgressData] = useState<{ [date: string]: number }>({});

    useEffect(() => {
        const loadProgress = async () => {
            const data: { [date: string]: number } = {};
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const key = date.toDateString();
                const storedProgress = await AsyncStorage.getItem(`progress-${key}`);
                data[key] = storedProgress ? parseFloat(storedProgress) : 0;

            }
            setProgressData(data);
        };
        loadProgress();
    }, []);

    const getColor = (progress: number) => {
        if (progress === 100) return '#166534';
        if (progress > 50) return '#4ade80';
        if (progress > 0) return '#bbf7d0';
        return '#efbee';
    };
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
        >
            {Object.entries(progressData).map(([dateStr, progress]) => {
                const date = new Date(dateStr);
                const day = date.getDate();
                const isToday = new Date().toDateString() === date.toDateString();
                return (
                    <View
                        key={dateStr}
                        style={[
                            styles.dayBox,
                            { backgroundColor: getColor(progress) },
                            isToday && styles.todayBox

                        ]}>
                        <Text style={[
                            styles.dayText,
                            isToday && styles.todayText
                        ]}>
                            {day}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    scrollView: {
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(152, 164, 236, 0.99)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(51, 4, 99, 0.32)',
  },
  dayText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  todayBox: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  todayText: {
    fontWeight: '700',
  }

});
export default Calender;


