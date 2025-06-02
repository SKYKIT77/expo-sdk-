import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDateTimePicker = ({ 
  isVisible, 
  onClose, 
  onSelect, 
  mode, 
  currentDate,
  minDate 
}) => {
  const handleDateSelect = (date) => {
    onSelect(date);
    onClose();
  };

  const handleTimeSelect = (event, selectedTime) => {
    if (event.type === 'set') {
      onSelect(selectedTime);
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {mode === 'date' ? 'เลือกวันที่' : 'เลือกเวลา'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {mode === 'date' ? (
            <Calendar
              onDayPress={(day) => {
                handleDateSelect(new Date(day.timestamp));
              }}
              minDate={minDate.toISOString().split('T')[0]}
              markedDates={{
                [currentDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: '#1976D2'
                }
              }}
              theme={{
                todayTextColor: '#1976D2',
                selectedDayBackgroundColor: '#1976D2',
                arrowColor: '#1976D2',
              }}
            />
          ) : (
            <View style={styles.timePickerContainer}>
              <DateTimePicker
                value={currentDate}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeSelect}
                style={styles.timePicker}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  timePickerContainer: {
    height: 200,
    alignItems: 'center',
  },
  timePicker: {
    width: '100%',
  }
});

export default CustomDateTimePicker;
