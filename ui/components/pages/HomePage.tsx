import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MainTemplate } from '../templates/MainTemplate';
import { Card } from '../molecules/Card';
import { Button } from '../atoms/Button';

interface HomePageProps {
  onProductPress: (id: string) => void;
  onProfilePress: () => void;
  username: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onProductPress,
  onProfilePress,
  username,
}) => {
  const featuredProducts = [
    {
      id: '1',
      title: 'Premium Paint Set',
      description: 'High-quality paints for professional artists',
      price: '$49.99',
    },
    {
      id: '2',
      title: 'Artist Brushes',
      description: 'Set of 10 professional paint brushes',
      price: '$29.99',
    },
  ];

  return (
    <MainTemplate
      title={`Welcome, ${username}`}
      rightAction={{
        onPress: onProfilePress,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Button
          title="View All"
          variant="outline"
          size="sm"
          onPress={() => {}}
        />
      </View>

      <View style={styles.productsGrid}>
        {featuredProducts.map((product) => (
          <Card
            key={product.id}
            title={product.title}
            description={`${product.description} • ${product.price}`}
            buttonText="View Details"
            onPress={() => onProductPress(product.id)}
          />
        ))}
      </View>

      <View style={styles.ctaContainer}>
        <Text style={styles.ctaText}>Ready to start your next project?</Text>
        <Button
          title="Browse All Products"
          onPress={() => {}}
          style={styles.ctaButton}
        />
      </View>
    </MainTemplate>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  productsGrid: {
    marginBottom: 24,
  },
  ctaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  ctaText: {
    fontSize: 16,
    color: '#636366',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaButton: {
    width: '100%',
  },
});
