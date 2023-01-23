// react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './VideoPage.module.scss';
// service
import { increaseViews } from '../../service/service';
import { db } from '../../service/firebase';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
// components
import ReactPlayer from 'react-player';
import CommentsContainer from './CommentsContainer';
import PlayNextVideos from './PlayNextVideos';
import VideoInfo from './VideoInfo';

export default function VideoPage() {
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const video = useSelector(state => state.videos.videos.find(video => video.id === id));
    const user = useSelector(getUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (video) {
            db.collection('comments').where('videoID', '==', id).orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    let dbComments = [];
                    snapshot.docs.map(doc => (dbComments.push({ ...doc.data() })))
                    setComments(dbComments);
                });
            dispatch(increaseViews(video));
        }
    }, []);

    return (
        <div className={styles.videoContainer}>
            {video ?
                <div className={styles.container}>
                    <ReactPlayer url={video.url} controls playing={true} className={styles.video} />
                    <div className={styles.hashtags}>
                        {`#${video.title} #video #${video.views}views #youtube`}
                    </div>
                    <VideoInfo video={video} user={user} />
                    <CommentsContainer currentVideo={video} comments={comments} id={id} />
                </div> : null}
            <PlayNextVideos />
        </div>
    );
}