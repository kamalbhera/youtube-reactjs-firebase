import { Link } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Home, VideoLibrary, History, Whatshot, Subscriptions } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

export default function Layout({ children }) {
    const sideBarContainer = (<>
        <Tooltip title='Home' placement="right">
            <Link to="/" className={styles.sidebars}>
                <Home />
                <p>Home</p>
            </Link>
        </Tooltip>
        <Tooltip title='Library' placement="right">
            <Link to="/library" className={styles.sidebars}>
                <VideoLibrary />
                <p>Library</p>
            </Link>
        </Tooltip>
        <Tooltip title='History' placement="right">
            <Link to="/history" className={styles.sidebars}>
                <History />
                <p>History</p>
            </Link>
        </Tooltip>
        <Tooltip title='Trending' placement="right">
            <Link to="/trending" className={styles.sidebars}>
                <Whatshot />
                <p>Trending</p>
            </Link>
        </Tooltip>
        <Tooltip title='Subscriptions' placement="right">
            <Link to="/subscriptions" className={styles.sidebars}>
                <Subscriptions />
                <p>Subscriptions</p>
            </Link>
        </Tooltip>
    </>);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.sideBarContainer}>
                {sideBarContainer}
            </div>
            <div className={styles.homeContainer}>
                {children}
            </div>
        </div>
    )
}