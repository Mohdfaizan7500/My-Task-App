import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { AppColors } from '../constants/colors';

const Splash = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Task List");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const Handle = () => {
        navigation.navigate("Task List");
    };

    return (
        <View style={styles.container}>
            <View style={styles.IconView}>
                <FontAwesome5 name="check" size={s(64)} color='#fff' />
            </View>
            <View style={{ marginTop: s(70) }}>
                <Text style={styles.heading}>Get things done.</Text>
                <Text style={styles.subtitle}>
                    {`just a click away from \nplanning your task`}
                </Text>
            </View>
            <Pressable onPress={Handle} style={styles.circle}></Pressable>
            <Pressable onPress={Handle} style={styles.arrow}>
                <FontAwesome5 name="arrow-right" size={50} color={AppColors.light.background} />
            </Pressable>
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.light.background,
        justifyContent: "center",
    },
    IconView: {
        width: s(100),
        height: s(100),
        backgroundColor: AppColors.light.IconColor,
        borderRadius: s(20),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    heading: {
        fontSize: s(24),
        fontWeight: '800',
        paddingStart: s(40),
    },
    subtitle: {
        marginTop: vs(15),
        fontSize: s(14),
        color: "gray",
        fontWeight: "400",
        letterSpacing: s(1.5),
        paddingStart: s(40),
    },
    circle: {
        width: s(250),
        height: s(250),
        backgroundColor: AppColors.light.IconColor,
        position: "absolute",
        bottom: vs(-100),
        right: s(-100),
        borderRadius: s(300)
    },
    arrow: {
        position: "absolute",
        bottom: vs(30),
        right: s(30),
    }
});
