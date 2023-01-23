import styles from './ProgressBar.module.scss'
import LinearProgress from '@material-ui/core/LinearProgress';

export default function ProgressBar({ isOn }) {
    return (
        <div className={styles.bar}>
            {isOn ? <LinearProgress color="secondary" /> : null}
        </div>
    );
}