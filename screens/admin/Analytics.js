import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const samplePlayers = [
  {
    id: '1',
    fullName: 'สมชาย ใจดี',
    position: 'กองหน้า',
    rating: 8.5,
    physicalStats: {
      stamina: 85,
      strength: 75,
      agility: 90,
      speed: 88
    },
    technicalStats: {
      shooting: 90,
      passing: 80,
      dribbling: 85,
      tackling: 65
    },
    gameStats: {
      goalsScored: 12,
      assists: 8,
      matchesPlayed: 15,
      minutesPlayed: 1200
    },
    trainingProgress: {
      attendance: 95,
      improvement: 15,
      participation: 90
    },
    improvements: ['ควรฝึกการส่งบอลให้แม่นยำมากขึ้น', 'เพิ่มความแข็งแรงของร่างกาย']
  },
  {
    id: '2',
    fullName: 'สมหญิง สู้ชีวิต',
    position: 'กองกลาง',
    rating: 7.8,
    physicalStats: {
      stamina: 80,
      strength: 70,
      agility: 85,
      speed: 75
    },
    technicalStats: {
      shooting: 70,
      passing: 90,
      dribbling: 80,
      tackling: 60
    },
    gameStats: {
      goalsScored: 5,
      assists: 10,
      matchesPlayed: 15,
      minutesPlayed: 1100
    },
    trainingProgress: {
      attendance: 90,
      improvement: 10,
      participation: 85
    },
    improvements: ['ปรับปรุงการยิงให้มีประสิทธิภาพ', 'เพิ่มความคล่องตัว']
  },
  {
    id: '3',
    fullName: 'สมปอง รักดี',
    position: 'กองหลัง',
    rating: 8.0,
    physicalStats: {
      stamina: 82,
      strength: 78,
      agility: 80,
      speed: 80
    },
    technicalStats: {
      shooting: 60,
      passing: 85,
      dribbling: 70,
      tackling: 90
    },
    gameStats: {
      goalsScored: 2,
      assists: 5,
      matchesPlayed: 15,
      minutesPlayed: 1150
    },
    trainingProgress: {
      attendance: 92,
      improvement: 12,
      participation: 88
    },
    improvements: ['เพิ่มความเร็วในการป้องกัน', 'ฝึกการส่งบอลให้แม่นยำ']
  },
];

const StatCategory = ({ title, stats }) => (
  <View style={styles.categoryContainer}>
    <Text style={styles.categoryTitle}>{title}</Text>
    {Object.entries(stats).map(([key, value]) => (
      <StatBar 
        key={key} 
        label={key} 
        value={value} 
        color={getCategoryColor(title)}
      />
    ))}
  </View>
);

const StatBar = ({ label, value, color = '#007AFF' }) => (
  <View style={styles.statBar}>
    <Text style={styles.statLabel}>{formatLabel(label)}</Text>
    <View style={styles.barContainer}>
      <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
    <Text style={styles.statValue}>{typeof value === 'number' ? `${value}%` : value}</Text>
  </View>
);

const getCategoryColor = (category) => {
  switch(category) {
    case 'สถิติร่างกาย': return '#4CAF50';
    case 'สถิติเทคนิค': return '#2196F3';
    case 'สถิติการแข่งขัน': return '#FF9800';
    case 'การฝึกซ้อม': return '#9C27B0';
    default: return '#007AFF';
  }
};

const formatLabel = (label) => {
  const labels = {
    stamina: 'ความอึด',
    strength: 'ความแข็งแรง',
    agility: 'ความคล่องแคล่ว',
    speed: 'ความเร็ว',
    shooting: 'การยิง',
    passing: 'การส่งบอล',
    dribbling: 'การเลี้ยงบอล',
    tackling: 'การสกัด',
    attendance: 'การเข้าซ้อม',
    improvement: 'การพัฒนา',
    participation: 'การมีส่วนร่วม',
    goalsScored: 'ประตูที่ทำได้',
    assists: 'แอสซิสต์',
    matchesPlayed: 'จำนวนแมตช์',
    minutesPlayed: 'เวลาที่เล่น'
  };
  return labels[label] || label;
};

const PlayerCard = ({ player }) => (
  <TouchableOpacity style={styles.playerCard}>
    <View style={styles.playerHeader}>
      <View>
        <Text style={styles.playerName}>{player.fullName}</Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{player.rating}</Text>
        <Text style={styles.ratingLabel}>คะแนนรวม</Text>
      </View>
    </View>

    <StatCategory title="สถิติร่างกาย" stats={player.physicalStats} />
    <StatCategory title="สถิติเทคนิค" stats={player.technicalStats} />
    <StatCategory title="การฝึกซ้อม" stats={player.trainingProgress} />

    <View style={styles.gameStatsContainer}>
      <Text style={styles.categoryTitle}>สถิติการแข่งขัน</Text>
      <View style={styles.gameStatsGrid}>
        {Object.entries(player.gameStats).map(([key, value]) => (
          <View key={key} style={styles.gameStatItem}>
            <Text style={styles.gameStatValue}>{value}</Text>
            <Text style={styles.gameStatLabel}>{formatLabel(key)}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const Analytics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>วิเคราะห์ข้อมูล</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ผลการวิเคราะห์นักเตะ</Text>
          {samplePlayers.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerPosition: {
    color: '#666',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ratingLabel: {
    color: '#666',
  },
  categoryContainer: {
    marginVertical: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statsContainer: {
    gap: 8,
  },
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    width: 80,
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  gameStatsContainer: {
    marginTop: 12,
  },
  gameStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  gameStatItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  gameStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  gameStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  improvementSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF9800',
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  improvementText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});

export default Analytics;
