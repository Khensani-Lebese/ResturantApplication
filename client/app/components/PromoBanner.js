import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder,
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          // Swipe threshold met, animate out
          Animated.timing(translateX, {
            toValue: gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true,
          }).start(async () => {
            setIsVisible(false);
            try {
              await AsyncStorage.setItem('promoBannerHidden', 'true');
            } catch (error) {
              console.error('Error storing banner state:', error);
            }
          });
        } else {
          // Return to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    const checkBannerState = async () => {
      try {
        const bannerHidden = await AsyncStorage.getItem('promoBannerHidden');
        if (bannerHidden === 'true') {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error reading banner state:', error);
      }
    };
    checkBannerState();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Special Offer!</Text>
        <Text style={styles.description}>
          Get 20% off your first booking
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(204, 134, 111, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default PromoBanner; 