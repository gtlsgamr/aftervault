import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, SafeAreaView } from 'react-native';
import OnboardingSlide from '../../components/OnboardingSlide';
import onboardingSlides, { OnboardingSlide as OnboardingSlideType } from './OnboardingData';
import theme from '../../theme/theme';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlideType>>(null);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < onboardingSlides.length) {
      // Move to the next slide
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      // Navigate to login screen
      onComplete();
    }
  };

  const renderItem = ({ item }: { item: OnboardingSlideType }) => {
    return <OnboardingSlide slide={item} onButtonPress={handleNext} />;
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.paginationContainer}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing.large,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lightGray,
    marginHorizontal: theme.spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.black,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default OnboardingScreen;
