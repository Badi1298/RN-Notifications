import React, { useEffect } from 'react';
import { Alert, Button, Platform, StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true,
            shouldSetBadge: false,
            shouldPlaySound: false,
        };
    },
});

export default function App() {
    useEffect(() => {
        async function configurePushNotifications() {
            const { status } = await Notifications.getPermissionsAsync();
            let finalStatus = status;

            if (finalStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Permission not granted',
                    'Please enable push notifications in your settings'
                );
                return;
            }

            const token = await Notifications.getExpoPushTokenAsync();

            console.log(token.data);

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        configurePushNotifications();
    }, []);

    useEffect(() => {
        const receivedSubscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log(
                    'Notification Received, username:',
                    notification.request.content.data.username
                );
            }
        );

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response.notification.request.content.data.username);
            }
        );

        return () => {
            receivedSubscription.remove();
            responseSubscription.remove();
        };
    }, []);

    function scheduleLocalNotificationHandler() {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Local Notification',
                body: 'This is a local notification!',
                data: { username: 'Badi' },
            },
            trigger: {
                seconds: 30,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            },
        });
    }

    function sendPushNotificationHandler() {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
                title: 'Push Notification',
                body: 'This is a push notification!',
                data: { username: 'Badi' },
            }),
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={{ gap: 20 }}>
                <Button
                    title="Schedule Local Notification"
                    onPress={scheduleLocalNotificationHandler}
                />
                <Button title="Send Push Notification" onPress={sendPushNotificationHandler} />
            </View>
        </View>
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
