import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import styles from './GuestHeader.module.scss';

export default function GuestHeader() {
    return (
        <div>
            <Link to='/signin' className={styles.links} title='Sign in'>
                <div className={styles.signIn}>
                    <AccountCircleIcon />
                    <span>SIGN IN</span>
                </div>
            </Link>
        </div>
    )
}