import { View, Text, FlatList, Dimensions, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient'; // 需要安装

const { width, height } = Dimensions.get('window');

// 临时占位图，请替换为你 assets 里的真实图片
const SLIDES = [
    {
        id: '1',
        title: 'START YOUR JOURNEY',
        subtitle: 'Towards A More Active Lifestyle',
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1970&auto=format&fit=crop' }
    },
    {
        id: '2',
        title: 'FIND NUTRITION TIPS',
        subtitle: 'That Fit Your Lifestyle',
        image: { uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop' }
    },
    {
        id: '3',
        title: 'A COMMUNITY FOR YOU',
        subtitle: 'Challenge Yourself',
        image: { uri: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?q=80&w=2070&auto=format&fit=crop' }
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View className="flex-1 bg-black">
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item }) => (
                    <ImageBackground source={item.image} style={{ width, height }} resizeMode="cover">
                        {/* 底部渐变遮罩，让文字更清晰 */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' }}
                        />

                        <View className="flex-1 justify-end px-8 pb-40">
                            <Text className="text-neon font-bold mb-2 tracking-widest">FITBODY</Text>
                            <Text className="text-white text-5xl font-black leading-tight mb-4">
                                {item.title.split(' ').map((word, i) => (
                                    <Text key={i}>{word}{'\n'}</Text>
                                ))}
                            </Text>
                            <Text className="text-gray-300 text-xl">{item.subtitle}</Text>
                        </View>
                    </ImageBackground>
                )}
            />

            {/* 底部导航 */}
            <View className="absolute bottom-12 w-full px-8 flex-row justify-between items-center">
                <View className="flex-row space-x-2">
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-neon' : 'w-2 bg-gray-600'}`}
                        />
                    ))}
                </View>
                <Button
                    label={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
                    size="sm"
                    className="w-36"
                    onPress={handleNext}
                />
            </View>
        </View>
    );
}