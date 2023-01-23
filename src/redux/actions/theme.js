import { db } from '../../service/firebase';
import { changeThemeColors } from '../../utils';
export const SET_DARK_THEME = 'SET_DARK_THEME';
export const SET_LIGHT_THEME = 'SET_LIGHT_THEME';


export const setLightTheme = () => ({
    type: SET_LIGHT_THEME,
});

export const setDarkTheme = () => ({
    type: SET_DARK_THEME,
});

export const fetchTheme = () => {
    return function (dispatch, getState) {
        const user = getState().user.user
        if (user) {
            db.collection('users').doc(user.uid).onSnapshot(snapshot => {
                const theme = snapshot.data().theme;
                changeThemeColors(theme);
                if (theme === 'dark') {
                    dispatch(setDarkTheme());
                } else {
                    dispatch(setLightTheme());
                }
            });
        } else {
            dispatch(setDarkTheme());
        }
    }
};
