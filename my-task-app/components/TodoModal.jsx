import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';

const TodoModal = ({ visible, onPress, item }) => {
    return (
        <Modal visible={visible} animationType='fade' transparent>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>Due: {item.duedate}</Text>
                        <Text style={styles.description}>Description: {item.description}</Text>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.okButton} onPress={onPress}>
                            <Text style={styles.buttonText}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TodoModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: Dimensions.get("window").width - s(100),
        height: vs(400),
        backgroundColor: "#fff",
        elevation: 12,
        borderRadius: s(20),
    },
    scrollViewContent: {
        paddingBottom: 150,
        paddingHorizontal: s(30),
        paddingTop: vs(20),
    },
    footer: {
        width: "100%",
        height: vs(70),
        backgroundColor: "#fff",
        borderRadius: s(20),
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: s(10),
    },
    okButton: {
        backgroundColor: '#06d6a0',
        width: s(80),
        paddingVertical: vs(7),
        paddingHorizontal: s(25),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: s(8),
    },
    buttonText: {
        fontSize: s(14),
        fontWeight: '800',
        color: "#fff",
    },
    title: {
        fontSize: s(22),
        fontWeight: "900",
        color: "black",
    },
    description: {
        fontSize: s(14),
        color: "gray",
        marginTop: vs(10),
    },
});
