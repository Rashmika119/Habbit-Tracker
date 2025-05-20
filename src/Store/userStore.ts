import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Keyboard } from "react-native";
import { create } from "zustand"

export const useUserTextStore = create<UserTextType>((set) => ({
    userText: {
        id: 0,
        username: "",
        email: "",
        password: "",

    },
    setUserText: (value: string, key: keyof UserType) => {
        set((state) => ({
            userText: {
                ...state.userText,
                [key]: value,
            }
        }))
    },
    clearUserText: () => {
        set(() => ({
            userText: {
                id: 0,
                username: "",
                email: "",
                pasword: "",
            }
        }))
    }
}))

export const useUserStore = create<userStoreType>((set) => ({
    users: [],
    signUpUser: async (navigation: any) => {
        const { userText, setUserText,clearUserText } = useUserTextStore.getState();
        try {

        
            if (!userText.username.trim() || !userText.email.trim() || !userText.password.trim()) {
                Alert.alert("Please fill all the fields");
                return;
            }

            const existingUsersString=await AsyncStorage.getItem("my-user");
            const existingUsers=existingUsersString ? JSON.parse(existingUsersString):[];

            const isUserExists=existingUsers.some((user:any)=>user.emai===userText.email);

            if(isUserExists){
                Alert.alert("User already exists");
                return;
            }else{
            const newUser = {
                id: Math.random(),
                username: userText.username,
                email: userText.email,
                password: userText.password,

            };

            const updatedUsers=[...existingUsers,newUser];
            await AsyncStorage.setItem("my-user",JSON.stringify(updatedUsers));

            set((state) => ({
                users:updatedUsers,

            }))
            await AsyncStorage.setItem("my-user", JSON.stringify(useUserStore.getState().users));
            Alert.alert("User Added Successfully");
            navigation.navigate("Home")
            
            clearUserText();
            Keyboard.dismiss();
        }
        } catch (error) {
            console.log(error);
        }

    },
signInUser: async (navigation:any) => {
    const { UserText, clearUserText } = useUserTextStore.getState();

    try {
        const { username, password } = UserText;

        if (!username.trim() || !password.trim()) {
            Alert.alert("Please fill all the fields");
            return;
        }

        const existingUsersString = await AsyncStorage.getItem("my-user");
        const existingUsers = existingUsersString ? JSON.parse(existingUsersString) : [];

        const loggedInUser = existingUsers.find(
            (user: any) => user.username === username && user.password === password
        );

        if (!loggedInUser) {
            Alert.alert("Invalid username or password");
            return;
        }

        Alert.alert("User logged in Successfully");
        clearUserText();
        Keyboard.dismiss();
        navigation.navigate("Home");

    } catch (error) {
        console.log(error);
    }
},
logoutUser: async (navigation:any) => {
    const { clearUserText } = useUserTextStore.getState();

    try {
        Alert.alert("User logged in Successfully");
        clearUserText();
        Keyboard.dismiss();
        navigation.navigate("Home");

    } catch (error) {
        console.log("Logout error:",error);
    }
}


}))