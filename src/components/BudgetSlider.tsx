import React, { useState, useRef, useCallback } from 'react';
import { 
  Text, 
  styled,
  useTheme
} from '@tamagui/core';
import { XStack, YStack } from '@tamagui/stacks';
import { Card } from '@tamagui/card';

const GlassCard = styled(Card, {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '$xl',
  padding: '$xl',
  margin: '$md',
  width: '100%',
  maxWidth: 600,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 1,
  shadowRadius: 20,
});

const SliderContainer = styled(XStack, {
  position: 'relative',
  height: 60,
  alignItems: 'center',
  paddingHorizontal: '$md',
});

const SliderTrack = styled(XStack, {
  position: 'relative',
  height: 8,
  backgroundColor: '#e2e8f0',
  borderRadius: '$full',
  flex: 1,
  marginHorizontal: '$md',
  border: '1px solid rgba(0, 0, 0, 0.1)',
});

const SliderRange = styled(XStack, {
  position: 'absolute',
  height: '100%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '$full',
  top: 0,
});

const SliderThumb = styled(XStack, {
  position: 'absolute',
  width: 24,
  height: 24,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '$full',
  borderWidth: 3,
  borderColor: 'white',
  top: -8,
  cursor: 'pointer',
  pressStyle: {
    scale: 1.2,
  },
  hoverStyle: {
    scale: 1.1,
  },
  animation: 'smooth',
  shadowColor: 'rgba(102, 126, 234, 0.3)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 8,
});

const ValueDisplay = styled(Text, {
  fontSize: '$3',
  fontWeight: '600',
  color: '#2d3748',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  borderRadius: '$md',
  backdropFilter: 'blur(10px)',
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 4,
});

interface BudgetSliderProps {
  minBudget?: number;
  maxBudget?: number;
  onBudgetChange?: (min: number, max: number) => void;
}

export function BudgetSlider({ 
  minBudget = 0, 
  maxBudget = 1000, 
  onBudgetChange 
}: BudgetSliderProps) {
  const [minValue, setMinValue] = useState(minBudget);
  const [maxValue, setMaxValue] = useState(maxBudget);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleMouseDown = useCallback((type: 'min' | 'max') => {
    setIsDragging(type);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = Math.round(minBudget + percentage * (maxBudget - minBudget));

    if (isDragging === 'min') {
      const newMinValue = Math.min(value, maxValue - 50);
      setMinValue(newMinValue);
      onBudgetChange?.(newMinValue, maxValue);
    } else {
      const newMaxValue = Math.max(value, minValue + 50);
      setMaxValue(newMaxValue);
      onBudgetChange?.(minValue, newMaxValue);
    }
  }, [isDragging, minBudget, maxBudget, minValue, maxValue, onBudgetChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = ((minValue - minBudget) / (maxBudget - minBudget)) * 100;
  const maxPercentage = ((maxValue - minBudget) / (maxBudget - minBudget)) * 100;

  return (
    <GlassCard>
      <YStack space="$md" alignItems="center">
        <Text 
          fontSize="$5" 
          fontWeight="600" 
          color="$purple11"
          fontFamily="Baloo 2, cursive"
        >
          Budget Range
        </Text>
        
        <XStack space="$lg" alignItems="center" width="100%">
          <ValueDisplay>
            ${minValue}
          </ValueDisplay>
          
          <SliderContainer ref={sliderRef}>
            <SliderTrack>
              <SliderRange
                style={{
                  left: `${minPercentage}%`,
                  width: `${maxPercentage - minPercentage}%`,
                }}
              />
              <SliderThumb
                style={{ left: `${minPercentage}%` }}
                onMouseDown={() => handleMouseDown('min')}
              />
              <SliderThumb
                style={{ left: `${maxPercentage}%` }}
                onMouseDown={() => handleMouseDown('max')}
              />
            </SliderTrack>
          </SliderContainer>
          
          <ValueDisplay>
            ${maxValue}
          </ValueDisplay>
        </XStack>
        
        <Text 
          fontSize="$2" 
          color="$purple10"
          textAlign="center"
          opacity={0.8}
        >
          Drag the handles to adjust your budget range
        </Text>
      </YStack>
    </GlassCard>
  );
}
