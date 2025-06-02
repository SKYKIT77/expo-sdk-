import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Dimensions, Animated, KeyboardAvoidingView, Alert, Platform,
  SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, checkFirebaseConnection } from '../firebase';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = new Animated.Value(0.95);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      setIsLoading(true);

      // Check if it's admin email
      if (email.toLowerCase() === 'admin@gmail.com') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigation.replace('AdminDashboard');
        return;
      }

      // Step 1: Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2: Get user data from Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create basic user data if it doesn't exist
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
        navigation.replace('MainTabs');
        return;
      }

      const userData = userDocSnap.data();
      if (userData.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        navigation.replace('MainTabs');
      }

    } catch (error) {
      console.error('Login error:', error);
      let message = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      if (error.code === 'auth/invalid-credential') {
        message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
      Alert.alert('แจ้งเตือน', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#1a237e', '#304FFE', '#1E88E5']}
          style={styles.background}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            {/* Logo and Title Section */}
            <Animated.View 
              style={[
                styles.headerContainer, 
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <MaterialIcons name="sports-soccer" size={80} color="#fff" />
              <Text style={styles.title}>SIAM SOCCER</Text>
              <Text style={styles.subtitle}>พัฒนาตัวเองสู่นักฟุตบอลมืออาชีพ</Text>
            </Animated.View>

            {/* Login Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={24} color="#304FFE" />
                <TextInput
                  style={styles.input}
                  placeholder="อีเมล"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={24} color="#304FFE" />
                <TextInput
                  style={styles.input}
                  placeholder="รหัสผ่าน"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                <LinearGradient
                  colors={['#304FFE', '#1E88E5']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerButtonText}>สมัครสมาชิกใหม่</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hiddern',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#304FFE',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    marginRight: 5,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#304FFE',
    borderRadius: 12,
    padding: 12,
  },
  registerButtonText: {
    color: '#304FFE',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default LoginScreen;
