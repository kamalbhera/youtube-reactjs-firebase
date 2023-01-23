// react
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './VideoCard.module.scss';
// utils
import { timeConvert } from '../../utils';
// components
import UserLogo from '../common/UserLogo/UserLogo';

export default function VideoCard({ url, title, id, views, author, authorPhotoURL }) {
    const [duration, setDuration] = useState(null);

    const onLoad = (e) => {
        setDuration(timeConvert(e.target.duration));
    };

    let playPromise;
    return (
        <Link to={`/video/${id}`} className={styles.link}>
            <div className={styles.container} key={id}>
                <video
                    title={title}
                    onMouseOver={(e) => {
                        playPromise = e.target.play();
                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => e.target.play())
                                .catch(() => e.target.pause());
                        }
                    }}
                    onMouseOut={(e) => {
                        setTimeout(() => {
                            e.target.pause()
                        }, 100)
                    }}
                    src={url + '#t=1'}
                    datatype='video/mp4'
                    className={styles.video}
                    muted={true}
                    onLoadedMetadata={(e) => onLoad(e)}
                />
                <div className={styles.duration}>{duration}</div>
                <div className={styles.videoInfoContainer}>
                    <UserLogo author={author} authorPhotoURL={authorPhotoURL} />
                    <div className={styles.videoInfo}>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.authorName}>{author}</p>
                        <p className={styles.views}>{views} views</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}