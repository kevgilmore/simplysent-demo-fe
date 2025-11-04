import React, { useRef, useState } from 'react';
import { 
  Text, 
  styled,
  useTheme
} from '@tamagui/core';
import { XStack, YStack } from '@tamagui/stacks';
import { Card } from '@tamagui/card';
import { Image } from '@tamagui/image';
import { ScrollView } from '@tamagui/scroll-view';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GlassCard = styled(Card, {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '$xl',
  padding: '$lg',
  margin: '$sm',
  minWidth: 260,
  maxWidth: 300,
  cursor: 'pointer',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 20,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderRadius: '$xl',
    zIndex: -1,
  },
  pressStyle: {
    scale: 0.96,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  hoverStyle: {
    scale: 1.04,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  animation: 'smooth',
});

const ProductImage = styled('img', {
  width: '100%',
  height: 200,
  borderRadius: '$lg',
  backgroundColor: '#f8f9fa',
  objectFit: 'cover',
  display: 'block',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const ScrollContainer = styled(ScrollView, {
  flex: 1,
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  paddingVertical: '$md',
});

const NavButton = styled('button', {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '$full',
  width: 44,
  height: 44,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  shadowColor: 'rgba(0, 0, 0, 0.15)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 12,
  hoverStyle: {
    transform: 'translateY(-50%) scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  pressStyle: {
    transform: 'translateY(-50%) scale(0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface ImprovedGiftCarouselProps {
  title: string;
  products?: Product[];
}

const defaultProducts: Product[] = [
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
];

export function ImprovedGiftCarousel({ title, products = defaultProducts }: ImprovedGiftCarouselProps) {
  const scrollViewRef = useRef<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const theme = useTheme();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollViewRef.current) {
      const scrollAmount = 250;
      const currentScroll = scrollViewRef.current.scrollLeft || 0;
      const newScroll = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      scrollViewRef.current.scrollTo({ x: newScroll, animated: true });
    }
  };

  const handleScroll = (event: any) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.nativeEvent.contentOffset || event.target;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <YStack space="$md" padding="$lg">
      {title && (
      <Text 
        fontSize="$6" 
        fontWeight="600" 
        color="#2d3748"
        textAlign="center"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {title}
      </Text>
      )}
      
      <XStack position="relative" alignItems="center">
        {canScrollLeft && (
          <NavButton
            position="absolute"
            left="$sm"
            onPress={() => scroll('left')}
            zIndex={10}
          >
            <ChevronLeft size={20} color="white" />
          </NavButton>
        )}
        
        <ScrollContainer
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: 20,
            alignItems: 'center'
          }}
        >
          <XStack space="$sm" alignItems="center">
            {products.map((product) => (
              <GlassCard key={product.id}>
                <YStack space="$sm" alignItems="center">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                  />
                  <YStack space="$xs" alignItems="center">
                    <Text 
                      fontSize="$3" 
                      fontWeight="500" 
                      color="#2d3748"
                      textAlign="center"
                      numberOfLines={2}
                      lineHeight="$3"
                    >
                      {product.title}
                    </Text>
                    <Text 
                      fontSize="$4" 
                      fontWeight="600" 
                      color="#667eea"
                    >
                      {product.price}
                    </Text>
                  </YStack>
                </YStack>
              </GlassCard>
            ))}
          </XStack>
        </ScrollContainer>
        
        {canScrollRight && (
          <NavButton
            position="absolute"
            right="$sm"
            onPress={() => scroll('right')}
            zIndex={10}
          >
            <ChevronRight size={20} color="white" />
          </NavButton>
        )}
      </XStack>
    </YStack>
  );
}
