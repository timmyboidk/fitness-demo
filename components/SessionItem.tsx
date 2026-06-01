import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Session } from '../store/library';
import { FontFamily } from '../constants/theme';

/**
 * Session card props
 */
interface SessionItemProps {
    item: Session;
    onPress?: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
}

/**
 * Premium session card with glassmorphism, gradient play button, and haptic feedback.
 */
export const SessionItem = memo(({ item, onPress, showAddButton, onAdd, showRemoveButton, onRemove }: SessionItemProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) {
            onPress();
        } else {
            router.push(`/workout/${item.id}?mode=session`);
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

    const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
    const borderColor = isDark ? '#38383A' : '#E5E5EA';
    const textPrimary = isDark ? '#FFFFFF' : '#000000';
    const textSecondary = isDark ? '#AEAEB2' : '#8E8E93';

    return (
        <TouchableOpacity
            onPress={handlePress}
            testID={`session-item-${item.id}`}
            activeOpacity={0.7}
            style={[
                styles.card,
                {
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                },
            ]}
        >
            <View style={styles.row}>
                {/* Left: color bar + text */}
                <View style={styles.leftSection}>
                    <View style={[styles.colorBar, { backgroundColor: isDark ? '#38383A' : '#D1D1D6' }]} />

                    <View style={styles.textBlock}>
                        <Text
                            style={[styles.title, { color: textPrimary, fontFamily: FontFamily.bold }]}
                            numberOfLines={1}
                        >
                            {item.name}
                        </Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <SymbolView name={"clock" as any} size={12} tintColor={textSecondary} style={{ marginRight: 4 }} />
                                <Text style={[styles.metaText, { color: textSecondary, fontFamily: FontFamily.medium }]}>
                                    {item.time}
                                </Text>
                            </View>
                            <View style={[styles.metaDot, { backgroundColor: textSecondary }]} />
                            <View style={styles.metaItem}>
                                <SymbolView name={"square.stack.3d.up" as any} size={12} tintColor={textSecondary} style={{ marginRight: 4 }} />
                                <Text style={[styles.metaText, { color: textSecondary, fontFamily: FontFamily.medium }]}>
                                    {item.count}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Right: action buttons */}
                {showAddButton ? (
                    <TouchableOpacity onPress={handleAdd} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <SymbolView name={"plus.circle.fill" as any} size={28} tintColor={isDark ? '#FFFFFF' : '#000000'} />
                    </TouchableOpacity>
                ) : null}

                {showRemoveButton ? (
                    <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <SymbolView name={"minus.circle.fill" as any} size={28} tintColor={isDark ? '#AEAEB2' : '#8E8E93'} />
                    </TouchableOpacity>
                ) : null}

                {!showAddButton && !showRemoveButton ? (
                    <LinearGradient
                        colors={isDark ? ['#38383A', '#2C2C2E'] : ['#D1D1D6', '#E5E5EA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.playButton}
                    >
                        <SymbolView name={"play.fill" as any} size={22} tintColor="#FFFFFF" style={{ marginLeft: 3 }} />
                    </LinearGradient>
                ) : null}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginBottom: 14,
        paddingVertical: 20,
        paddingHorizontal: 18,
        borderRadius: 24,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorBar: {
        width: 4,
        height: 48,
        borderRadius: 100,
        marginRight: 16,
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        marginHorizontal: 8,
        opacity: 0.4,
    },
    metaText: {
        fontSize: 12,
        letterSpacing: 0.3,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
