import { StyleSheet, Text, View } from 'react-native';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyAwGAZUJ4Cif0Ecc2YqdytV0a_Kimok5lg",
  authDomain: "chatapp-82e0b.firebaseapp.com",
  projectId: "chatapp-82e0b",
  storageBucket: "chatapp-82e0b.appspot.com",
  messagingSenderId: "80115731881",
  appId: "1:80115731881:web:397a67e49408fe7b9108b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />

    <Stack.Screen
        name="Chat"
        options={({ route }) => ({ title: route.params.name })}>
        {(props) => <Chat {...props}  db={db} />}
    </Stack.Screen> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;