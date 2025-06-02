import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AdminProfile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  const adminInfo = {
    name: 'แอดมิน',
    email: 'admin@gmail.com',
    role: 'ผู้ดูแลระบบ',
    joinDate: '01/01/2024'
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('ขออภัย', 'เราต้องการการอนุญาตเพื่อเข้าถึงรูปภาพ');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบใช่หรือไม่?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel'
        },
        {
          text: 'ยืนยัน',
          style: 'destructive',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        }
      ]
    );
  };

  const animateButton = (scale) => {
    Animated.spring(buttonScale, {
      toValue: scale,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#043927', '#0B6E4F', '#08A045']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>โปรไฟล์ผู้ดูแลระบบ</Text>
      </LinearGradient>

      <View style={styles.profileContent}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleImagePick}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={styles.avatarImage} 
            />
          ) : (
            <LinearGradient
              colors={['#E8F5E9', '#C8E6C9']}
              style={styles.avatarPlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="account-circle" size={100} color="#2E7D32" />
              <Text style={styles.addPhotoText}>เพิ่มรูปโปรไฟล์</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <View style={[styles.infoSection, styles.elevation]}>
          <InfoItem icon="person" label="ชื่อ" value={adminInfo.name} />
          <InfoItem icon="email" label="อีเมล" value={adminInfo.email} />
          <InfoItem icon="work" label="ตำแหน่ง" value={adminInfo.role} />
          <InfoItem icon="date-range" label="วันที่เริ่มงาน" value={adminInfo.joinDate} />
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={[styles.logoutButton, styles.elevation]}
            onPress={handleLogout}
            onPressIn={() => animateButton(0.95)}
            onPressOut={() => animateButton(1)}
          >
            <LinearGradient
              colors={['#D32F2F', '#B71C1C']}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="logout" size={24} color="#fff" />
              <Text style={styles.logoutText}>ออกจากระบบ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon} size={24} color="#455A64" />
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileContent: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  addPhotoText: {
    color: '#2E7D32',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '600',
    marginTop: 4,
  },
  elevation: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutButton: {
    borderRadius: 15,
    marginTop: 30,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AdminProfile;
