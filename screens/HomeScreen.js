import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StyleSheet, RefreshControl
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    const mockNotifications = [
      {
        id: 1,
        message: "โปรแกรมฝึกใหม่: การฝึกความเร็ว",
        date: new Date().toISOString(),
        type: "new_program",
        isRead: false
      },
      {
        id: 2,
        message: "คุณได้รับรางวัลใหม่!",
        date: new Date().toISOString(),
        type: "achievement",
        isRead: false
      }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, []);

  const trainingPrograms = [
    {
      id: 1,
      title: "การควบคุมลูกบอล",
      icon: "futbol",
      duration: "30 นาที",
      level: "เริ่มต้น",
      color: '#4CAF50',
    },
    {
      id: 2,
      title: "การยิงประตู",
      icon: "crosshairs",
      duration: "45 นาที",
      level: "ปานกลาง",
      color: '#F44336',
    },
    {
      id: 3,
      title: "การส่งบอล",
      icon: "exchange-alt",
      duration: "40 นาที",
      level: "เริ่มต้น",
      color: '#2196F3',
    },
    {
      id: 4,
      title: "การฝึกวิ่ง",
      icon: "running",
      duration: "45 นาที",
      level: "ทุกระดับ",
      color: '#9C27B0',
    },
    {
      id: 5,
      title: "สปรินท์",
      icon: "tachometer-alt",
      duration: "30 นาที",
      level: "ขั้นสูง",
      color: '#FF9800',
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>สวัสดี,</Text>
            <Text style={styles.nameText}>{userProfile?.name || 'นักฟุตบอล'}</Text>
            <Text style={styles.subtitleText}>มาเริ่มฝึกซ้อมกันเถอะ! 🎯</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <FontAwesome5 name="user-circle" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {isAuthenticated ? (
        <>
          <Text style={styles.sectionTitle}>โปรแกรมการฝึก</Text>
          <View style={styles.programsGrid}>
            {trainingPrograms.map((program) => (
              <TouchableOpacity
                key={program.id}
                style={styles.programCard}
                onPress={() => navigation.navigate('TrainingDetail', { program })}
              >
                <LinearGradient
                  colors={[program.color, `${program.color}99`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name={program.icon} size={24} color="#fff" />
                  </View>
                  <View style={styles.programContent}>
                    <Text style={styles.programTitle}>{program.title}</Text>
                    <View style={styles.programInfo}>
                      <View style={styles.infoItem}>
                        <FontAwesome5 name="clock" size={12} color="#fff" />
                        <Text style={styles.infoText}>{program.duration}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <FontAwesome5 name="signal" size={12} color="#fff" />
                        <Text style={styles.infoText}>{program.level}</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>กรุณาเข้าสู่ระบบเพื่อดูโปรแกรมการฝึก</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    minHeight: 200,
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  profileButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    margin: 20,
    marginBottom: 10,
  },
  programsGrid: {
    padding: 10,
  },
  programCard: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  programContent: {
    flex: 1,
  },
  programTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  programInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  loginPrompt: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
