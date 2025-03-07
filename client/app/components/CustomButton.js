import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const CustomButton = ({ 
    title, 
    onPress, 
    type = 'primary', 
    disabled = false,
    style = {} 
}) => {
    const buttonStyle = [
        styles.button,
        type === 'secondary' && styles.secondaryButton,
        type === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        style
    ];

    const textStyle = [
        styles.text,
        type === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText
    ];

    return (
        <TouchableOpacity 
            style={buttonStyle} 
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: Colors.card,
        borderColor: Colors.primary,
        borderWidth: 1,
    },
    dangerButton: {
        backgroundColor: Colors.danger,
    },
    disabledButton: {
        backgroundColor: Colors.disabled,
        borderColor: Colors.disabled,
    },
    text: {
        color: Colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryText: {
        color: Colors.primary,
    },
    disabledText: {
        color: Colors.text.tertiary,
    },
});

export default CustomButton; 