import { db } from '../../service/firebase';
import { setAlertOn } from './alertNotifier';

export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const USER_IS_LOADING = 'USER_IS_LOADING';

export const logout = () => ({
    type: LOGOUT_USER
});

export const userLoading = () => ({
    type: USER_IS_LOADING
});

export const setUser = (user) => {
    return function (dispatch) {
        dispatch(userLoading());
        fetchUser(user)
            .then(newUser => {
                return dispatch({
                    type: SET_USER,
                    payload: {
                        user: newUser
                    }
                });
            })
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
}

export const fetchUser = (user) => {
    return db.collection('users')
        .where('uid', '==', user.uid)
        .get()
        .then(res => {
            if (res.docs.length) {
                return res.docs[0].data();
            } else {
                const newUser = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    theme: 'dark',
                    subscribes: []
                };
                return db.collection('users')
                    .doc(user.uid)
                    .set(newUser)
                    .then(() => newUser);
            }
        });
}