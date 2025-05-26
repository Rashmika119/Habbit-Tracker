import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function OpeningScreen({ navigation }: any) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('BottomTabs');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../Assets/load.json')}
                autoPlay
                loop
                style={styles.animation}
            />
            <Text style={styles.title}>Habiloop</Text>
            <Text style={styles.subtitle}>Build better habits, one day at a time.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5F8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    animation: {
        width: 250,
        height: 250,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2D3E50',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#7A869A',
        marginTop: 10,
        textAlign: 'center',
    },
});
