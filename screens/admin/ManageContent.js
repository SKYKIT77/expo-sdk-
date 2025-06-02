import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ContentCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <LinearGradient
      colors={['#4a90e2', '#357abd']}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={40} color="#FFF" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={30} color="#FFF" />
    </LinearGradient>
  </TouchableOpacity>
);

const ContentDetailModal = ({ visible, content, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <LinearGradient
          colors={['#4a90e2', '#357abd']}
          style={styles.modalHeader}
        >
          <Text style={styles.modalTitle}>{content?.title}</Text>
        </LinearGradient>
        <Text style={styles.modalDescription}>{content?.description}</Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="edit" size={24} color="white" />
            <Text style={styles.actionButtonText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.closeButton]} 
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color="white" />
            <Text style={styles.actionButtonText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ManageContent = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleContentPress = (content) => {
    setSelectedContent(content);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>จัดการเนื้อหา</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentCard
          title="แบบฝึกซ้อม"
          description="จัดการรูปแบบการฝึกซ้อมพื้นฐาน"
          icon="fitness-center"
          onPress={() => handleContentPress({ title: "แบบฝึกซ้อม", description: "จัดการรูปแบบการฝึกซ้อมพื้นฐาน" })}
        />
        <ContentCard
          title="แทคติกการเล่น"
          description="จัดการกลยุทธ์และแทคติกการเล่น"
          icon="schema"
          onPress={() => handleContentPress({ title: "แทคติกการเล่น", description: "จัดการกลยุทธ์และแทคติกการเล่น" })}
        />
        <ContentCard
          title="โปรแกรมการฝึกซ้อม"
          description="จัดการตารางและโปรแกรมการฝึกซ้อม"
          icon="event"
          onPress={() => handleContentPress({ title: "โปรแกรมการฝึกซ้อม", description: "จัดการตารางและโปรแกรมการฝึกซ้อม" })}
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalDescription: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 20,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#95a5a6',
  }
});

export default ManageContent;
