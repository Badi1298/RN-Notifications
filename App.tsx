import React, { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Button
                title="Schedule Local Notification"
                onPress={scheduleLocalNotificationHandler}
            />
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
