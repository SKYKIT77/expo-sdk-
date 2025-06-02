import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const ContentCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <MaterialIcons name={icon} size={32} color="#007AFF" />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

const ContentDetailModal = ({ visible, content, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{content?.title}</Text>
        <Text style={styles.modalDescription}>{content?.description}</Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.actionButtonText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.closeButton]} onPress={onClose}>
            <Text style={styles.actionButtonText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ManageContent = ({ navigation }) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'จัดการเนื้อหา',
      });
    }, [navigation])
  );

  const handleContentPress = (content, screenName) => {
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      setSelectedContent(content);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>จัดการเนื้อหา</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentCard
          title="แบบฝึกซ้อม"
          description="จัดการรูปแบบการฝึกซ้อมพื้นฐาน"
          icon="fitness-center"
          onPress={() => handleContentPress(null, 'ManageExercises')}
        />
        <ContentCard
          title="แทคติกการเล่น"
          description="จัดการกลยุทธ์และแทคติกการเล่น"
          icon="schema"
          onPress={() => handleContentPress(null, 'ManageTactics')}
        />
        <ContentCard
          title="โปรแกรมการฝึกซ้อม"
          description="จัดการตารางและโปรแกรมการฝึกซ้อม"
          icon="event"
          onPress={() => handleContentPress(null, 'ManagePrograms')}
        />
        
      </ScrollView>
      <ContentDetailModal
        visible={modalVisible}
        content={selectedContent}
        onClose={() => setModalVisible(false)}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
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
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#666',
  }
});

export default ManageContent;
