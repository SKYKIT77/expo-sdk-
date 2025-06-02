import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, Alert, Modal, TextInput
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const TrainingDetailScreen = ({ route, navigation }) => {
  const { addTrainingResult } = useAuth();
  const { program } = route.params || {};
  // Add default values if program is undefined
  const defaultProgram = {
    title: 'การฝึกซ้อม',
    level: 'ทั่วไป',
    duration: '0 นาที',
    exercises: []
  };

  const currentProgram = program || defaultProgram;

  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [customTime, setCustomTime] = useState({
    hours: '0',
    minutes: '0',
    seconds: '0'
  });
  const [showScoring, setShowScoring] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [performance, setPerformance] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const getSpecializedTrainingSteps = () => {
    if (!currentProgram.exercises || !Array.isArray(currentProgram.exercises)) {
      return [];
    }
    return currentProgram.exercises.map((exercise, index) => ({
      ...exercise,
      id: index + 1,
      status: completedSteps.includes(index) ? 'completed' : 
              index === currentExerciseIndex ? 'current' : 'pending'
    }));
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      Alert.alert('เสร็จสิ้น!', 'การฝึกซ้อมเสร็จสมบูรณ์');
      setShowScoring(true); // Show scoring modal when timer ends
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const startTraining = () => {
    // Convert duration string to seconds (assuming format "XX นาที")
    const minutes = parseInt(currentProgram.duration);
    setTimeLeft(minutes * 60);
    setIsTraining(true);
    setTimerActive(true);
  };

  const startCustomTimer = () => {
    const totalSeconds = 
      (parseInt(customTime.hours || '0') * 3600) +
      (parseInt(customTime.minutes || '0') * 60) +
      parseInt(customTime.seconds || '0');

    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsTraining(true);
      setTimerActive(true);
      setShowTimerModal(false);
    } else {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุเวลาให้ถูกต้อง');
    }
  };

  const handleScore = (score, type) => {
    setFinalScore(prev => prev + score);
    setPerformance(prev => [...prev, { type, score, time: new Date() }]);
  };

  const goToNextTraining = () => {
    // Get next training from the available programs
    const currentProgramId = currentProgram.id;
    const availablePrograms = route.params.allPrograms || [];
    const nextProgram = availablePrograms.find(p => p.id === currentProgramId + 1);

    if (nextProgram) {
      Alert.alert(
        'ฝึกท่าต่อไป',
        `ต้องการฝึก ${nextProgram.title} ต่อหรือไม่?`,
        [
          {
            text: 'ฝึกต่อ',
            onPress: () => {
              navigation.replace('TrainingDetail', {
                program: nextProgram,
                allPrograms: availablePrograms
              });
            }
          },
          {
            text: 'พักก่อน',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) // Changed from 'MainApp'
          }
        ]
      );
    } else {
      Alert.alert(
        'เสร็จสิ้นการฝึกทั้งหมด',
        'คุณได้ฝึกครบทุกท่าแล้ว!',
        [
          {
            text: 'ดูผลการฝึก',
            onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) // Changed from 'History'
          },
          {
            text: 'กลับหน้าหลัก',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) // Changed from 'MainApp'
          }
        ]
      );
    }
  };

  const finishTraining = () => {
    const trainingResult = {
      programId: currentProgram.id,
      programName: currentProgram.title,
      score: finalScore,
      performance: performance,
      completedSteps: completedSteps,
      duration: currentProgram.duration
    };

    addTrainingResult(trainingResult);

    Alert.alert(
      'การฝึกซ้อมเสร็จสิ้น',
      `คะแนนรวม: ${finalScore} คะแนน\nจำนวนการทำซ้ำ: ${performance.length} ครั้ง`,
      [
        {
          text: 'ฝึกท่าต่อไป',
          onPress: goToNextTraining
        },
        {
          text: 'เสร็จสิ้น',
          onPress: () => {
            setShowScoring(false);
            setIsTraining(false);
            navigation.navigate('MainTabs', { screen: 'Home' }) // Changed from 'MainApp'
          }
        }
      ]
    );
  };

  const finishCurrentExercise = () => {
    const isLastExercise = currentExerciseIndex === currentProgram.exercises.length - 1;
    
    if (isLastExercise) {
      Alert.alert(
        'การฝึกซ้อมเสร็จสมบูรณ์',
        `คะแนนรวม: ${finalScore}\nคุณได้ฝึกครบทุกท่าแล้ว!`,
        [
          {
            text: 'กลับสู่หน้าหลัก',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) // Changed from 'MainApp'
          },
          {
            text: 'ดูผลการฝึก',
            onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) // Changed from 'History'
          }
        ]
      );
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
      setCompletedSteps([...completedSteps, currentExerciseIndex]);
      setShowScoring(false);
      Alert.alert(
        'เสร็จสิ้นท่าที่ ' + (currentExerciseIndex + 1),
        'ต้องการเริ่มท่าต่อไปหรือไม่?',
        [
          {
            text: 'ใช่',
            onPress: () => {
              setTimeLeft(parseInt(currentProgram.exercises[currentExerciseIndex + 1].duration) * 60);
              setTimerActive(true);
            }
          },
          {
            text: 'พักก่อน',
            onPress: () => setIsTraining(false)
          }
        ]
      );
    }
  };

  const handleCloseScoring = () => {
    setShowScoring(false);
    // บันทึกคะแนนก่อนปิด
    const trainingResult = {
      programId: currentProgram.id,
      programName: currentProgram.title,
      score: finalScore,
      performance: performance,
      completedSteps: completedSteps,
      duration: currentProgram.duration
    };
    addTrainingResult(trainingResult);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Stadium Header */}
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.headerGradient}
      >
        <View style={styles.stadiumOverlay}>
          <View style={styles.fieldLines}>
            <View style={styles.centerCircle} />
            <View style={styles.centerLine} />
            <View style={styles.penaltyBoxLeft} />
            <View style={styles.penaltyBoxRight} />
            <View style={styles.goalLines} />
          </View>
          
          <Text style={styles.headerTitle}>{currentProgram.title}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerSubtitle}>{currentProgram.level}</Text>
            <Text style={styles.headerDuration}>{currentProgram.duration}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.trainingProgress}>
        <Text style={styles.progressText}>
          ท่าที่ {currentExerciseIndex + 1} จาก {currentProgram.exercises?.length || 0}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentExerciseIndex + 1) / 
                  (currentProgram.exercises?.length || 1)) * 100}%` 
              }
            ]} 
          />
        </View>
      </View>

      {currentProgram.exercises?.length > 0 && (
        <View style={styles.currentExercise}>
          <Text style={styles.exerciseTitle}>
            {currentProgram.exercises[currentExerciseIndex]?.name || 'เริ่มการฝึก'}
          </Text>
          <MaterialIcons 
            name={currentProgram.exercises[currentExerciseIndex]?.icon || 'sports-soccer'} 
            size={60} 
            color="#304FFE" 
          />
        </View>
      )}

      {/* Training Steps */}
      <View style={styles.trainingStepsContainer}>
        <Text style={styles.sectionTitle}>ขั้นตอนการฝึก</Text>
        {getSpecializedTrainingSteps().map((step, index) => (
          <TouchableOpacity 
            key={step.id}
            style={[
              styles.stepCard,
              step.status === 'completed' && styles.completedStep,
              step.status === 'current' && styles.activeStep
            ]}
            onPress={() => setCurrentExerciseIndex(index)}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepTitleContainer}>
                <FontAwesome5 name={step.icon} size={24} color="#304FFE" />
                <Text style={styles.stepTitle}>{step.name}</Text>
                {step.status === 'completed' && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </View>
              <View style={styles.durationBadge}>
                <MaterialIcons name="timer" size={16} color="#666" />
                <Text style={styles.stepDuration}>{step.duration}</Text>
              </View>
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Section */}
      {!isTraining && (
        <View style={styles.timerOptionsContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => setShowTimerModal(true)}
          >
            <MaterialIcons name="timer" size={40} color="white" />
            <Text style={styles.buttonText}>ตั้งเวลาฝึกซ้อม</Text>
          </TouchableOpacity>
        </View>
      )}

      {isTraining && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {Math.floor(timeLeft/3600).toString().padStart(2, '0')}:
            {Math.floor((timeLeft%3600)/60).toString().padStart(2, '0')}:
            {(timeLeft%60).toString().padStart(2, '0')}
          </Text>
          <TouchableOpacity 
            style={styles.stopButton}
            onPress={() => {
              setIsTraining(false);
              setTimerActive(false);
            }}
          >
            <MaterialIcons name="stop-circle" size={40} color="white" />
            <Text style={styles.buttonText}>หยุด</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ตั้งเวลาฝึกซ้อม</Text>
            
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeInputField}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customTime.hours}
                  onChangeText={text => setCustomTime({...customTime, hours: text})}
                  placeholder="00"
                />
                <Text style={styles.timeLabel}>ชั่วโมง</Text>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeInputField}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customTime.minutes}
                  onChangeText={text => setCustomTime({...customTime, minutes: text})}
                  placeholder="00"
                />
                <Text style={styles.timeLabel}>นาที</Text>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeInputField}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customTime.seconds}
                  onChangeText={text => setCustomTime({...customTime, seconds: text})}
                  placeholder="00"
                />
                <Text style={styles.timeLabel}>วินาที</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTimerModal(false)}
              >
                <Text style={styles.modalButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={startCustomTimer}
              >
                <Text style={styles.modalButtonText}>เริ่มฝึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Scoring Modal */}
      <Modal
        visible={showScoring}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scoringContent}>
            <View style={styles.scoringHeader}>
              <Text style={styles.scoringTitle}>ให้คะแนนการฝึกซ้อม</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseScoring}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.currentScore}>คะแนนรวม: {finalScore}</Text>

            <View style={styles.scoreButtonsContainer}>
              <TouchableOpacity 
                style={[styles.scoreButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => handleScore(5, 'ยอดเยี่ยม')}
              >
                <MaterialIcons name="star" size={32} color="white" />
                <Text style={styles.scoreButtonText}>ยอดเยี่ยม (+5)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.scoreButton, { backgroundColor: '#2196F3' }]}
                onPress={() => handleScore(3, 'ดี')}
              >
                <MaterialIcons name="thumb-up" size={32} color="white" />
                <Text style={styles.scoreButtonText}>ดี (+3)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.scoreButton, { backgroundColor: '#FFC107' }]}
                onPress={() => handleScore(1, 'พอใช้')}
              >
                <MaterialIcons name="check" size={32} color="white" />
                <Text style={styles.scoreButtonText}>พอใช้ (+1)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.scoreButton, { backgroundColor: '#F44336' }]}
                onPress={() => handleScore(-1, 'พลาด')}
              >
                <MaterialIcons name="close" size={32} color="white" />
                <Text style={styles.scoreButtonText}>พลาด (-1)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.finishButton}
              onPress={finishCurrentExercise}
            >
              <Text style={styles.finishButtonText}>
                {currentExerciseIndex === currentProgram.exercises.length - 1 
                  ? 'จบการฝึกทั้งหมด' 
                  : 'ไปท่าต่อไป'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    height: 200,
    position: 'relative',
  },
  stadiumOverlay: {
    flex: 1,
    padding: 20,
  },
  fieldLines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
  },
  penaltyBoxLeft: {
    width: '30%',
    height: 80,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -40,
  },
  penaltyBoxRight: {
    width: '30%',
    height: 80,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -40,
  },
  goalLines: {
    width: '15%',
    height: 40,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  headerDuration: {
    fontSize: 16,
    color: '#fff',
  },
  trainingProgress: {
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -30,
    borderRadius: 10,
    elevation: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#304FFE',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#304FFE',
    borderRadius: 3,
  },
  currentExercise: {
    alignItems: 'center',
    padding: 20,
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#304FFE',
    marginBottom: 15,
  },
  trainingStepsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  stepCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#304FFE',
  },
  activeStep: {
    backgroundColor: '#e3f2fd',
    transform: [{ scale: 1.02 }],
  },
  completedStep: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#304FFE',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  stepDuration: {
    color: '#666',
    fontSize: 14,
  },
  stepDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 20,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#304FFE',
    marginBottom: 20,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#304FFE',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#304FFE',
    marginBottom: 20,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  timeInput: {
    alignItems: 'center',
  },
  timeInputField: {
    borderWidth: 2,
    borderColor: '#304FFE',
    borderRadius: 10,
    width: 70,
    height: 60,
    fontSize: 24,
    textAlign: 'center',
  },
  timeLabel: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  timeSeparator: {
    fontSize: 30,
    marginHorizontal: 10,
    color: '#304FFE',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  confirmButton: {
    backgroundColor: '#304FFE',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoringContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  scoringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  scoringTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#304FFE',
    marginBottom: 15,
  },
  currentScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreButtonsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  scoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  scoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  finishButton: {
    backgroundColor: '#304FFE',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default TrainingDetailScreen;
