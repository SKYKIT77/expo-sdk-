import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StyleSheet, Dimensions 
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const userName = userProfile?.name || 'Player';

  const trainingPrograms = [
    {
      id: 1,
      title: "การควบคุมลูกบอล",
      icon: "futbol",
      duration: "30 นาที",
      level: "เริ่มต้น",
      color: '#4CAF50',
      exercises: [
        { name: "ฝึกเลี้ยงบอล", duration: "10 นาที", icon: "running" },
        { name: "ฝึกหยุดบอล", duration: "10 นาที", icon: "stop-circle" },
        { name: "ฝึกครอบครองบอล", duration: "10 นาที", icon: "shield-alt" }
      ]
    },
    {
      id: 2,
      title: "การยิงประตู",
      icon: "crosshairs",
      duration: "45 นาที",
      level: "ปานกลาง",
      color: '#F44336',
      exercises: [
        { name: "ยิงประตูระยะใกล้", duration: "15 นาที", icon: "bullseye" },
        { name: "ยิงประตูระยะไกล", duration: "15 นาที", icon: "dot-circle" },
        { name: "ยิงประตูโค้ง", duration: "15 นาที", icon: "curve" }
      ]
    },
    {
      id: 3,
      title: "การส่งบอล",
      icon: "exchange-alt",
      duration: "40 นาที",
      level: "เริ่มต้น",
      color: '#2196F3',
      exercises: [
        { name: "ส่งบอลระยะสั้น", duration: "15 นาที", icon: "arrow-right" },
        { name: "ส่งบอลระยะยาว", duration: "15 นาที", icon: "arrow-circle-right" },
        { name: "ส่งบอลโค้ง", duration: "10 นาที", icon: "location-arrow" }
      ]
    },
    {
      id: 4,
      title: "การฝึกวิ่ง",
      icon: "running",
      duration: "45 นาที",
      level: "ทุกระดับ",
      color: '#9C27B0',
      exercises: [
        { 
          name: "วิ่งอบอุ่นร่างกาย", 
          duration: "10 นาที", 
          icon: "walking",
          description: "วิ่งเหยาะๆ เพื่ออบอุ่นร่างกาย"
        },
        { 
          name: "วิ่งเร็ว", 
          duration: "15 นาที", 
          icon: "running",
          description: "วิ่งด้วยความเร็วสูงสุด 30 วินาที สลับกับเดิน 30 วินาที"
        },
        { 
          name: "วิ่งระยะกลาง", 
          duration: "15 นาที", 
          icon: "running",
          description: "วิ่งด้วยความเร็วปานกลางต่อเนื่อง"
        },
        { 
          name: "คูลดาวน์", 
          duration: "5 นาที", 
          icon: "walking",
          description: "วิ่งเบาๆ และยืดกล้ามเนื้อ"
        }
      ]
    },
    {
      id: 5,
      title: "สปรินท์",
      icon: "tachometer-alt",
      duration: "30 นาที",
      level: "ขั้นสูง",
      color: '#FF9800',
      exercises: [
        { 
          name: "วอร์มอัพ", 
          duration: "5 นาที", 
          icon: "walking",
          description: "ยืดกล้ามเนื้อและวิ่งเหยาะ"
        },
        { 
          name: "สปรินท์ 100 เมตร", 
          duration: "10 นาที", 
          icon: "running",
          description: "วิ่งเร็วสุดกำลัง x 5 รอบ"
        },
        { 
          name: "สปรินท์ซิกแซก", 
          duration: "10 นาที", 
          icon: "route",
          description: "วิ่งซิกแซกระหว่างกรวย"
        },
        { 
          name: "พักและคูลดาวน์", 
          duration: "5 นาที", 
          icon: "heartbeat",
          description: "ยืดกล้ามเนื้อและผ่อนคลาย"
        }
      ]
    },
    {
      id: 6,
      title: "การป้องกันประตู",
      icon: "hand-paper",
      duration: "40 นาที",
      level: "ผู้รักษาประตู",
      color: '#9C27B0',
      exercises: [
        { 
          name: "รับลูกกราวด์", 
          duration: "10 นาที", 
          icon: "hand-rock",
          description: "ฝึกรับลูกกราวด์ในตำแหน่งต่างๆ"
        },
        { 
          name: "รับลูกกลางอากาศ", 
          duration: "10 นาที", 
          icon: "hand-peace",
          description: "ฝึกกระโดดรับลูกกลางอากาศ"
        },
        { 
          name: "ออกแนว", 
          duration: "10 นาที", 
          icon: "running",
          description: "ฝึกการออกแนวตัดบอล"
        },
        { 
          name: "ส่งบอลยาว", 
          duration: "10 นาที", 
          icon: "hand-point-up",
          description: "ฝึกการส่งบอลยาวด้วยมือ"
        }
      ]
    },
    {
      id: 7,
      title: "ปฏิกิริยาผู้รักษาประตู",
      icon: "bolt",
      duration: "35 นาที",
      level: "ผู้รักษาประตู",
      color: '#FF5722',
      exercises: [
        { 
          name: "ฝึกกระโดดซ้าย-ขวา", 
          duration: "10 นาที", 
          icon: "exchange-alt",
          description: "ฝึกการกระโดดปัดบอลซ้าย-ขวา"
        },
        { 
          name: "ฝึกปฏิกิริยา", 
          duration: "10 นาที", 
          icon: "bolt",
          description: "ฝึกการตอบสนองต่อลูกยิงระยะประชิด"
        },
        { 
          name: "ป้องกันจุดโทษ", 
          duration: "10 นาที", 
          icon: "dot-circle",
          description: "ฝึกการอ่านทางลูกจุดโทษ"
        },
        { 
          name: "คูลดาวน์", 
          duration: "5 นาที", 
          icon: "wind",
          description: "ยืดกล้ามเนื้อและผ่อนคลาย"
        }
      ]
    }
  ];

  const userStats = {
    totalTrainings: 156,
    weeklyProgress: 75,
    achievements: 12
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.headerGradient}
      >
        <View style={styles.stadiumOverlay}>
          <View style={styles.fieldLines}>
            <View style={styles.centerCircle} />
            <View style={styles.centerLine} />
            <View style={styles.penaltyAreaLeft} />
            <View style={styles.penaltyAreaRight} />
          </View>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>ยินดีต้อนรับ</Text>
              <Text style={styles.nameText}>{userProfile?.name || 'นักฟุตบอล'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              <FontAwesome5 name="user-circle" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FontAwesome5 name="stopwatch" size={24} color="#1B5E20" />
          <Text style={styles.statNumber}>{userStats.totalTrainings}</Text>
          <Text style={styles.statLabel}>การฝึกทั้งหมด</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome5 name="trophy" size={24} color="#1B5E20" />
          <Text style={styles.statNumber}>{userStats.weeklyProgress}%</Text>
          <Text style={styles.statLabel}>ความสำเร็จ</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome5 name="medal" size={24} color="#1B5E20" />
          <Text style={styles.statNumber}>{userStats.achievements}</Text>
          <Text style={styles.statLabel}>รางวัล</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>โปรแกรมการฝึก</Text>
      <View style={styles.programsGrid}>
        {trainingPrograms.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={[styles.programCard]}
            onPress={() => navigation.navigate('TrainingDetail', { 
              program,
              allPrograms: trainingPrograms 
            })}
          >
            <LinearGradient
              colors={[program.color, `${program.color}DD`]}
              style={styles.cardGradient}
            >
              <FontAwesome5 name={program.icon} size={32} color="#fff" />
              <Text style={styles.programTitle}>{program.title}</Text>
              <View style={styles.programInfo}>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="clock" size={12} color="#fff" />
                  <Text style={styles.infoText}>{program.duration}</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="layer-group" size={12} color="#fff" />
                  <Text style={styles.infoText}>{program.level}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    height: 250,
    position: 'relative',
  },
  stadiumOverlay: {
    flex: 1,
    padding: 20,
  },
  fieldLines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  centerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  centerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
  },
  penaltyAreaLeft: {
    width: '30%',
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -50,
  },
  penaltyAreaRight: {
    width: '30%',
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -40,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
    margin: 20,
  },
  programsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  programCard: {
    width: '48%',
    height: 180, // Increased height for better visibility
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  programInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  profileIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 5,
  },
});

export default HomeScreen;
