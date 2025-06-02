import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Alert } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyADa72ADFdy9MqGI96v7nlQRyWSE36GCvY",
  authDomain: "kitasd-f9bbc.firebaseapp.com",
  projectId: "kitasd-f9bbc",
  storageBucket: "kitasd-f9bbc.firebasestorage.app",
  messagingSenderId: "909678468250",
  appId: "1:909678468250:web:19c903ef1317de80901323",
  measurementId: "G-LTYFPVFJ8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use getFirestore instead of initializeFirestore
const db = getFirestore(app);
const auth = getAuth(app);

// Utility function for retry operations with better error handling
const withRetry = async (operation, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

const safeFirestoreCall = async (operation) => {
  try {
    return await withRetry(operation);
  } catch (error) {
    console.error('Firestore operation failed:', error);
    Alert.alert(
      'การเชื่อมต่อล้มเหลว',
      'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง'
    );
    throw error;
  }
};

export { auth, db, safeFirestoreCall };