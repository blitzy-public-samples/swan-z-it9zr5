import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Card } from 'src/mobile/components/molecules/Card';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useTheme, useAuth } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { CustomDesign } from 'src/shared/types/index';
import { formatDate } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

export const SavedDesignsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const api = useApi();

  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedDesigns();
  }, []);

  const fetchSavedDesigns = async () => {
    try {
      setLoading(true);
      const designs = await api.get<CustomDesign[]>('/designs/user');
      setSavedDesigns(designs);
    } catch (error) {
      console.error('Error fetching saved designs:', error);
      // TODO: Implement error handling
    } finally {
      setLoading(false);
    }
  };

  const renderDesignItem = ({ item }: { item: CustomDesign }) => (
    <Card style={styles.designItem}>
      <Image source={{ uri: item.previewImage }} style={styles.designThumbnail} />
      <View style={styles.designInfo}>
        <Text style={styles.designName}>{item.name}</Text>
        <Text style={styles.designDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          onPress={() => handleEditDesign(item)}
          variant="outline"
          size="small"
        />
        <Button
          title="Delete"
          onPress={() => handleDeleteDesign(item.id)}
          variant="outline"
          size="small"
        />
      </View>
    </Card>
  );

  const handleEditDesign = (design: CustomDesign) => {
    navigation.navigate('DesignCustomization', { design });
  };

  const handleDeleteDesign = async (designId: string) => {
    // TODO: Implement confirmation dialog
    try {
      await api.delete(`/designs/${designId}`);
      setSavedDesigns(savedDesigns.filter(design => design.id !== designId));
      // TODO: Show success message
    } catch (error) {
      console.error('Error deleting design:', error);
      // TODO: Implement error handling
    }
  };

  const handleCreateNewDesign = () => {
    navigation.navigate('DesignCustomization');
  };

  return (
    <View style={styles.container}>
      <Header title="Saved Designs" />
      <View style={styles.content}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <FlatList
              data={savedDesigns}
              renderItem={renderDesignItem}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text>No saved designs yet.</Text>}
            />
            <Button
              title="Create New Design"
              onPress={handleCreateNewDesign}
              style={styles.createNewButton}
            />
          </>
        )}
      </View>
      <Footer activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  designItem: {
    marginBottom: 10,
  },
  designThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  designInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  designName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  designDate: {
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createNewButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});