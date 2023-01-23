// react
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './VideoPage.module.scss';
// service
import { subscribe, unsubscribe, likeOrDislikeVideo, isSubscribed } from '../../service/service';
// redux
import { useDispatch } from 'react-redux';
// components
import { ThumbDown as ThumbDownIcon, ThumbUp } from '@material-ui/icons';
import PopUp from './PopupState';
import PlaylistModal from './PlaylistModal';
import UserLogo from '../common/UserLogo/UserLogo';

export default function VideoInfo({ video, user }) {
    const [isSubsState, setIsSubsState] = useState(false);
    const dispatch = useDispatch();
    let isVideoLiked, isVideoDisliked;
    if (user) {
        isVideoLiked = video.isLikedBy.includes(user.uid);
        isVideoDisliked = video.isDislikedBy.includes(user.uid);
    }

    useEffect(() => {
        if (video && user) {
            isSubscribed(user, video).then(res => setIsSubsState(res));
        }
    }, []);

    const thumbsText = 'Sign in to make your opinion count.';
    const subscribeText = 'Sign in to subscribe to this channel.';
    const numberLikes = (
        <><ThumbUp className={isVideoLiked ? styles.liked : styles.button} onClick={() => likeOrDislikeVideo(user, video, 'like')} /><span>{video.id ? video.isLikedBy.length : null}</span></>
    );
    const loggedNumberLikes = (
        <><PopUp text={thumbsText} button={<ThumbUp className={styles.button} />} content={'Like this video?'} /><span>{video.id ? video.isLikedBy.length : null}</span></>
    );
    const numberDislikes = (
        <><ThumbDownIcon className={isVideoDisliked ? styles.disliked : styles.button} onClick={() => likeOrDislikeVideo(user, video, 'dislike')} /><span>{video.id ? video.isDislikedBy.length : null}</span></>
    );
    const loggedNumberDislikes = (
        <><PopUp text={thumbsText} button={<ThumbDownIcon className={styles.button} />} content={`Don't like this video?`} /><span>{video.id ? video.isDislikedBy.length : null}</span></>
    );
    const guestSubscribe = (
        <PopUp text={subscribeText} button={<div className={styles.subscribe}>SUBSCRIBE</div>} content={`Want to subscribe to this channel?`} />
    );
    const userSubscribe = (
        <>
            {isSubsState ? <div className={styles.unsubscribe}
                onClick={() => {
                    dispatch(unsubscribe(user, video)).then(() => setIsSubsState(false));
                }} title='Click for unsubscribe'>SUBSCRIBED</div> : <div className={styles.subscribe}
                    onClick={() => {
                        dispatch(subscribe(user, video)).then(() => setIsSubsState(true));
                    }} title='Click for subscribe'>SUBSCRIBE</div>}
        </>
    );

    return (
        <>
            <div className={styles.infoContainer}>
                <p className={styles.title}>{video.title}</p>
                <div className={styles.likesContainer}>
                    <div className={styles.views}>{video.views} views</div>
                    <div className={styles.thumbs}>
                        {user ? numberLikes : loggedNumberLikes}
                        {user ? numberDislikes : loggedNumberDislikes}
                        {video ? <PlaylistModal video={video} /> : null}
                    </div>
                </div>
            </div>
            <div className={styles.videoInfo}>
                <div>
                    <Link to={`/user/${video.authorID}`}><UserLogo author={video.author} authorPhotoURL={video.authorPhotoURL} /></Link>
                    <span className={styles.descr}>{video.description}</span>
                </div>
                {user ? userSubscribe : guestSubscribe}
            </div>
        </>
    )
}