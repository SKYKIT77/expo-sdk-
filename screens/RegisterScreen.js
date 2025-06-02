import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import FormInput from '../components/FormInput';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    position: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleRegister = useCallback(async () => {
    if (Object.values(formData).some(value => !value)) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Create Authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Step 2: Ensure user data is created in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        username: formData.username,
        name: formData.name,
        position: formData.position,
        role: 'user',
        email: formData.email,
        createdAt: new Date().toISOString(),
      }, { merge: true }); // Use merge option to prevent overwriting

      Alert.alert(
        'สำเร็จ',
        'สมัครสมาชิกเรียบร้อย กรุณาเข้าสู่ระบบ',
        [{ text: 'ตกลง', onPress: () => navigation.replace('Login') }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      let message = 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'อีเมลนี้ถูกใช้งานแล้ว';
          break;
        case 'auth/invalid-email':
          message = 'รูปแบบอีเมลไม่ถูกต้อง';
          break;
        case 'auth/weak-password':
          message = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
          break;
      }
      
      Alert.alert('แจ้งเตือน', message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigation]);

  const formInputs = useMemo(() => [
    {
      icon: 'person',
      placeholder: 'ชื่อผู้ใช้',
      value: formData.username,
      field: 'username',
      autoCapitalize: 'words'
    },
    {
      icon: 'email',
      placeholder: 'อีเมล',
      value: formData.email,
      field: 'email',
      keyboardType: 'email-address'
    },
    {
      icon: 'lock',
      placeholder: 'รหัสผ่าน',
      value: formData.password,
      field: 'password',
      secureTextEntry: true
    },
    {
      icon: 'lock',
      placeholder: 'ยืนยันรหัสผ่าน',
      value: formData.confirmPassword,
      field: 'confirmPassword',
      secureTextEntry: true
    },
    {
      icon: 'badge',
      placeholder: 'ชื่อ-นามสกุล',
      value: formData.name,
      field: 'name',
      autoCapitalize: 'words'
    },
    {
      icon: 'sports-soccer',
      placeholder: 'ตำแหน่งที่ชอบเล่น',
      value: formData.position,
      field: 'position',
      autoCapitalize: 'words'
    }
  ], [formData]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#1a237e', '#304FFE', '#1E88E5']}
          style={styles.background}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>สมัครสมาชิก</Text>

            {formInputs.map((input, index) => (
              <FormInput
                key={input.field}
                icon={input.icon}
                placeholder={input.placeholder}
                value={input.value}
                onChangeText={(text) => updateFormField(input.field, text)}
                secureTextEntry={input.secureTextEntry}
                keyboardType={input.keyboardType}
                autoCapitalize={input.autoCapitalize}
              />
            ))}

            <TouchableOpacity 
              style={[
                styles.registerButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#304FFE', '#1E88E5']}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>กลับไปหน้าเข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    minHeight: '100%',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#304FFE',
    textAlign: 'center',
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#304FFE',
    fontSize: 16,
  }
});

export default RegisterScreen;
