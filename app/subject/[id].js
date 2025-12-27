// app/subject/[id].js
import React from 'react';
import { View, Text } from 'react-native';
import { useSearchParams } from 'expo-router';

export default function SubjectChat() {
  const params = useSearchParams();
  const { id } = params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Subject chat: {id}</Text>
    </View>
  );
}
