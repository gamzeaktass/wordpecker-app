import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const openaiApiKey = 'YOUR_OPENAI_API_KEY'; // OpenAI API anahtarınız

export default function AddWordModal({ visible, onClose }) {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedWords, setSuggestedWords] = useState([]);

  const getSimilarWords = async (inputWord) => {
    if (!inputWord) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003', // Veya başka bir model seçebilirsiniz
          prompt: `Provide a list of synonyms, antonyms, and related words for the word: ${inputWord}. Format the response as JSON, with each item having the fields "word", "type" (synonym/antonym/related), "definition", and "example".`,
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].text) {
        // Cevabı işleyin ve uygun formatta kelimeleri alın
        const parsedWords = data.choices[0].text
          .split('\n')
          .filter(Boolean)
          .map(word => ({
            word: word.trim(),
            type: 'synonym', // Burada daha detaylı işleyebilirsiniz
            definition: '',
            example: ''
          }));
        setSuggestedWords(parsedWords);
      }
    } catch (error) {
      toast.error('Failed to get similar words');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!listName || !description || !context || !word) {
      toast.error('Please fill all fields');
      return;
    }

    toast.success('Word nest created successfully!');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Nest</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>List Name</Text>
            <TextInput
              style={styles.input}
              value={listName}
              onChangeText={setListName}
              placeholder="e.g., Harry Potter Book 1"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of this word list"
            />

            <Text style={styles.label}>Context</Text>
            <TextInput
              style={styles.input}
              value={context}
              onChangeText={setContext}
              placeholder="Book, Article, Video, etc."
            />

            <Text style={styles.label}>First Word</Text>
            <TextInput
              style={styles.input}
              value={word}
              onChangeText={(text) => {
                setWord(text);
                if (text.length > 2) {
                  getSimilarWords(text);
                }
              }}
              placeholder="Add your first word"
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#4A90E2" />
                <Text style={styles.loadingText}>Finding similar words...</Text>
              </View>
            )}

            {suggestedWords.length > 0 && (
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedTitle}>Similar Words:</Text>
                {suggestedWords.map((suggestion, index) => (
                  <View key={index} style={styles.suggestedWord}>
                    <Text style={styles.suggestedWordText}>
                      {suggestion.word} - {suggestion.type}
                    </Text>
                    {suggestion.definition && (
                      <Text style={styles.definitionText}>{suggestion.definition}</Text>
                    )}
                    {suggestion.example && (
                      <Text style={styles.exampleText}>Ex: {suggestion.example}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>Create Nest</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#2A2A2A',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
  suggestedContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 10,
  },
  suggestedWord: {
    backgroundColor: '#E8F0FE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestedWordText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
