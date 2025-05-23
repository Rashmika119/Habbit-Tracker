import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUserStore, useUserTextStore } from '../Store/userStore';


function LoginScreen({ navigation }: any) {
    const signInUser = useUserStore((state) => state.signInUser);
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })
    const handleLogin = () => {
        if (!userData.username.trim() || !userData.password.trim()) {
            Alert.alert("Please fill all the fields");
            return;
        }
        signInUser(navigation,userData);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loginForm}>
                <Text style={styles.header}>Welome Back</Text>
                <Text style={styles.subheader}>Login to your account</Text>
                <View style={styles.inputFields}>
                    <TextInput
                        placeholder="Username"
                        style={styles.textInput}
                        onChangeText={(text) => setUserData({ ...userData, username: text })}
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.textInput}
                        onChangeText={(text) => setUserData({ ...userData, password: text })}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => handleLogin()}>
                <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't you have an account? </Text>
                <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                    <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        paddingHorizontal: 24,
    },
    loginForm: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        width: '100%',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 8,
        marginTop: 10,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subheader: {
        fontSize: 16,
        color: '#718096',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputFields: {
        width: '100%',
        alignItems: 'center',
    },
    textInput: {
        height: 50,
        width: '100%',
        color: '#4a5568',
        fontWeight: '500',
        fontSize: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f7fafc',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#4c6ef5',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        overflow: 'hidden',
        shadowColor: '#4c6ef5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'center',
    },
    footerText: {
        color: '#718096',
        marginRight: 5,
        fontSize: 15,
        fontWeight: '500',
    },
    registerLink: {
        color: '#4c6ef5',
        fontWeight: 'bold',
    }
})

export default LoginScreen;