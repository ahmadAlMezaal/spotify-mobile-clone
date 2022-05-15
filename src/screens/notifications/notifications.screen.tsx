import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import NotificationCardComponent from './components/notificationCard.component';
import { Notification } from '@types';
import { notifications } from '@services/dummyDB';
import { globalStyles } from '@styles/globalStyles';

export default class NotificationsScreen extends React.PureComponent {

    render(): JSX.Element {
        const keyExtractor = (item: Notification, index: number): string => `${item.toString()}_${index.toString()}`;
        const renderItem = (item: Notification) => <NotificationCardComponent notification={item} />;

        return <View style={[styles.container, themeStyles.containerColorMain]}>
            <FlatList
                contentContainerStyle={{ paddingHorizontal: globalStyles.containerPadding.padding }}
                data={notifications}
                style={{ flexGrow: 0 }}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => renderItem(item)}
            />
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        }
    }
);
