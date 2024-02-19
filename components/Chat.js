import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, background, id } = route.params;
    const [messages, setMessages] = useState([]);
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0])
    }

    const renderBubble = (props) => {
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }

    const loadCachedMessages = async () => {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
      setLists(JSON.parse(cachedMessages));
    };
  
    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    };

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    useEffect(() => {
      if (isConnected === true) {
        if (unsubMessages) unsubMessages();
        unsubMessages = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach((doc) => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            });
            })
            cacheMessages(newMessages);
            setMessages(newMessages);
          });

        } else {
          loadCachedMessages();

          return () => {
            if (unsubShoppinglists) unsubShoppinglists();
          };
        }

      return () => {
        if (unsubMessages) unsubMessages();
      }
    }, []);

    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      else return null;
    };

    return (
        <View style={[styles.container, {backgroundColor: background}]}>
            <GiftedChat
              messages={messages}
              renderBubble={renderBubble}
              renderInputToolbar={renderInputToolbar}
              onSend={messages => onSend(messages)}
              user={{
                //_id: route.params.id,
                _id: id,
                name
              }}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
        )
}
const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
});
export default Chat;