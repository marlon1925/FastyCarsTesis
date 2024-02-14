// ProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export const ProgressBarCustom = ({ step }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.stepInicio, step >= 1 && styles.activeStep]} />
            <View style={[styles.step, step >= 2 && styles.activeStep]} />
            <View style={[styles.stepFinal, step >= 3 && styles.activeStep]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    stepInicio: {
        width: 110,
        height: 9,
        backgroundColor: theme.colors.BackGroundInpu,
        borderTopStartRadius: 15,
        borderBottomStartRadius: 15,
        borderColor: "black",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderStartWidth: 1

    },
    stepFinal: {
        width: 110,
        height: 9,
        backgroundColor: theme.colors.BackGroundInpu,
        borderTopEndRadius: 15,
        borderBottomEndRadius: 15,
        borderColor: "black",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderEndWidth: 1
    },
    step: {
        width: 110,
        height: 9,
        backgroundColor: theme.colors.BackGroundInpu,
        borderRadius: 0,
        borderColor: "black",
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    activeStep: {
        backgroundColor: theme.colors.ColorGrennButtom, // Cambia el color para indicar el progreso
    },
});

