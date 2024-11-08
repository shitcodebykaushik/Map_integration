import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NearbyScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <ScrollView style={styles.container}>
      {/* Filter Row */}
      <View style={styles.filterRow}>
        {['All', 'Top Rated', 'Open Now'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.selectedFilterText
            ]}>{filter}</Text>
          </TouchableOpacity>
        ))}
        <Icon name="heart-outline" size={24} color="#333" style={styles.favoriteIcon} />
      </View>

      {/* Shop Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ShopCard />
        <ShopCard />
      </ScrollView>

      {/* Restaurants Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Restaurants</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ShopCard />
        <ShopCard />
      </ScrollView>
    </ScrollView>
  );
};

const ShopCard = () => (
  <View style={styles.card}>
    <Image
      source={{ uri: 'https://example.com/fruit-shop.jpg' }}
      style={styles.cardImage}
    />
    <Text style={styles.cardTitle}>Daniasyrofi Fruit Shop</Text>
    <View style={styles.cardInfoRow}>
      <Icon name="star" size={16} color="#FFD700" />
      <Text style={styles.cardInfoText}>4.9 (201)</Text>
      <Text style={styles.cardInfoText}>1.2 Km</Text>
    </View>
    <View style={styles.cardActionsRow}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="navigate-outline" size={18} color="#007AFF" />
        <Text style={styles.actionText}>Direction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="share-outline" size={18} color="#007AFF" />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
  },
  selectedFilterText: {
    color: '#fff',
  },
  favoriteIcon: {
    marginLeft: 'auto',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#007AFF',
  },
  card: {
    width: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cardInfoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 5,
  },
});

export default NearbyScreen;
