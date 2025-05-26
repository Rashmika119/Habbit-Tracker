"use client"

import React, { useState } from "react"
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useAuthStore } from "../Store/useAuthStore"
import { useTheme } from "../hooks/useTheme"

export default function ProfileScreen({ navigation }: any) {
    const { theme } = useTheme()
    const { currentUser } = useAuthStore()

    const [showPassword, setShowPassword] = useState(false)

    const maskPassword = (password: string) => {
        return "*".repeat(password.length)
    }

    const styles = createStyles(theme)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <Image source={require("../Assets/back.png")} style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    {/* Profile Picture Placeholder */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                            </Text>
                        </View>
                        <Text style={styles.welcomeText}>Welcome back!</Text>
                    </View>

                    {/* Profile Information */}
                    <View style={styles.infoContainer}>
                        {/* Username Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Username</Text>
                            <View style={styles.fieldValue}>
                                <Text style={styles.valueText}>{currentUser?.username || "Not provided"}</Text>
                            </View>
                        </View>

                        {/* Email Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Email Address</Text>
                            <View style={styles.fieldValue}>
                                <Text style={styles.valueText}>{currentUser?.email || "Not provided"}</Text>
                            </View>
                        </View>

                        {/* Password Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Password</Text>
                            <View style={styles.fieldValue}>
                                <Text style={styles.valueText}>
                                    {showPassword
                                        ? currentUser?.password || "Not provided"
                                        : maskPassword(currentUser?.password || "password")
                                    }
                                </Text>
                                <TouchableOpacity
                                    style={styles.showPasswordButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.showPasswordText}>
                                        {showPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Account Information */}
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Account Information</Text>



                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Account Status</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={[styles.statValue, styles.activeStatus]}>Active</Text>
                        </View>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>User ID</Text>
                        <Text style={styles.statValue}>
                            #{currentUser?.id || "N/A"}
                        </Text>
                    </View>
                </View>

           
            </ScrollView>
        </SafeAreaView>
    )
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.primary,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.primary,
        },
        backButtonContainer: {
            padding: 5,
        },
        backButton: {
            width: 24,
            height: 24,
            tintColor: '#333',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text.primary,
        },
        placeholder: {
            width: 50,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        profileCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        avatarContainer: {
            alignItems: "center",
            marginBottom: 25,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.button.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
        },
        avatarText: {
            fontSize: 32,
            fontWeight: "bold",
            color: "#FFFFFF",
        },
        welcomeText: {
            fontSize: 16,
            color: theme.text.secondary,
            fontWeight: "500",
        },
        infoContainer: {
            marginTop: 10,
        },
        fieldContainer: {
            marginBottom: 20,
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.text.secondary,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        fieldValue: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.background.tertiary,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border.primary,
        },
        valueText: {
            fontSize: 16,
            color: theme.text.primary,
            flex: 1,
            fontWeight: "500",
        },
        showPasswordButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: theme.button.primary,
            borderRadius: 6,
        },
        showPasswordText: {
            fontSize: 12,
            color: "#FFFFFF",
            fontWeight: "600",
        },
        statsCard: {
            backgroundColor: theme.background.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        statsTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.text.primary,
            marginBottom: 15,
        },
        statItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.primary,
        },
        statLabel: {
            fontSize: 14,
            color: theme.text.secondary,
            fontWeight: "500",
        },
        statValue: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.text.primary,
        },
        statusContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.text.success,
            marginRight: 6,
        },
        activeStatus: {
            color: theme.text.success,
        },
      
   

    })