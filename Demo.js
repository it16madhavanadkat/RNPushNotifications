import React from 'react';
import {Text, Alert} from 'react-native';
import firebase from 'react-native-firebase';

export default class CustomText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 'test',
        };
    }

    componentDidMount(): void {
        this.setState({test: 'req per'});
        this.checkPermission().then(() => {
            this.setState({test: 'req done'});

        });
        this.messageListener().then(() => {
            this.setState({test: 'req messageListener done'});
        });
    }

    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken);
            this.showAlert('Your Firebase Token is:', fcmToken);
            this.setState({test: fcmToken});
        } else {
            this.showAlert('Failed', ' No token received');
            this.setState({test: 'No token received'});
        }
    };
    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    };
    showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    };
    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const {title, body} = notification;
            this.setState({test: title});
            this.showAlert(title, body);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {title, body} = notificationOpen.notification;
            this.showAlert(title, body);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const {title, body} = notificationOpen.notification;
            this.showAlert(title, body);
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log(JSON.stringify(message));
        });
    };

    render() {
        const {...props} = this.props;
        return (
            <Text  {...props} style={[this.props.style,{padding:10}]}>
                {this.state.test}
            </Text>
        );
    }


}
