import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const TrainingHistoryScreen = () => {
  const { trainingHistory, totalScore } = useAuth();

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.programName}>{item.programName}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('th-TH')}
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <MaterialIcons name="stars" size={24} color="#FFD700" />
        <Text style={styles.score}>คะแนน: {item.score}</Text>
      </View>
      <Text style={styles.duration}>ระยะเวลา: {item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.totalScoreCard}>
        <Text style={styles.totalScoreTitle}>คะแนนรวมทั้งหมด</Text>
        <Text style={styles.totalScoreValue}>{totalScore}</Text>
      </View>
      
      <FlatList
        data={trainingHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  totalScoreCard: {
    backgroundColor: '#304FFE',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  totalScoreTitle: {
    color: '#fff',
    fontSize: 18,
  },
  totalScoreValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#304FFE',
  },
  date: {
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  score: {
    fontSize: 16,
    marginLeft: 5,
    color: '#333',
  },
  duration: {
    color: '#666',
  },
});

export default TrainingHistoryScreen;
