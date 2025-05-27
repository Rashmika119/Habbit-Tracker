import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useThemeStore } from '../Store/themeStore';
import { getTheme } from '../Themes/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface HabitCompletedModelProps {
  visible: boolean;
  onClose: () => void;
  habitType: 'Good' | 'Bad';
  habitName: string;
  isCompleting: boolean; // true when completing, false when uncompleting
}

const HabitCompletedModel: React.FC<HabitCompletedModelProps> = ({
  visible,
  onClose,
  habitType,
  habitName,
  isCompleting,
}) => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const styles = createStyles(theme);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 2.5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getAnimationSource = () => {
    if (habitType === 'Good') {
      return require('../Assets/animations/welldone.json'); // Good habit completed
    } else {
      return require('../Assets/animations/bad.json');  // Bad habit completed (avoided)
    }
  };

  const getMessage = () => {
    if (habitType === 'Good') {
      return 'Great job! 🎉';
    } else {
      return 'Oh! You want to avoided them!🥺';
    }
  };

  const getSubMessage = () => {
    if (habitType === 'Good') {
      return 'Keep up the good work!';
    } else {
      return 'Stay strong!';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          <View style={[
            styles.modal,
            habitType === 'Good' ? styles.goodModal : styles.badModal
          ]}>
            
            {/* Lottie Animation */}
            <View style={styles.animationContainer}>
              <LottieView
                style={styles.animation}
                source={getAnimationSource()}
                autoPlay
                loop={false}
                speed={1.2}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{getMessage()}</Text>
              <Text style={styles.habitName}>{habitName}</Text>
              <Text style={styles.subtitle}>{getSubMessage()}</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: screenWidth * 0.85,
    maxWidth: 350,
  },
  modal: {
    backgroundColor: theme.background.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: theme.shadow.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
  },
  goodModal: {
    borderColor: theme.progress.good,
    backgroundColor: theme.isDarkMode ? '#1F2937' : '#F0FDF4',
  },
  badModal: {
    borderColor: theme.progress.bad,
    backgroundColor: theme.isDarkMode ? '#1F2937' : '#FEF2F2',
  },
  animationContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.isDarkMode ? '#374151' : '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text.secondary,
  },
});

export default HabitCompletedModel;