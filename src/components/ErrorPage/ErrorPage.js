import styles from './ErrorPage.module.scss';
import image from '../../assets/monkey.png';
import { useHistory } from 'react-router';
export default function ErrorPage() {
    const history = useHistory();

    return (
        <div className={styles.errorContainer}>
            <img src={image} alt='error'></img>
            <p>This page isn't available. Sorry about that.</p>
            <p>go
                <span className={styles.link} onClick={history.goBack}> BACK </span>
                or go
                <span className={styles.link} onClick={() => history.push('/')}> HOME</span>
            </p>
        </div>
    )
}