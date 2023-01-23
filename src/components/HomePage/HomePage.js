// react
import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss'
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../redux/selectors/selectors';
import { setLoading, setNotLoading } from '../../redux/actions/loadingBar';
import { setAlertOn } from '../../redux/actions/alertNotifier';
// components
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../Layout/Layout';
import VideoCard from '../VideoCard/VideoCard';

export default function HomePage() {
    const [lastVideoIndex, setLastVideoIndex] = useState(0);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [scrollTop, setScrollTop] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [videosLimitOnPage, setVideosLimitOnPage] = useState(0);
    const videos = useSelector(getVideos);
    const dispatch = useDispatch();

    const newVideosOnScroll = videos.length < 4 ? videos.length : 4;

    useEffect(() => {
        setVisibleVideos(videos.slice(0, 16));
        setLastVideoIndex(videos.length < 16 ? 0 : 15);
        setVideosLimitOnPage(videos.length);
    }, [videos.length]);

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
        }, 1000);
    };

    return (
        <Layout>
            <InfiniteScroll
                className={styles.videoContainer}
                dataLength={visibleVideos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                onScroll={() => {
                    if (scrollTop < window.scrollY) {
                        setScrollTop(window.scrollY);
                    }
                }}
            >
                {
                    visibleVideos.map((video, index) => (
                        <VideoCard key={video.id + index} {...video} />
                    ))
                }
            </InfiniteScroll>
        </Layout >
    )
}