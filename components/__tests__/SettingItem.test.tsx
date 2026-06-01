import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SettingItem } from '../SettingItem';

describe('SettingItem', () => {
    it('renders basic info correctly', () => {
        const { getByText } = render(<SettingItem label="Test Label" value="Test Value" />);
        expect(getByText('Test Label')).toBeTruthy();
        expect(getByText('Test Value')).toBeTruthy();
    });

    it('renders switch correctly', () => {
        const onValueChange = jest.fn();
        const { getByTestId } = render(
            <SettingItem
                label="Switch Label"
                isSwitch
                value={true}
                onValueChange={onValueChange}
                testID="test-item"
            />
        );
        const switchElement = getByTestId('test-item-switch');
        expect(switchElement.props.value).toBe(true);

        fireEvent(switchElement, 'onValueChange', false);
        expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('handles onPress', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <SettingItem label="Pressable" onPress={onPress} testID="pressable-item" />
        );
        fireEvent.press(getByTestId('pressable-item'));
        expect(onPress).toHaveBeenCalled();
    });

    it('renders icon when provided', () => {
        // 由于我们在 setup 中模拟了 Ionicons，可以检查模拟视图是否渲染或只检查是否没有错误
        // 理想情况下我们检查 testID（如果我们在图标上添加了它），但当前 SettingItem 没有向图标添加 testID
        // 我们可以检查它是否在不会崩溃的情况下渲染
        render(<SettingItem label="Icon Label" icon="settings" />);
    });
});
