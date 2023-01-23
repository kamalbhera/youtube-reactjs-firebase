// react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// service
import { filterVideos } from '../../service/service';
// redux
import { useDispatch } from 'react-redux';
import { setAlertOn } from '../../redux/actions/alertNotifier';
// components
import VideoCard from '../VideoCard/VideoCard';
import image from '../../assets/no-search-result.png';
import Layout from '../Layout/Layout';
import styles from '../TrendingVideos/TrendingVideos.module.scss';

export default function Search() {
    const [filtered, setFiltered] = useState([]);
    const dispatch = useDispatch();
    const { id } = useParams();

    const params = id.split('+');

    useEffect(() => {
        filterVideos(params)
            .then(res => setFiltered(res))
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }, [id]);

    return (
        <Layout>
            <div className={styles.videoContainer}>
                {
                    filtered.length ? filtered.map(video => (
                        <VideoCard key={video.id} views={video.views} url={video.url} title={video.title} duration={video.duration} id={video.id} author={video.author} authorPhotoURL={video.authorPhotoURL} />
                    )) : <img src={image} alt='No search results' id={styles.noSearchResImg} />
                }
            </div>
        </Layout >
    )
}