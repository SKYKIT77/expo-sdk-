import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, TextInput, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';  // Add this import
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';

const SKILL_LEVELS = [
  { id: 'beginner', label: 'มือใหม่' },
  { id: 'intermediate', label: 'ปานกลาง' },
  { id: 'advanced', label: 'ขั้นสูง' }
];

const POSITIONS = [
  { id: 'gk', label: 'ผู้รักษาประตู', icon: 'catching' },
  { id: 'df', label: 'กองหลัง', icon: 'shield' },
  { id: 'mf', label: 'กองกลาง', icon: 'sync-alt' },
  { id: 'fw', label: 'กองหน้า', icon: 'futbol' }
];

const ProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    position: userProfile.position,
    level: userProfile.level,
    avatar: userProfile.avatar
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเลือกรูปภาพได้');
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    Alert.alert('สำเร็จ', 'อัพเดทข้อมูลเรียบร้อย');
  };

  const handleLogout = () => {
    Alert.alert(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={isEditing ? pickImage : undefined}
        >
          <Image
            source={
              formData.avatar 
                ? { uri: formData.avatar }
                : { uri: 'https://via.placeholder.com/120x120' } // Changed to use placeholder image URL
            }
            style={styles.avatar}
          />
          {isEditing && (
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="ชื่อ-นามสกุล"
          />
        ) : (
          <Text style={styles.name}>{userProfile.name}</Text>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
        
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="#304FFE" />
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="อีเมล"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.infoText}>{userProfile.email}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="sports-soccer" size={24} color="#304FFE" />
          {isEditing ? (
            <View style={styles.positionSelector}>
              {POSITIONS.map((pos) => (
                <TouchableOpacity
                  key={pos.id}
                  style={[
                    styles.positionButton,
                    formData.position === pos.id && styles.positionButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, position: pos.id }))}
                >
                  <FontAwesome5 name={pos.icon} size={16} color={formData.position === pos.id ? '#fff' : '#304FFE'} />
                  <Text style={[
                    styles.positionButtonText,
                    formData.position === pos.id && styles.positionButtonTextActive
                  ]}>{pos.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.infoText}>
              {POSITIONS.find(p => p.id === userProfile.position)?.label || 'ไม่ระบุ'}
            </Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="grade" size={24} color="#304FFE" />
          {isEditing ? (
            <View style={styles.skillSelector}>
              {SKILL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.skillButton,
                    formData.skillLevel === level.id && styles.skillButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, skillLevel: level.id }))}
                >
                  <Text style={[
                    styles.skillButtonText,
                    formData.skillLevel === level.id && styles.skillButtonTextActive
                  ]}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.infoText}>
              {SKILL_LEVELS.find(l => l.id === userProfile.skillLevel)?.label || 'ไม่ระบุ'}
            </Text>
          )}
        </View>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>แก้ไขข้อมูล</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutText]}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#304FFE',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#304FFE',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  nameInput: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 5,
    minWidth: 200,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#304FFE',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: '#304FFE',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#666',
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#FF3B30',
  },
  positionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 10,
    flex: 1,
  },
  positionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#304FFE',
    backgroundColor: '#fff',
  },
  positionButtonActive: {
    backgroundColor: '#304FFE',
  },
  positionButtonText: {
    color: '#304FFE',
    marginLeft: 4,
    fontSize: 14,
  },
  positionButtonTextActive: {
    color: '#fff',
  },
  skillSelector: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
    flex: 1,
  },
  skillButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#304FFE',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  skillButtonActive: {
    backgroundColor: '#304FFE',
  },
  skillButtonText: {
    color: '#304FFE',
    fontSize: 14,
  },
  skillButtonTextActive: {
    color: '#fff',
  },
});

export default ProfileScreen;
