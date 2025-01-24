import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

export default function App() {
    function scheduleLocalNotificationHandler() {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Local Notification',
                body: 'This is a local notification!',
                data: { username: 'Badi' },
            },
            trigger: {
                seconds: 5,
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
