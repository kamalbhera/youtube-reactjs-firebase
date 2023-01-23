// react
import { useEffect, useState } from 'react';
import styles from '../TrendingVideos/TrendingVideos.module.scss';
// service
import { db } from '../../service/firebase';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, getUser, getUserLoading } from '../../redux/selectors/selectors';
import { setLoading, setNotLoading } from '../../redux/actions/loadingBar';
import { setAlertOn } from '../../redux/actions/alertNotifier';
// components
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../Layout/Layout';
import VideoCard from '../VideoCard/VideoCard';
import GuestHeader from '../common/GuestHeader/GuestHeader';

export default function History() {
    const [lastVideoIndex, setLastVideoIndex] = useState(0);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [scrollTop, setScrollTop] = useState(0);
    const [history, setHistory] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const videos = useSelector(getVideos);
    const user = useSelector(getUser);
    const isUserLoading = useSelector(getUserLoading);
    const dispatch = useDispatch();

    const videosLimitOnPage = 25;
    const newVideosOnScroll = videos.length < 4 ? videos.length : 4;

    useEffect(() => {
        if (user) {
            const videosRef = db.collection('videos');
            videosRef.where('isWatchedBy', 'array-contains', user.uid).get()
                .then(res => res.docs.map(el => el.data()))
                .then(res => setHistory(res));
        }
    }, [user]);

    useEffect(() => {
        setVisibleVideos(history.slice(0, 16));
        setLastVideoIndex(history.length < 16 ? 0 : 15);
    }, [history.length]);

    const fetchMoreData = () => {
        if (scrollTop > window.scrollY) return;
        if (visibleVideos.length > videosLimitOnPage) {
            dispatch(setAlertOn('info', 'No more videos to show. Check again later or upload some.'));
            return setHasMore(false);
        }

        dispatch(setLoading());
        let newVideos;
        const endIndex = lastVideoIndex + newVideosOnScroll;
        if (endIndex > videos.length) {
            const diff = endIndex - videos.length;
            newVideos = videos.slice(newVideosOnScroll - diff, videos.length);
            newVideos.concat(videos.slice(0, diff));
            setLastVideoIndex(diff - 1);
        } else {
            newVideos = visibleVideos.slice(lastVideoIndex, endIndex);
            setLastVideoIndex(endIndex);
        }

        setTimeout(() => {
            setVisibleVideos([...visibleVideos, ...newVideos]);
            dispatch(setNotLoading());
        }, 1000)
    };

    const noLoggedInUserPage = (
        <div className={styles.emptyPage}>
            <VideoLibraryIcon />
            <h2>Enjoy your watched videos</h2>
            <h5>Sign in to access videos that you’ve watched</h5>
            <div className={styles.signIn} > <GuestHeader /></div>
        </div>
    );

    return (
        <Layout>
            {isUserLoading && <p className={styles.welcomeText}>Loading...</p>}
            {!isUserLoading && user && <>
                <h1 className={styles.welcomeText}>Your watched videos history</h1>
                <InfiniteScroll
                    className={styles.videoContainer}
                    dataLength={visibleVideos.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    scrollThreshold='1px'
                    onScroll={() => {
                        if (scrollTop < window.scrollY) {
                            setScrollTop(window.scrollY);
                        }
                    }}
                >
                    {
                        visibleVideos.map(video => (
                            <VideoCard key={video.id + Math.random()} url={video.url} title={video.title} views={video.views} id={video.id} author={video.author} authorPhotoURL={video.authorPhotoURL} />
                        ))
                    }
                </InfiniteScroll>
            </>}
            {!isUserLoading && !user && noLoggedInUserPage}
        </Layout >
    )
}