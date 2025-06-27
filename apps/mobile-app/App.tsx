import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mumicah Mobile</Text>
        <Text style={styles.subtitle}>Your conversations, mentoring, and content - all in one place</Text>
        
        <View style={styles.appGrid}>
          <View style={styles.appCard}>
            <Text style={styles.appIcon}>💬</Text>
            <Text style={styles.appName}>Conversate</Text>
            <Text style={styles.appDesc}>Smart conversations</Text>
          </View>
          
          <View style={styles.appCard}>
            <Text style={styles.appIcon}>👨‍💻</Text>
            <Text style={styles.appName}>DevMentor</Text>
            <Text style={styles.appDesc}>Learn & grow</Text>
          </View>
          
          <View style={styles.appCard}>
            <Text style={styles.appIcon}>✍️</Text>
            <Text style={styles.appName}>ContentFlow</Text>
            <Text style={styles.appDesc}>Create content</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  appCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  appIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  appDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
