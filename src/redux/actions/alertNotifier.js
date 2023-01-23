export const ALERT_ON = 'ALERT_ON';
export const ALERT_OFF = 'ALERT_OFF';

export const setAlertOn = (alertType, message) => ({
    type: ALERT_ON,
    payload: {
        alertType,
        message
    }
});

export const setAlertOff = () => ({
    type: ALERT_OFF
});