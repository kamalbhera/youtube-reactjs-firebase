// react
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './SignIn.module.scss';
// service
import { auth, googleProvider, facebookProvider, gitHubProvider } from '../../service/firebase';
// utils
import { validateEmail } from '../../utils';
// redux
import { useDispatch } from 'react-redux';
import { setAlertOn } from '../../redux/actions/alertNotifier';
// components
import logoBlack from '../../assets/logoBlack.png';
import gitHubLogo from '../../assets/gitHubLogo.png';
import facebookLogo from '../../assets/facebookLogo.png';
import googleLogo from '../../assets/googleLogo.png';
import { TextField, Button } from '@material-ui/core';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const onProviderClick = (provider) => {
        auth.signInWithPopup(provider)
            .then(() => {
                history.push('/');
                dispatch(setAlertOn('success', 'Login successfull'));
            })
            .catch(err => {
                dispatch(setAlertOn('error', err.message));
            });
    };

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        [email, password] = [email.trim(), password.trim()];
        if (!email) {
            return dispatch(setAlertOn('error', 'Enter an email'));
        } else if (!validateEmail(email)) {
            return dispatch(setAlertOn('error', 'Enter a valid email'));
        } else if (!password) {
            return dispatch(setAlertOn('error', 'Enter a password'));
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                history.replace('/');
                dispatch(setAlertOn('success', 'Login successfull'));
            })
            .catch(err => {
                dispatch(setAlertOn('error', err.message));
            });
    };

    const onInputChange = (e) => {
        e.preventDefault();
        const { id, value } = e.currentTarget;
        switch (id) {
            case 'email':
                setEmail(value);
                break;
            default:
                if (value.includes(' ')) return;
                if (value.length > 30) {
                    return dispatch(setAlertOn('error', 'Email cannot exceed 30 characters'));
                }
                setPassword(value);
        }
    };

    return (
        <form className={styles.signIn} >
            <img src={logoBlack} alt="logo" id={styles.logo} onClick={() => history.push('/')} />
            <div className={styles.welcomeText}>
                <h2>Sign in</h2>
                <p>to continue to YouTube</p>
            </div>
            <div className={styles.container}>
                <TextField type="email" required className={styles.inputs} size="medium" label="Email" variant="outlined" value={email} id="email" onChange={onInputChange} autoComplete="off" />
            </div>
            <div className={styles.container}>
                <TextField type="password" required className={styles.inputs} size="medium" label="Password" variant="outlined" value={password} id="password" onChange={onInputChange} autoComplete="off" />
            </div>
            <p className={styles.loginWithText}>Login with:</p>
            <div className={styles.buttons}>
                <div className={styles.socialIcons}>
                    <img onClick={() => onProviderClick(facebookProvider)} src={facebookLogo} alt='Facebook logo' className={styles.logo} />
                    <img onClick={() => onProviderClick(googleProvider)} src={googleLogo} alt='Google logo' className={styles.logo} />
                    <img onClick={() => onProviderClick(gitHubProvider)} src={gitHubLogo} alt='GitHub logo' className={styles.logo} />
                </div>
                <p>or</p>
                <div className={styles.button}>
                    <Button variant="contained" color="primary"
                        onClick={(e) => {
                            signInWithEmailAndPasswordHandler(e, email, password);
                        }}>
                        sign in
                        </Button>
                </div>
            </div>
            <div className={styles.options}>
                <Link to="signup" className={styles.link}>Create account</Link>
                <Link to="reset" className={styles.link} >Password reset</Link>
            </div>
        </form>
    );
}
