import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Button } from '../atoms/Button';

interface CardProps {
  title: string;
  description: string;
  image?: ImageSourcePropType;
  buttonText?: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  buttonText = 'Learn More',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {onPress && (
          <Button
            title={buttonText}
            onPress={onPress}
            variant="outline"
            size="sm"
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1C1C1E',
  },
  description: {
    fontSize: 14,
    color: '#636366',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
