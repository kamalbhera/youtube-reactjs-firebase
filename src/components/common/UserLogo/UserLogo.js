import React, { useEffect, useState } from 'react';
import styles from './UserLogo.module.scss';

export default function UserLogo({ author, authorPhotoURL }) {
    const [url, setUrl] = useState(null);
    const [name, setName] = useState(null);

    useEffect(() => {
        setUrl(authorPhotoURL);
        setName(author);
    }, [author, authorPhotoURL]);

    const picture = <img className={styles.userPic} src={url || null} alt='user logo' />
    const firstLetter = <h1 className={styles.userLetter}>{name ? name[0] : null}</h1>

    return (
        <div>
            {url ? picture : firstLetter}
        </div>
    )
}