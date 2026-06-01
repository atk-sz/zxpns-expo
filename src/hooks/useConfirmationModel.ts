import { useState } from 'react';
import { Animated } from 'react-native';

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: string;
  iconColor?: string;
  confirmButtonColor?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const useConfirmationModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<ConfirmationModalConfig | null>(null);
  const [animation] = useState(new Animated.Value(0));

  const showModal = (modalConfig: ConfirmationModalConfig) => {
    setConfig(modalConfig);
    setIsVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const hideModal = () => {
    setIsVisible(false);
    animation.setValue(0);
    if (config?.onCancel) {
      config.onCancel();
    }
  };

  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    hideModal();
  };

  const handleCancel = () => {
    hideModal();
  };

  return {
    isVisible,
    config,
    animation,
    showModal,
    hideModal,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirmationModal;
