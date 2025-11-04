import React, { useState } from 'react';
import { 
  Text, 
  styled,
  useTheme
} from '@tamagui/core';
import { XStack, YStack } from '@tamagui/stacks';
import { Card } from '@tamagui/card';
import { ImprovedGiftCarousel } from './ImprovedGiftCarousel';
import { BudgetSlider } from './BudgetSlider';

const PageContainer = styled(YStack, {
  minHeight: '100vh',
  padding: '$xl',
  space: '$xl',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    zIndex: 0,
  },
});

const HeaderCard = styled(Card, {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '$xl',
  padding: '$xl',
  marginBottom: '$lg',
  width: '100%',
  maxWidth: 800,
  shadowColor: 'rgba(0, 0, 0, 0.15)',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 1,
  shadowRadius: 40,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
});

const ContentCard = styled(Card, {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '$xl',
  padding: '$xl',
  width: '100%',
  maxWidth: 1200,
  marginBottom: '$lg',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 15 },
  shadowOpacity: 1,
  shadowRadius: 30,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
});

const GradientText = styled(Text, {
  fontSize: '$8',
  fontWeight: '700',
  textAlign: 'center',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  marginBottom: '$md',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const SubtitleText = styled(Text, {
  fontSize: '$4',
  color: '#4a5568',
  textAlign: 'center',
  lineHeight: '$4',
  fontWeight: '400',
});

export function GiftResultsScreen() {
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 1000 });
  const theme = useTheme();

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetRange({ min, max });
  };

  // Sample product categories with different themes
  const giftCategories = [
    {
      title: "Gifts for Fishing",
      products: [
        {
          id: '1',
          title: 'Professional Fishing Rod',
          price: '$89.99',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
        },
        {
          id: '2',
          title: 'Tackle Box Set',
          price: '$45.50',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
        },
        {
          id: '3',
          title: 'Fishing Lures Pack',
          price: '$24.99',
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
        },
        {
          id: '4',
          title: 'Waterproof Fishing Jacket',
          price: '$129.99',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop'
        },
        {
          id: '5',
          title: 'Fishing Net',
          price: '$35.00',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
        },
        {
          id: '6',
          title: 'Fishing Hat & Sunglasses',
          price: '$55.99',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
        }
      ]
    },
    {
      title: "Gifts for Cooking",
      products: [
        {
          id: '7',
          title: 'Professional Chef Knife Set',
          price: '$149.99',
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop'
        },
        {
          id: '8',
          title: 'Cast Iron Skillet',
          price: '$79.99',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
        },
        {
          id: '9',
          title: 'Spice Collection',
          price: '$39.99',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'
        },
        {
          id: '10',
          title: 'Kitchen Scale',
          price: '$29.99',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
        },
        {
          id: '11',
          title: 'Apron & Oven Mitts',
          price: '$24.99',
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop'
        }
      ]
    },
    {
      title: "Gifts for Photography",
      products: [
        {
          id: '12',
          title: 'Camera Lens Kit',
          price: '$299.99',
          image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
        },
        {
          id: '13',
          title: 'Tripod Stand',
          price: '$89.99',
          image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
        },
        {
          id: '14',
          title: 'Camera Bag',
          price: '$59.99',
          image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
        },
        {
          id: '15',
          title: 'Memory Card Set',
          price: '$34.99',
          image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
        },
        {
          id: '16',
          title: 'Photo Editing Software',
          price: '$199.99',
          image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop'
        }
      ]
    }
  ];

  return (
    <PageContainer>
      <HeaderCard>
        <YStack space="$md" alignItems="center">
          <GradientText>
            Perfect Gift Recommendations
          </GradientText>
          <SubtitleText>
            Discover thoughtfully curated gifts tailored to your budget and style
          </SubtitleText>
        </YStack>
      </HeaderCard>

      <ContentCard>
        <YStack space="$lg" alignItems="center">
          <Text fontSize="$5" fontWeight="600" color="#2d3748" fontFamily="system-ui, -apple-system, sans-serif">
            Set Your Budget Range
          </Text>
          <BudgetSlider
            minBudget={0}
            maxBudget={1000}
            onBudgetChange={handleBudgetChange}
          />
        </YStack>
      </ContentCard>

      <YStack space="$xl" width="100%" maxWidth={1200}>
        {giftCategories.map((category, index) => (
          <ContentCard key={index}>
            <YStack space="$lg">
              <Text fontSize="$6" fontWeight="600" color="#2d3748" fontFamily="system-ui, -apple-system, sans-serif" textAlign="center">
                {category.title}
              </Text>
              <ImprovedGiftCarousel
                title=""
                products={category.products}
              />
            </YStack>
          </ContentCard>
        ))}
      </YStack>
    </PageContainer>
  );
}
