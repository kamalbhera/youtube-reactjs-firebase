// react
import { useEffect, useState } from 'react';
import styles from './Subscriptions.module.scss';
// service
import { getUserSubscriptions } from '../../service/service';
// redux
import { useSelector } from 'react-redux';
import { getUser, getVideos } from '../../redux/selectors/selectors';
// components
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import GuestHeader from '../common/GuestHeader/GuestHeader';
import Carousel from '../common/Carousel/Carousel';
import Layout from '../Layout/Layout';

export default function Subscriptions() {
    const user = useSelector(getUser);
    const [subscriptions, setSubscriptions] = useState([]);
    const videos = useSelector(getVideos);

    useEffect(() => {
        if (user && videos) {
            getUserSubscriptions(user.uid, videos).then(res => setSubscriptions(res));
        }
    }, [user, videos]);

    const emptySubscribtionsPage = (
        <div className={styles.emptyPage}>
            <VideoLibraryIcon />
            <h2>Your library is empty for now</h2>
            <h2>Enjoy your favorite videos</h2>
            <h5>Go and find whatever you like</h5>
        </div>
    );

    const noLoggedInUserPage = (
        <div className={styles.emptyPage}>
            <VideoLibraryIcon />
            <h2>Enjoy your favorite videos!</h2>
            <h5>Sign in to access your subscribed users videos</h5>
            <div className={styles.signIn} > <GuestHeader /></div>
        </div>
    );

    return (
        <Layout>
            {subscriptions.length && user && <h1 className={styles.welcomeText}>Your subsciptions</h1>}
            <div className={styles.carouselContainer}>
                <Carousel array={subscriptions} emptyPage={emptySubscribtionsPage} noLoggedInUserPage={noLoggedInUserPage} />
            </div>
        </Layout>
    );
}