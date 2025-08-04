import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { OnboardingSlide as OnboardingSlideType } from '../screens/Onboarding/OnboardingData';
import theme from '../theme/theme';

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
  onButtonPress: () => void;
}

const { width } = Dimensions.get('window');

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide, onButtonPress }) => {
  return (
      <View style={styles.slide}>
        <View style={styles.contentContainer}>
          <Image
            source={slide.image}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.heading}>{slide.heading}</Text>
          <Text style={styles.subtext}>{slide.subtext}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{slide.buttonText}</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Changed from center to flex-start
    alignItems: 'center',
    width: '100%',
    paddingBottom: theme.spacing.large, // Added padding to ensure space for text
  },
  image: {
    width: '100%',
    height: 300, // Fixed height for all images
    marginBottom: theme.spacing.large,
    alignSelf: 'center', // Center the image horizontally
  },
  heading: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  subtext: {
    fontSize: theme.typography.fontSize.large,
    color: theme.colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    height: theme.layout.buttonHeight,
    backgroundColor: theme.colors.black,
    borderRadius: theme.layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.large,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default OnboardingSlide;
