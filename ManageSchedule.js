import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { db, safeFirestoreCall, realtimeDb } from '../../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  orderBy,
  where
} from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatThaiDateTime } from '../../utils/dateUtils';  // สร้างไฟล์ใหม่
import CustomDateTimePicker from '../../components/CustomDateTimePicker';

const ManageSchedule = ({ route, navigation }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    players: [],
    warmup: { duration: '15', content: '' },
    mainPhase: { duration: '30', content: '' },
    cooldown: { duration: '15', content: '' },
    maxParticipants: '',
    requirements: '',
    difficulty: 'ระดับเริ่มต้น'
  });
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [trainingContent, setTrainingContent] = useState({
    warmup: { duration: '15', description: 'วอร์มอัพร่างกาย' },
    mainPhase: { duration: '30', description: 'การฝึกหลัก' },
    cooldown: { duration: '15', description: 'คูลดาวน์' }
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [minDate] = useState(new Date()); // วันที่ต่ำสุดที่เลือกได้คือวันนี้
  const [searchText, setSearchText] = useState('');  // เพิ่ม state สำหรับค้นหา
  const [newParticipant, setNewParticipant] = useState('');
  const [participants, setParticipants] = useState([]);

  const steps = [
    {
      title: 'ข้อมูลการฝึกซ้อม',
      icon: 'event-note'
    },
    {
      title: 'ผู้เข้าร่วมและรายละเอียด',
      icon: 'group'
    }
  ];

  useEffect(() => {
    const unsubscribe = realtimeDb.onTrainingsChange((trainings) => {
      setSchedules(trainings.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อผู้เข้าร่วม');
      return;
    }
    
    setParticipants(prev => [...prev, { name: newParticipant.trim() }]);
    setNewParticipant('');
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.title || !newSchedule.date || participants.length === 0) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const scheduleData = {
        ...newSchedule,
        players: participants,
        status: 'upcoming'
      };

      await realtimeDb.createTraining(scheduleData);
      
      // Send notifications to participants
      for (const player of participants) {
        await realtimeDb.createNotification({
          userId: player.id,
          title: 'ตารางฝึกซ้อมใหม่',
          message: `คุณถูกเพิ่มในตารางฝึกซ้อม: ${newSchedule.title}`,
          type: 'training'
        });
      }

      setModalVisible(false);
      resetForm();
      Alert.alert('สำเร็จ', 'เพิ่มตารางฝึกซ้อมและส่งการแจ้งเตือนแล้ว');
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเพิ่มตารางฝึกซ้อมได้');
    }
  };

  const resetForm = () => {
    setNewSchedule({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      players: [],
      warmup: { duration: '15', content: '' },
      mainPhase: { duration: '30', content: '' },
      cooldown: { duration: '15', content: '' },
      maxParticipants: '',
      requirements: '',
      difficulty: 'ระดับเริ่มต้น'
    });
    setParticipants([]);
    setNewParticipant('');
  };

  const renderPlayerItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.playerItem,
        selectedPlayers.some(p => p.id === item.id) && styles.playerItemSelected
      ]}
      onPress={() => togglePlayerSelection(item)}
    >
      <MaterialIcons 
        name={selectedPlayers.some(p => p.id === item.id) ? "check-circle" : "radio-button-unchecked"}
        size={24}
        color={selectedPlayers.some(p => p.id === item.id) ? "#4CAF50" : "#666"}
      />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.fullname || item.username}</Text>
        <Text style={styles.playerEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const togglePlayerSelection = (player) => {
    setSelectedPlayers(prev => 
      prev.some(p => p.id === player.id)
        ? prev.filter(p => p.id !== player.id)
        : [...prev, player]
    );
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="event" size={24} color="#1976D2" />
        <Text style={styles.scheduleTitle}>{item.title}</Text>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={20} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        {item.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>ผู้เข้าร่วม ({item.players?.length || 0})</Text>
          {item.players?.map((player, index) => (
            <Text key={player.id || `player-${index}`} style={styles.playerName}>
              {index + 1}. {player.name}
            </Text>
          ))}
        </View>

        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { 
            color: getStatusColor(item.date, item.time)
          }]}>
            {getStatusText(item.date, item.time)}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditSchedule(item)}>
          <MaterialIcons name="edit" size={20} color="white" />
          <Text style={styles.buttonText}>แก้ไข</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteSchedule(item.id)}>
          <MaterialIcons name="delete" size={20} color="white" />
          <Text style={styles.buttonText}>ลบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTrainingScheduleSection = () => (
    <View style={styles.scheduleSection}>
      <Text style={styles.sectionHeader}>กำหนดการฝึกซ้อม</Text>
      
      <View style={styles.phasesContainer}>
        <View style={styles.phaseCard}>
          <MaterialIcons name="fitness-center" size={24} color="#FF9800" />
          <Text style={styles.phaseTitle}>วอร์มอัพ</Text>
          <TextInput
            style={styles.durationInput}
            placeholder="ระยะเวลา (นาที)"
            value={newSchedule.warmup.duration}
            keyboardType="numeric"
            onChangeText={(text) => updatePhaseInfo('warmup', 'duration', text)}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="รายละเอียดการวอร์มอัพ"
            multiline
            value={newSchedule.warmup.content}
            onChangeText={(text) => updatePhaseInfo('warmup', 'content', text)}
          />
        </View>

        <View style={[styles.phaseCard, styles.mainPhase]}>
          <MaterialIcons name="speed" size={24} color="#4CAF50" />
          <Text style={styles.phaseTitle}>การฝึกหลัก</Text>
          <TextInput
            style={styles.durationInput}
            placeholder="ระยะเวลา (นาที)"
            value={newSchedule.mainPhase.duration}
            keyboardType="numeric"
            onChangeText={(text) => updatePhaseInfo('mainPhase', 'duration', text)}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="รายละเอียดการฝึกหลัก"
            multiline
            value={newSchedule.mainPhase.content}
            onChangeText={(text) => updatePhaseInfo('mainPhase', 'content', text)}
          />
        </View>

        <View style={styles.phaseCard}>
          <MaterialIcons name="accessibility" size={24} color="#2196F3" />
          <Text style={styles.phaseTitle}>คูลดาวน์</Text>
          <TextInput
            style={styles.durationInput}
            placeholder="ระยะเวลา (นาที)"
            value={newSchedule.cooldown.duration}
            keyboardType="numeric"
            onChangeText={(text) => updatePhaseInfo('cooldown', 'duration', text)}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="รายละเอียดการคูลดาวน์"
            multiline
            value={newSchedule.cooldown.content}
            onChangeText={(text) => updatePhaseInfo('cooldown', 'content', text)}
          />
        </View>
      </View>

      <View style={styles.additionalInfo}>
        <TextInput
          style={styles.input}
          placeholder="จำนวนผู้เข้าร่วมสูงสุด"
          keyboardType="numeric"
          value={newSchedule.maxParticipants}
          onChangeText={(text) => setNewSchedule({...newSchedule, maxParticipants: text})}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="อุปกรณ์ที่ต้องเตรียม"
          multiline
          value={newSchedule.requirements}
          onChangeText={(text) => setNewSchedule({...newSchedule, requirements: text})}
        />
        <View style={styles.difficultySelector}>
          <Text style={styles.difficultyLabel}>ระดับความยาก:</Text>
          <View style={styles.difficultyButtons}>
            {['ระดับเริ่มต้น', 'ระดับกลาง', 'ระดับสูง'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  newSchedule.difficulty === level && styles.difficultyButtonActive
                ]}
                onPress={() => setNewSchedule({...newSchedule, difficulty: level})}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  newSchedule.difficulty === level && styles.difficultyButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const updatePhaseInfo = (phase, field, value) => {
    setNewSchedule({
      ...newSchedule,
      [phase]: {
        ...newSchedule[phase],
        [field]: value
      }
    });
  };

  const validateForm = (step) => {
    const errors = {};
    if (step === 1) {
      if (!newSchedule.title) errors.title = 'กรุณาระบุชื่อการฝึกซ้อม';
      if (!newSchedule.date) errors.date = 'กรุณาเลือกวันที่';
      if (!newSchedule.time) errors.time = 'กรุณาเลือกเวลา';
      if (!newSchedule.location) errors.location = 'กรุณาระบุสถานที่';
    } else {
      if (selectedPlayers.length === 0) errors.players = 'กรุณาเลือกผู้เล่นอย่างน้อย 1 คน';
      if (!newSchedule.maxParticipants) errors.maxParticipants = 'กรุณาระบุจำนวนผู้เข้าร่วม';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
    
    const currentDate = selectedDate || scheduleDate;
    setShow(false);
    setScheduleDate(currentDate);

    if (mode === 'date') {
      const thaiDate = formatThaiDateTime(currentDate, 'date');
      setNewSchedule(prev => ({
        ...prev,
        date: thaiDate,
        rawDate: currentDate
      }));
    } else {
      const thaiTime = formatThaiDateTime(currentDate, 'time');
      const timeStr = currentDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setNewSchedule(prev => ({
        ...prev,
        time: thaiTime,
        rawTime: timeStr,
        timestamp: currentDate.getTime()
      }));
    }
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const renderDateTimeInputs = () => (
    <View style={styles.dateTimeContainer}>
      {/* วันที่ */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>วันที่ฝึกซ้อม (วว/ดด/ปปปป) *</Text>
        <TextInput
          style={[styles.input, formErrors.date && styles.inputError]}
          placeholder="01/01/2567"
          value={newSchedule.date}
          onChangeText={(text) => {
            // อนุญาตให้พิมพ์เฉพาะตัวเลขและ /
            const formatted = text.replace(/[^\d/]/g, '');
            // จัดรูปแบบอัตโนมัติ เช่น 01/01/2567
            let dateFormatted = formatted;
            if (formatted.length >= 2 && !formatted.includes('/')) {
              dateFormatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
            }
            if (formatted.length >= 5 && formatted.split('/').length === 2) {
              const parts = dateFormatted.split('/');
              dateFormatted = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
            }

            // ตรวจสอบความถูกต้องของวันที่
            if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(dateFormatted)) {
              const [day, month, year] = dateFormatted.split('/').map(Number);
              // ตรวจสอบปี พ.ศ. และแปลงเป็น ค.ศ.
              const yearCE = year - 543;
              const date = new Date(yearCE, month - 1, day);

              if (date >= new Date() && 
                  month >= 1 && month <= 12 && 
                  day >= 1 && day <= new Date(yearCE, month, 0).getDate()) {
                setNewSchedule(prev => ({
                  ...prev,
                  date: dateFormatted,
                  rawDate: date
                }));
                setFormErrors(prev => ({ ...prev, date: null }));
              } else {
                setFormErrors(prev => ({ ...prev, date: 'วันที่ไม่ถูกต้องหรือเป็นวันที่ผ่านมาแล้ว' }));
              }
            } else {
              setNewSchedule(prev => ({ ...prev, date: dateFormatted }));
              if (dateFormatted.length === 10) {
                setFormErrors(prev => ({ ...prev, date: 'รูปแบบวันที่ไม่ถูกต้อง' }));
              }
            }
          }}
          maxLength={10}
          keyboardType="numeric"
        />
        {formErrors.date && <Text style={styles.errorText}>{formErrors.date}</Text>}
      </View>

      {/* เวลา */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>เวลาฝึกซ้อม (ชช:นน) *</Text>
        <TextInput
          style={[styles.input, formErrors.time && styles.inputError]}
          placeholder="14:30"
          value={newSchedule.time}
          onChangeText={(text) => {
            // อนุญาตให้พิมพ์เฉพาะตัวเลขและ :
            const formatted = text.replace(/[^\d:]/g, '');
            // จัดรูปแบบอัตโนมัติ เช่น 14:30
            let timeFormatted = formatted;
            if (formatted.length >= 2 && !formatted.includes(':')) {
              timeFormatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
            }

            // ตรวจสอบความถูกต้องของเวลา
            if (/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(timeFormatted)) {
              const [hours, minutes] = timeFormatted.split(':').map(Number);
              const time = new Date();
              time.setHours(hours, minutes, 0);
              
              setNewSchedule(prev => ({
                ...prev,
                time: timeFormatted,
                rawTime: time
              }));
              setFormErrors(prev => ({ ...prev, time: null }));
            } else {
              setNewSchedule(prev => ({ ...prev, time: timeFormatted }));
              if (timeFormatted.length === 5) {
                setFormErrors(prev => ({ ...prev, time: 'รูปแบบเวลาไม่ถูกต้อง' }));
              }
            }
          }}
          maxLength={5}
          keyboardType="numeric"
        />
        {formErrors.time && <Text style={styles.errorText}>{formErrors.time}</Text>}
      </View>

      {/* แสดงระยะเวลารวม */}
      {/* ... existing duration display code ... */}
    </View>
  );

  const renderSelectedPlayers = () => (
    <View style={styles.selectedPlayersSection}>
      <Text style={styles.sectionLabel}>ผู้เล่นที่เลือก ({selectedPlayers.length})</Text>
      <ScrollView style={styles.selectedPlayersList}>
        {selectedPlayers.map(player => (
          <View key={player.id} style={styles.selectedPlayerItem}>
            <View style={styles.playerInfoContainer}>
              <MaterialIcons name="person" size={24} color="#1976D2" />
              <View style={styles.playerTextContainer}>
                <Text style={styles.playerFullname}>{player.fullname || player.username}</Text>
                <Text style={styles.playerUsername}>@{player.username || 'ไม่ระบุ'}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => togglePlayerSelection(player)}
              style={styles.removePlayerButton}
            >
              <MaterialIcons name="close" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderModalContent = () => (
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {currentStep === 1 ? 'เพิ่มตารางฝึกซ้อมใหม่' : 'รายละเอียดผู้เข้าร่วม'}
        </Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(false)}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= index + 1 && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepNumber,
                currentStep >= index + 1 && styles.stepNumberActive
              ]}>{index + 1}</Text>
            </View>
            <Text style={styles.stepLabel}>{step.title}</Text>
          </View>
        ))}
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}

      <View style={styles.modalButtons}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={[styles.modalButton, styles.backButton]}
            onPress={() => setCurrentStep(prev => prev - 1)}>
            <MaterialIcons name="arrow-back" size={20} color="white" />
            <Text style={styles.buttonText}>ย้อนกลับ</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < steps.length ? (
          <TouchableOpacity 
            style={[styles.modalButton, styles.nextButton]}
            onPress={() => {
              if (validateForm(currentStep)) {
                setCurrentStep(prev => prev + 1);
              }
            }}>
            <Text style={styles.buttonText}>ถัดไป</Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleAddSchedule}>
            <MaterialIcons name="check" size={20} color="white" />
            <Text style={styles.buttonText}>บันทึก</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  const renderStep1 = () => (
    <View style={styles.formStep}>
      <Text style={styles.stepTitle}>ข้อมูลการฝึกซ้อม</Text>
      
      <TextInput
        style={[styles.input, formErrors.title && styles.inputError]}
        placeholder="ชื่อการฝึกซ้อม *"
        value={newSchedule.title}
        onChangeText={(text) => setNewSchedule({...newSchedule, title: text})}
      />
      {formErrors.title && <Text style={styles.errorText}>{formErrors.title}</Text>}

      {renderDateTimeInputs()}

      <TextInput
        style={[styles.input, formErrors.location && styles.inputError]}
        placeholder="สถานที่ *"
        value={newSchedule.location}
        onChangeText={(text) => setNewSchedule({...newSchedule, location: text})}
      />

      <View style={styles.trainingDetails}>
        <View style={styles.phase}>
          <Text style={styles.phaseLabel}>วอร์มอัพ (นาที)</Text>
          <TextInput
            style={styles.durationInput}
            value={newSchedule.warmup.duration}
            keyboardType="numeric"
            onChangeText={(text) => setNewSchedule({
              ...newSchedule,
              warmup: { ...newSchedule.warmup, duration: text }
            })}
          />
        </View>

        <View style={styles.phase}>
          <Text style={styles.phaseLabel}>ฝึกหลัก (นาที)</Text>
          <TextInput
            style={styles.durationInput}
            value={newSchedule.mainPhase.duration}
            keyboardType="numeric"
            onChangeText={(text) => setNewSchedule({
              ...newSchedule,
              mainPhase: { ...newSchedule.mainPhase, duration: text }
            })}
          />
        </View>

        <View style={styles.phase}>
          <Text style={styles.phaseLabel}>คูลดาวน์ (นาที)</Text>
          <TextInput
            style={styles.durationInput}
            value={newSchedule.cooldown.duration}
            keyboardType="numeric"
            onChangeText={(text) => setNewSchedule({
              ...newSchedule,
              cooldown: { ...newSchedule.cooldown, duration: text }
            })}
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formStep}>
      <Text style={styles.stepTitle}>ผู้เข้าร่วมและรายละเอียด</Text>

      {/* แทนที่ปุ่มเลือกผู้เล่นด้วย TextInput */}
      <View style={styles.participantsContainer}>
        <Text style={styles.sectionLabel}>รายชื่อผู้เข้าร่วม</Text>
        <View style={styles.participantInputContainer}>
          <TextInput
            style={styles.participantInput}
            placeholder="ชื่อ-นามสกุล ผู้เข้าร่วม"
            value={newParticipant}
            onChangeText={setNewParticipant}
          />
          <TouchableOpacity 
            style={styles.addParticipantButton}
            onPress={handleAddParticipant}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* แสดงรายชื่อที่เพิ่มแล้ว */}
      <ScrollView style={styles.participantsList}>
        {participants.map((participant, index) => (
          <View key={`participant-${index}`} style={styles.participantItem}>
            <View style={styles.participantInfo}>
              <MaterialIcons name="person" size={24} color="#1976D2" />
              <Text style={styles.participantName}>{participant.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveParticipant(index)}
              style={styles.removeButton}
            >
              <MaterialIcons name="close" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={[styles.input, formErrors.maxParticipants && styles.inputError]}
        placeholder="จำนวนผู้เข้าร่วมสูงสุด *"
        keyboardType="numeric"
        value={newSchedule.maxParticipants}
        onChangeText={(text) => setNewSchedule({...newSchedule, maxParticipants: text})}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="รายละเอียดเพิ่มเติม"
        multiline
        value={newSchedule.description}
        onChangeText={(text) => setNewSchedule({...newSchedule, description: text})}
      />

      <View style={styles.difficultySelector}>
        <Text style={styles.sectionLabel}>ระดับความยาก</Text>
        <View style={styles.difficultyButtons}>
          {['ระดับเริ่มต้น', 'ระดับกลาง', 'ระดับสูง'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                newSchedule.difficulty === level && styles.difficultyButtonActive
              ]}
              onPress={() => setNewSchedule({...newSchedule, difficulty: level})}
            >
              <Text style={styles.difficultyButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const handleEditSchedule = async (schedule) => {
    setNewSchedule({
      ...schedule,
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime)
    });
    setSelectedPlayers(schedule.players.map(p => ({
      id: p.id,
      fullname: p.name,
      username: p.username
    })));
    setCurrentStep(1);
    setModalVisible(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณแน่ใจหรือไม่ที่จะลบตารางฝึกซ้อมนี้?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {
              await realtimeDb.deleteTraining(scheduleId);
              Alert.alert('สำเร็จ', 'ลบตารางฝึกซ้อมเรียบร้อยแล้ว');
            } catch (error) {
              Alert.alert('Error', 'ไม่สามารถลบตารางฝึกซ้อมได้');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (date, time) => {
    const scheduleDateTime = new Date(`${date} ${time}`);
    const now = new Date();
    
    if (scheduleDateTime < now) {
      return '#757575'; // Past
    } else if (scheduleDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return '#FF9800'; // Within 24 hours
    }
    return '#4CAF50'; // Upcoming
  };

  const getStatusText = (date, time) => {
    const scheduleDateTime = new Date(`${date} ${time}`);
    const now = new Date();
    
    if (scheduleDateTime < now) {
      return 'เสร็จสิ้น';
    } else if (scheduleDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'ใกล้ถึงเวลา';
    }
    return 'กำลังจะมาถึง';
  };

  const renderPlayerSelectModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPlayerSelect}
      onRequestClose={() => setShowPlayerSelect(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>เลือกผู้เข้าร่วม</Text>
            <TouchableOpacity 
              onPress={() => setShowPlayerSelect(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาผู้เล่นโดยชื่อหรืออีเมล..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <FlatList
            data={players.filter(player => 
              player.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
              player.email?.toLowerCase().includes(searchText.toLowerCase()) ||
              player.username?.toLowerCase().includes(searchText.toLowerCase())
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.playerListItem,
                  selectedPlayers.some(p => p.id === item.id) && styles.playerItemSelected
                ]}
                onPress={() => togglePlayerSelection(item)}
              >
                <View style={styles.playerSelectInfo}>
                  <MaterialIcons 
                    name={selectedPlayers.some(p => p.id === item.id) ? 
                      "check-circle" : "radio-button-unchecked"}
                    size={24}
                    color={selectedPlayers.some(p => p.id === item.id) ? 
                      "#4CAF50" : "#666"}
                  />
                  <View style={styles.playerTextInfo}>
                    <Text style={styles.playerNameText}>
                      {item.fullname || item.username}
                    </Text>
                    <Text style={styles.playerEmailText}>{item.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>
                  {searchText ? 'ไม่พบผู้เล่นที่ค้นหา' : 'ไม่มีผู้เล่นในระบบ'}
                </Text>
              </View>
            )}
          />

          <View style={styles.modalFooter}>
            <Text style={styles.selectedCount}>
              เลือกแล้ว {selectedPlayers.length} คน
            </Text>
            <View style={styles.footerButtons}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setShowPlayerSelect(false)}
              >
                <Text style={[styles.footerButtonText, { color: '#666' }]}>
                  ยกเลิก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.confirmButton]}
                onPress={() => setShowPlayerSelect(false)}
              >
                <Text style={styles.footerButtonText}>ยืนยันการเลือก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>จัดการตารางฝึกซ้อม</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>เพิ่มตารางใหม่</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={styles.loader} />
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>

      {renderPlayerSelectModal()}

      <CustomDateTimePicker
        isVisible={show}
        onClose={() => setShow(false)}
        onSelect={onChange}
        mode={mode}
        currentDate={scheduleDate}
        minDate={new Date()}
      />
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  scheduleDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  descriptionBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  descriptionText: {
    color: '#666',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  playerItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  playerInfo: {
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    color: '#333',
  },
  playerEmail: {
    fontSize: 14,
    color: '#666',
  },
  selectedPlayersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  selectedPlayerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 16,
    gap: 4,
  },
  selectedPlayerName: {
    fontSize: 14,
    color: '#1976D2',
  },
  selectPlayersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginVertical: 8,
  },
  selectPlayersText: {
    marginLeft: 8,
    color: '#1976D2',
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 12,
  },
  datePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  programInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  programDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  playersList: {
    maxHeight: 300,
  },
  playersSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scheduleSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  phasesContainer: {
    gap: 16,
  },
  phaseCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  mainPhase: {
    backgroundColor: '#E8F5E8',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  durationInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    height: 80,
    textAlignVertical: 'top',
  },
  difficultySelector: {
    marginTop: 16,
  },
  difficultyLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#1976D2',
  },
  difficultyButtonText: {
    color: '#666',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  additionalInfo: {
    marginTop: 16,
    gap: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#1976D2',
  },
  stepNumber: {
    color: '#666',
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  formStep: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: '#757575',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeContainer: {
    gap: 12,
    marginBottom: 16,
  },
  dateTimeRow: {
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateTimeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  selectedPlayersSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  selectedPlayersList: {
    maxHeight: 200,
  },
  selectedPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  playerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerTextContainer: {
    marginLeft: 12,
  },
  playerFullname: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  playerUsername: {
    fontSize: 14,
    color: '#666',
  },
  removePlayerButton: {
    padding: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trainingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  phase: {
    flex: 1,
    marginHorizontal: 4,
  },
  phaseLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  durationInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  totalDurationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  totalDurationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 16,
  },
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  playerSelectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerTextInfo: {
    marginLeft: 12,
  },
  playerNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  playerEmailText: {
    fontSize: 14,
    color: '#666',
  },
  activeStatus: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveStatus: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveStatusText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
    marginTop: 16,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  participantsContainer: {
    marginBottom: 16,
  },
  participantInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  addParticipantButton: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsList: {
    maxHeight: 200,
    marginTop: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantName: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 4,
  }
});

export default ManageSchedule;
