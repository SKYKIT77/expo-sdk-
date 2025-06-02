import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const sampleNotifications = [
  { 
    id: '1', 
    type: 'training',
    title: 'ตารางฝึกซ้อม', 
    message: 'ฝึกซ้อมวันเสาร์ เวลา 15:00-17:00 น.',
    timestamp: new Date().toISOString(),
    status: 'upcoming'
  },
  { id: '2', type: 'activity', title: 'กิจกรรมพิเศษ', message: 'แข่งขันกีฬาสีประจำปี วันที่ 15 ธันวาคม' },
  { id: '3', type: 'announcement', title: 'ประกาศ', message: 'ประชุมผู้ปกครองวันที่ 20 ธันวาคม' },
];

const AddNotificationModal = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [trainingDate, setTrainingDate] = useState('');

  const handleSubmit = () => {
    onAdd({
      id: Date.now().toString(),
      type: 'training',
      title,
      message,
      trainingDate,
      timestamp: new Date().toISOString(),
      status: 'upcoming'
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>เพิ่มการแจ้งเตือนใหม่</Text>
          <TextInput
            style={styles.input}
            placeholder="หัวข้อ"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="รายละเอียด"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="วันที่และเวลาฝึกซ้อม"
            value={trainingDate}
            onChangeText={setTrainingDate}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
              <Text style={styles.actionButtonText}>บันทึก</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.closeButton]} 
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const NotificationItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={styles.notificationItem}>
    <View style={styles.notificationHeader}>
      <Text style={styles.notificationType}>{item.title}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString('th-TH')}
      </Text>
    </View>
    <Text style={styles.notificationMessage}>{item.message}</Text>
    {item.status === 'upcoming' && (
      <View style={styles.upcomingBadge}>
        <Text style={styles.upcomingText}>กำลังจะมาถึง</Text>
      </View>
    )}
  </TouchableOpacity>
);

const NotificationModal = ({ visible, notification, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{notification?.title}</Text>
        <Text style={styles.modalMessage}>{notification?.message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>ปิด</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleAddNotification = (newNotification) => {
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>การแจ้งเตือน</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <NotificationModal
        visible={modalVisible}
        notification={selectedNotification}
        onClose={() => setModalVisible(false)}
      />
      <AddNotificationModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  upcomingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  upcomingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Notifications;
