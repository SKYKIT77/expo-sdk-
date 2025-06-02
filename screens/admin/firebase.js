import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence 
} from "firebase/firestore";
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

// Configure and enable persistence before getting Firestore instance
let db;
try {
  db = getFirestore(app);
  enableIndexedDbPersistence(db, {
    experimentalForceOwningTab: true
  }).then(() => {
    console.log('Persistence enabled successfully');
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed - multiple tabs might be open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence not available');
    }
  });
} catch (error) {
  console.warn('Firebase initialization error:', error);
  db = getFirestore(app); // Fallback to normal initialization
}

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