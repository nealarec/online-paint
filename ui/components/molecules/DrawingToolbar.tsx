import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Button } from '../atoms/Button';
import { useDrawingStore } from '../../store/useDrawingStore';

const COLORS = [
  '#000000', // black
  '#FF3B30', // red
  '#34C759', // green
  '#007AFF', // blue
  '#FF9500', // orange
  '#FFCC00', // yellow
  '#AF52DE', // purple
  '#FFFFFF', // white (eraser)
];

const TOOLS = [
  { id: 'pencil', label: 'Pencil' },
  { id: 'brush', label: 'Brush' },
  { id: 'eraser', label: 'Eraser' },
];

export const DrawingToolbar: React.FC = () => {
  const { color, weight, tool, setColor, setWeight, setTool, clearCanvas } = useDrawingStore();

  return (
    <View style={styles.container}>
      <View style={styles.toolSection}>
        <Text style={styles.sectionTitle}>Tools</Text>
        <View style={styles.toolsRow}>
          {TOOLS.map(({ id, label }) => (
            <Button
              key={id}
              title={label}
              variant={tool === id ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setTool(id as any)}
              style={styles.toolButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.toolSection}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorsRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorButton,
                { backgroundColor: c },
                color === c && styles.selectedColor,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
      </View>

      <View style={styles.toolSection}>
        <Text style={styles.sectionTitle}>Size: {weight}px</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sizeLabel}>1</Text>
          <View style={styles.slider}>
            <View 
              style={[
                styles.sliderTrack,
                { width: `${((weight - 1) / 19) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.sizeLabel}>20</Text>
        </View>
      </View>

      <Button
        title="Clear Canvas"
        variant="outline"
        size="sm"
        onPress={clearCanvas}
        style={styles.clearButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  toolSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  toolButton: {
    margin: 4,
    flex: 1,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#007AFF',
    transform: [{ scale: 1.1 }],
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  sliderTrack: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  sizeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    width: 20,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 8,
  },
});
