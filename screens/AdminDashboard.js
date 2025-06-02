import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeSchedules: 0,
    notifications: 0
  });

  const menuItems = [
    { 
      title: 'จัดการสมาชิก', 
      icon: 'people',
      route: 'ManageMembers',
      gradient: ['#4CAF50', '#2E7D32'],
      stats: stats.totalMembers + ' คน'
    },
    { 
      title: 'จัดการตารางฝึกซ้อม', 
      icon: 'schedule',
      route: 'ManageSchedule',
      gradient: ['#2196F3', '#1976D2'],
      stats: stats.activeSchedules + ' รายการ'
    },
    { 
      title: 'จัดการเนื้อหา', 
      icon: 'library-books',
      route: 'ManageContent',
      gradient: ['#9C27B0', '#7B1FA2'],
      stats: '4 บทเรียน'
    },
    { 
      title: 'วิเคราะห์ข้อมูล', 
      icon: 'analytics',
      route: 'Analytics',
      gradient: ['#FF9800', '#F57C00'],
      stats: 'รายงานประจำเดือน'
    },
    { 
      title: 'การแจ้งเตือน', 
      icon: 'notifications',
      route: 'Notifications',
      gradient: ['#F44336', '#D32F2F'],
      stats: stats.notifications + ' รายการ'
    },
    { 
      title: 'โปรไฟล์ผู้ดูแลระบบ', 
      icon: 'account-circle',
      route: 'AdminProfile',
      gradient: ['#455A64', '#37474F'],
      stats: 'ข้อมูลส่วนตัว'
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total members
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalMembers = usersSnapshot.docs.filter(doc => doc.data().email !== 'admin@gmail.com').length;

      // Fetch active schedules
      const schedulesQuery = query(collection(db, 'trainings'));
      const schedulesSnapshot = await getDocs(schedulesQuery);
      const activeSchedules = schedulesSnapshot.docs.length;

      // Fetch notifications
      const notificationsQuery = query(collection(db, 'notifications'));
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notifications = notificationsSnapshot.docs.length;

      setStats({
        totalMembers,
        activeSchedules,
        notifications
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>ยินดีต้อนรับ</Text>
            <Text style={styles.headerTitle}>ผู้ดูแลระบบ</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <LinearGradient
                colors={item.gradient}
                style={styles.menuGradient}
              >
                <MaterialIcons name={item.icon} size={32} color="#fff" />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Text style={styles.statsText}>{item.stats}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>สรุปภาพรวม</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FontAwesome5 name="users" size={24} color="#1B5E20" />
              <Text style={styles.statNumber}>{stats.totalMembers}</Text>
              <Text style={styles.statLabel}>สมาชิกทั้งหมด</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="calendar-check" size={24} color="#1B5E20" />
              <Text style={styles.statNumber}>{stats.activeSchedules}</Text>
              <Text style={styles.statLabel}>ตารางฝึกซ้อม</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome5 name="bell" size={24} color="#1B5E20" />
              <Text style={styles.statNumber}>{stats.notifications}</Text>
              <Text style={styles.statLabel}>โปรไฟล์ผู้ดูแลระบบ</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  menuItem: {
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  menuGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  menuTextContainer: {
    marginTop: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  quickStats: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AdminDashboard;
