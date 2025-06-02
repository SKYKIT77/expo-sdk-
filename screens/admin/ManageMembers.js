import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { db } from '../../firebase';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const membersList = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().email !== 'admin@gmail.com') {
          const userData = doc.data();
          console.log('User data:', {
            ...userData,
            username: userData.username || 'No username',
            id: doc.id
          });
          membersList.push({ id: doc.id, ...userData });
        }
      });
      setMembers(membersList);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'ไม่สามารถดึงข้อมูลสมาชิกได้');
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    Alert.alert(
      'ยืนยัน',
      'คุณต้องการลบสมาชิกนี้ใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', memberId));
              fetchMembers();
              Alert.alert('สำเร็จ', 'ลบสมาชิกเรียบร้อยแล้ว');
            } catch (error) {
              Alert.alert('Error', 'ไม่สามารถลบสมาชิกได้');
            }
          }
        }
      ]
    );
  };

  const toggleMemberStatus = async (memberId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', memberId), {
        status: !currentStatus
      });
      fetchMembers();
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถอัพเดทสถานะได้');
    }
  };

  const handleEditMember = async (member) => {
    setEditingMember(member);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async (memberId, updatedData) => {
    try {
      await updateDoc(doc(db, 'users', memberId), updatedData);
      setIsEditModalVisible(false);
      setEditingMember(null);
      fetchMembers();
      Alert.alert('สำเร็จ', 'อัพเดทข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถอัพเดทข้อมูลได้');
    }
  };

  const renderMemberItem = ({ item }) => {
    console.log('Rendering member:', {
      id: item.id,
      username: item.username,
      fullname: item.fullname
    });
    
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={50} color="#1976D2" />
            <View style={[styles.onlineIndicator, 
              { backgroundColor: item.status ? '#4CAF50' : '#757575' }]} />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.memberName}>
                {item.fullname || item.username || 'ไม่ระบุชื่อ'}
              </Text>
              <Text style={styles.usernameText}>
                @{item.username || 'ไม่ระบุ username'}
              </Text>
              <View style={[styles.roleTag, 
                { backgroundColor: item.position === 'admin' ? '#FFD700' : '#E3F2FD' }]}>
                <Text style={[styles.roleText, 
                  { color: item.position === 'admin' ? '#333' : '#1976D2' }]}>
                  {item.position || 'สมาชิก'}
                </Text>
              </View>
            </View>
            <Text style={styles.userIdText}>ID: {item.id.substring(0, 8)}</Text>
          </View>
        </View>

        <View style={styles.memberDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="#1976D2" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="badge" size={20} color="#1976D2" />
            <Text style={styles.detailText}>
              สถานะ: <Text style={{ fontWeight: '600' }}>
                {item.status ? 'กำลังใช้งาน' : 'ระงับการใช้งาน'}
              </Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="sports-soccer" size={20} color="#1976D2" />
            <Text style={styles.detailText}>
              ตำแหน่ง: {item.playerPosition || 'ไม่ระบุ'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, 
              { backgroundColor: item.status ? '#FF5252' : '#4CAF50' }]}
            onPress={() => toggleMemberStatus(item.id, item.status)}>
            <MaterialIcons 
              name={item.status ? "block" : "check-circle"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {item.status ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFA000' }]}
            onPress={() => handleEditMember(item)}>
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.buttonText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteMember(item.id)}>
            <MaterialIcons name="delete-outline" size={20} color="white" />
            <Text style={styles.buttonText}>ลบสมาชิก</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>จัดการสมาชิก</Text>
        <Text style={styles.subtitle}>สมาชิกทั้งหมด {members.length} คน</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={styles.loader} />
      ) : (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <EditMemberModal
        visible={isEditModalVisible}
        member={editingMember}
        onSave={handleSaveEdit}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingMember(null);
        }}
      />
    </View>
  );
};

const EditMemberModal = ({ visible, member, onSave, onClose }) => {
  const [fullname, setFullname] = useState(member?.fullname || '');
  const [playerPosition, setPlayerPosition] = useState(member?.playerPosition || '');

  const handleSubmit = () => {
    onSave(member.id, {
      fullname,
      playerPosition
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>แก้ไขข้อมูลสมาชิก</Text>
          
          <TextInput
            style={styles.input}
            placeholder="ชื่อ-นามสกุล"
            value={fullname}
            onChangeText={setFullname}
          />
          
          <TextInput
            style={styles.input}
            placeholder="ตำแหน่งที่เล่น"
            value={playerPosition}
            onChangeText={setPlayerPosition}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  headerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  usernameText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontStyle: 'italic'
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userIdText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  memberDetails: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
});

export default ManageMembers;
