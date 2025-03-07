import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const CustomText = ({ children, style, ...props }) => {
    return (
        <Text style={[styles.text, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: Colors.text.primary,
        fontSize: 16,
    },
});

export default CustomText; 