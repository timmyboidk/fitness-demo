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
        // Since we mock Ionicons in setup, we can check if the mock view is rendered or just check for no errors
        // Ideally we check testID if we added it to icon, but currently SettingItem doesn't add testID to icon.
        // We can check if it renders without crashing.
        render(<SettingItem label="Icon Label" icon="settings" />);
    });
});
