// react
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from '../SignIn/SignIn.module.scss';
// service
import { auth } from '../../service/firebase';
// utils
import { validateEmail } from '../../utils';
// redux
import { useDispatch } from 'react-redux';
import { setAlertOn } from '../../redux/actions/alertNotifier';
// components
import { TextField, Button } from '@material-ui/core';
import logoBlack from '../../assets/logoBlack.png';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const sendResetEmail = (event) => {
        event.preventDefault();
        if (!email.trim()) {
            return dispatch(setAlertOn('error', 'Enter an email'));
        } else if (!validateEmail(email)) {
            return dispatch(setAlertOn('error', 'Enter a valid email'));
        }

        auth.sendPasswordResetEmail(email)
            .then(() => {
                setEmailHasBeenSent(true);
                setTimeout(() => { setEmailHasBeenSent(false) }, 3000);
            })
            .catch(err => dispatch(setAlertOn('error', err.message)));
    };

    const onInputChange = (e) => {
        e.preventDefault();
        const { value } = e.currentTarget;
        setEmail(value);
    };

    return (
        <form className={styles.signIn} >
            <img src={logoBlack} alt="logo" id={styles.logo} onClick={() => history.push('/')} />
            <div className={styles.welcomeText}>
                <h2>Reset your password</h2>
                <p>to continue to YouTube</p>
            </div>
            {emailHasBeenSent && (
                <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
                    An email has been sent to you!
                </div>
            )}
            <div className={styles.container}>
                <TextField type="email" name="new-password" required className={styles.inputs} size="medium" label="Email" variant="outlined" value={email} id="email" onChange={(e) => onInputChange(e)} autoComplete="new-password" />
            </div>
            <div className={styles.buttons}>
                <Link to="signin" className={styles.link}>Sign in instead</Link>
                <div className={styles.button}>
                    <Button variant="contained" color="primary"
                        onClick={(e) => sendResetEmail(e)}>
                        reset
                </Button>
                </div>
            </div>
        </form>
    );
}
