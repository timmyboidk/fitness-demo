import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Move } from '../store/library';
import { FontFamily } from '../constants/theme';

/**
 * 动作卡片属性
 */
interface MoveItemProps {
    item: Move;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

/**
 * 带玻璃拟态效果、渐变强调和触觉反馈的高级动作卡片。
 */
export const MoveItem = memo(({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: MoveItemProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) {
            onPress();
        } else {
            router.push(`/workout/${item.id}?mode=move`);
        }
    }, [onPress, item.id]);

    const handleAdd = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAdd?.();
    }, [onAdd]);

    const handleRemove = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onRemove?.();
    }, [onRemove]);

    const accentColor = isDark ? '#FFFFFF' : '#000000';
    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const borderColor = isDark ? '#38383A' : '#E5E5EA';
    const textPrimary = isDark ? '#FFFFFF' : '#000000';
    const textSecondary = isDark ? '#AEAEB2' : '#8E8E93';
    const iconTint = isDark ? '#FFFFFF' : '#000000';

    return (
        <TouchableOpacity
            onPress={handlePress}
            testID={`move-item-${item.id}`}
            activeOpacity={0.7}
            style={[
                styles.card,
                {
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                },
            ]}
        >
            {/* 渐变强调线 */}
            <LinearGradient
                colors={isDark ? ['#2C2C2E', '#1C1C1E'] : ['#D1D1D6', '#F2F2F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientAccent}
            />

            {/* 图标区域 */}
            <View style={[styles.iconArea, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                <SymbolView name={item.icon as any} size={56} tintColor={iconTint} fallback="body" />
            </View>

            {/* 内容 */}
            <View style={styles.content}>
                <Text
                    style={[styles.title, { color: textPrimary, fontFamily: FontFamily.bold }]}
                    numberOfLines={1}
                >
                    {item.name}
                </Text>

                <View style={styles.metaRow}>
                    {/* 等级标签 */}
                    <View style={[styles.levelPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                        <Text style={[styles.levelText, { color: accentColor, fontFamily: FontFamily.semiBold }]}>
                            {item.level}
                        </Text>
                    </View>

                    {showAddButton ? (
                        <TouchableOpacity onPress={handleAdd} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <SymbolView name={"plus.circle.fill" as any} size={22} tintColor={accentColor} />
                        </TouchableOpacity>
                    ) : null}

                    {showRemoveButton ? (
                        <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <SymbolView name={"minus.circle.fill" as any} size={22} tintColor={isDark ? '#AEAEB2' : '#8E8E93'} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
    },
    gradientAccent: {
        height: 3,
        width: '100%',
    },
    iconArea: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 14,
    },
    title: {
        fontSize: 18,
        lineHeight: 22,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    levelPill: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 100,
    },
    levelText: {
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});
