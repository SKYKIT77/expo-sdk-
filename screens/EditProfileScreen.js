import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const EditProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [position, setPosition] = useState(userProfile?.position || '');
  const [skillLevel, setSkillLevel] = useState(userProfile?.skillLevel || 'Beginner');
  const [profileImage, setProfileImage] = useState(userProfile?.profileImage || null);
  const [email, setEmail] = useState('john@example.com');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleSave = async () => {
    await updateProfile({
      name,
      position,
      skillLevel,
      profileImage,
      email,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : 
              { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wN/m5H+VwAAAABJRU5ErkJggg==' }}
            style={styles.profileImage}
          />
          <View style={styles.editImageButton}>
            <MaterialIcons name="camera-alt" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Position</Text>
          <TextInput
            style={styles.input}
            value={position}
            onChangeText={setPosition}
            placeholder="Enter your position"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skill Level</Text>
          <View style={styles.skillLevelContainer}>
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.skillButton,
                  skillLevel === level && styles.skillButtonActive
                ]}
                onPress={() => setSkillLevel(level)}
              >
                <Text style={[
                  styles.skillButtonText,
                  skillLevel === level && styles.skillButtonTextActive
                ]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#304FFE',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#304FFE',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  skillLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillButton: {
    flex: 1,
    padding: 10,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#304FFE',
    alignItems: 'center',
  },
  skillButtonActive: {
    backgroundColor: '#304FFE',
  },
  skillButtonText: {
    color: '#304FFE',
  },
  skillButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#304FFE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
