import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // Card takes 80% of screen width
const SPACING = 20; // Space between cards

const promoData = [
  {
    id: '1',
    title: 'Easy Reservations',
    description: 'Book your favorite restaurants in seconds',
    icon: 'calendar-outline',
    gradient: ['#FF6B00', '#FF8533'],
  },
  {
    id: '2',
    title: 'Best Restaurants',
    description: 'Curated selection of top dining experiences',
    icon: 'star-outline',
    gradient: ['#FF8533', '#FFA366'],
  },
  {
    id: '3',
    title: 'Special Offers',
    description: 'Exclusive deals and promotions',
    icon: 'gift-outline',
    gradient: ['#FFA366', '#FF6B00'],
  }
];

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < promoData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderItem = ({ item, index }) => (
    <View style={[
      styles.slide,
      { marginLeft: index === 0 ? 20 : SPACING }
    ]}>
      <LinearGradient
        colors={item.gradient}
        style={styles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={28} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderDot = (index) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING)
    ];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={promoData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
          );
          setCurrentIndex(newIndex);
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.pagination}>
        {promoData.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160, // Increased height for better proportions
    marginBottom: 15,
  },
  flatListContent: {
    paddingRight: 20, // Add padding to the end
  },
  slide: {
    width: CARD_WIDTH,
    height: 120, // Increased height for better content display
  },
  gradientCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
    marginHorizontal: 4,
  },
});

export default PromoCarousel; 