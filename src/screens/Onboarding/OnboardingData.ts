// In React Native, require() for images must use static string literals, not variables

export interface OnboardingSlide {
  id: string;
  heading: string;
  subtext: string;
  buttonText: string;
  isLastSlide?: boolean;
  image: any;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'slide1',
    heading: 'Keep your important info safe',
    subtext: 'Store passwords, instructions, or notes — and release them only if something happens to you.',
    buttonText: 'Next',
    image: require('../../assets/images/aftervault_onboarding_screen1.png'),
  },
  {
    id: 'slide2',
    heading: 'Your people will know what to do',
    subtext: 'Choose who gets access. If you stop checking in, they get what they need. Nothing before that.',
    buttonText: 'Next',
    image: require('../../assets/images/aftervault_onboarding_screen2.png'),
  },
  {
    id: 'slide3',
    heading: 'Just tap \'I\'m okay\'',
    subtext: 'Every few days, we\'ll check if you\'re still around. A simple tap keeps your vault locked.',
    buttonText: 'Get Started',
    isLastSlide: true,
    image: require('../../assets/images/aftervault_onboarding_screen3.png'),
  },
];

export default onboardingSlides;
