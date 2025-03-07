import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const CustomNumberPicker = ({ value, onChange, min = 1, max = 20 }) => {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.button, value <= min && styles.buttonDisabled]} 
                onPress={handleDecrease}
                disabled={value <= min}
            >
                <Ionicons 
                    name="remove" 
                    size={24} 
                    color={value <= min ? Colors.text.tertiary : Colors.text.light} 
                />
            </TouchableOpacity>

            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.label}>Guests</Text>
            </View>

            <TouchableOpacity 
                style={[styles.button, value >= max && styles.buttonDisabled]} 
                onPress={handleIncrease}
                disabled={value >= max}
            >
                <Ionicons 
                    name="add" 
                    size={24} 
                    color={value >= max ? Colors.text.tertiary : Colors.text.light} 
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderRadius: 12,
        padding: 8,
    },
    button: {
        backgroundColor: '#FF8C42',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.text.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    valueContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.light,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: Colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default CustomNumberPicker; 