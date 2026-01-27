import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/AuthService';

/**
 * Custom hook to handle OTP (One-Time Password) sending and timer logic.
 */
export function useOTP() {
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const sendCode = useCallback(async (phone: string) => {
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            Alert.alert("错误", "请输入正确的11位手机号码");
            return false;
        }

        setLoading(true);
        setIsTimerRunning(true);
        setTimer(60);

        try {
            const res = await authService.requestOTP(phone);
            if (res.success) {
                Alert.alert("提示", "验证码已发送 (默认1234)");
                return true;
            } else {
                Alert.alert("错误", res.message || "由于网络原因发送失败");
                setIsTimerRunning(false);
                setTimer(0);
                return false;
            }
        } catch (e) {
            Alert.alert("错误", "发送失败，请稍后重试");
            setIsTimerRunning(false);
            setTimer(0);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        timer,
        isTimerRunning,
        sendCode,
        loading
    };
}
