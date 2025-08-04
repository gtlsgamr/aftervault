import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import theme from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const {
    signIn,
    signUp,
    loading
  } = useAuth();

  const validateEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input);
    setEmailError(isValid ? undefined : 'Please enter a valid email address');
    return isValid;
  };

  const validatePassword = (input: string): boolean => {
    const isValid = input.length >= 6;
    setPasswordError(isValid ? undefined : 'Password must be at least 6 characters');
    return isValid;
  };

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear errors when switching modes
    setEmailError(undefined);
    setPasswordError(undefined);
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>AfterVault</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              onSubmitEditing={() => validateEmail(email)}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              onSubmitEditing={() => validatePassword(password)}
            />

            <Button
              title={isLogin ? 'Sign In' : 'Sign Up'}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.footerLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: theme.spacing.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.medium,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.lightGray,
  },
  dividerText: {
    marginHorizontal: theme.spacing.medium,
    color: theme.colors.darkGray,
    fontSize: theme.typography.fontSize.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  footerText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.darkGray,
    marginRight: theme.spacing.small,
  },
  footerLink: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
});

export default LoginScreen;
