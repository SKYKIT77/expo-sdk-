import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthProvider } from './contexts/AuthContext';
import { initializeDatabase } from './config/firebase';

// Import screens
import LoginScreen from './screens/LoginScreen';
import TrainingDetailScreen from './screens/TrainingDetailScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import TrainingHistoryScreen from './screens/TrainingHistoryScreen';
import MainApp from './screens/MainApp';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminDashboard from './screens/AdminDashboard'; // Updated path
import ManageMembers from './screens/admin/ManageMembers';
import ManageSchedule from './screens/admin/ManageSchedule';
import ManageContent from './screens/admin/ManageContent';
import Analytics from './screens/admin/Analytics';
import Notifications from './screens/admin/Notifications';
import Settings from './screens/admin/Settings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#304FFE',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#304FFE',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainApp}
        options={{
          headerTitle: 'หน้าหลัก',
          tabBarLabel: 'หน้าหลัก',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={TrainingHistoryScreen}
        options={{
          headerTitle: 'ประวัติการฝึก',
          tabBarLabel: 'ประวัติ',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile" // Changed from "Settings" to "Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'โปรไฟล์',
          tabBarLabel: 'ตั้งค่า',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  // เรียกใช้ฟังก์ชันเพื่อเพิ่มข้อมูลเริ่มต้น (ใช้ครั้งเดียวตอนเริ่มต้น)
  // initializeDatabase();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen 
              name="AdminDashboard" 
              component={AdminDashboard}
              options={{
                headerShown: false,
                gestureEnabled: false
              }}
            />
            <Stack.Screen 
              name="TrainingDetail" 
              component={TrainingDetailScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#304FFE',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{
                headerShown: true,
                headerTitle: 'แก้ไขโปรไฟล์',
                headerStyle: {
                  backgroundColor: '#304FFE',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{
                headerShown: true,
                headerTitle: 'ลืมรหัสผ่าน',
                headerStyle: {
                  backgroundColor: '#304FFE',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="ManageMembers" 
              component={ManageMembers}
              options={{
                headerShown: true,
                headerTitle: 'จัดการสมาชิก',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="ManageSchedule" 
              component={ManageSchedule}
              options={{
                headerShown: true,
                headerTitle: 'จัดการตารางฝึกซ้อม',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="ManageContent" 
              component={ManageContent}
              options={{
                headerShown: true,
                headerTitle: 'จัดการเนื้อหา',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Analytics" 
              component={Analytics}
              options={{
                headerShown: true,
                headerTitle: 'วิเคราะห์ข้อมูล',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={Notifications}
              options={{
                headerShown: true,
                headerTitle: 'การแจ้งเตือน',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={Settings}
              options={{
                headerShown: true,
                headerTitle: 'การตั้งค่า',
                headerStyle: { backgroundColor: '#304FFE' },
                headerTintColor: '#fff',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
