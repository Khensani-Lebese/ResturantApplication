import React, { useState, useRef, useEffect } from 'react';
import { 
  TouchableOpacity, 
  View, 
  Animated, 
  StyleSheet, 
  Platform,
  Vibration,
  Alert
} from 'react-native';

const AnimatedTitle = ({ 
  title, 
  onPress, 
  style, 
  facts = [], 
  factTriggers = [3, 5, 7, 10] 
}) => {
  const titleScale = useRef(new Animated.Value(1)).current;
  const outlineAnim = useRef(new Animated.Value(0)).current;
  const [tapCount, setTapCount] = useState(0);
  const [isEnhancedPulse, setIsEnhancedPulse] = useState(false);

  useEffect(() => {
    const startPulse = () => {
      Animated.sequence([
        Animated.timing(outlineAnim, {
          toValue: 2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(outlineAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        })
      ]).start(() => startPulse());
    };

    startPulse();

    return () => {
      outlineAnim.setValue(0);
    };
  }, []);

  const handlePress = () => {
    Vibration.vibrate(50);
    
    setIsEnhancedPulse(true);
    
    setTimeout(() => {
      setIsEnhancedPulse(false);
    }, 3000);
    
    Animated.sequence([
      Animated.timing(titleScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setTapCount(prev => {
      const newCount = prev + 1;
      
      const factIndex = factTriggers.indexOf(newCount);
      if (factIndex !== -1 && facts[factIndex]) {
        Alert.alert("Fun Fact!", facts[factIndex]);
      }
      
      if (newCount >= Math.max(...factTriggers)) {
        setTimeout(() => setTapCount(0), 0);
        return 0;
      }
      
      return newCount;
    });

    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.titleContainer, style]}>
        <Animated.Text 
          style={[
            styles.titleOutline,
            {
              opacity: outlineAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0.1, 0.2, 0]
              }),
              transform: [
                { scale: outlineAnim.interpolate({
                  inputRange: [0, 2],
                  outputRange: [1, isEnhancedPulse ? 1.3 : 1.1]
                })}
              ]
            }
          ]}
        >
          {title}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.titleOutline,
            {
              opacity: outlineAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0.2, 0.1, 0]
              }),
              transform: [
                { scale: outlineAnim.interpolate({
                  inputRange: [0, 2],
                  outputRange: [1, isEnhancedPulse ? 1.35 : 1.15]
                })}
              ]
            }
          ]}
        >
          {title}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.title,
            { transform: [{ scale: titleScale }] }
          ]}
        >
          {title}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleOutline: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '800',
    color: 'transparent',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Mincho ProN' : 'serif',
    textShadowColor: '#e4d4c6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4d4c6',
    letterSpacing: 2,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Mincho ProN' : 'serif',
  },
});

export default AnimatedTitle; 