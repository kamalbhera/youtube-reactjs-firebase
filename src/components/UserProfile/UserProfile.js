// react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './UserProfile.module.scss';
// service
import { getUserInfo } from '../../service/service';
// redux
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
// components
import CurrentUserTabs from './CurrentUserTabs';
import Layout from '../Layout/Layout';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const currentUser = useSelector(getUser);

    useEffect(() => {
        if (currentUser) {
            if (id === currentUser.uid) {
                setUser(currentUser);
            } else {
                getUserInfo(id).then(res => setUser(res.data()));
            }
        }
    }, [id, currentUser]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileInfo}>
                        {user && currentUser ?
                            <>
                                {user.photoURL && <img className={styles.icon} src={user.photoURL} alt='user logo' />}
                                {!user.photoURL && <h1 className={styles.icon}>{user.displayName[0]}</h1>}
                                <div className={styles.infoBox}>
                                    <h1 className={styles.names}>{user.displayName}</h1>
                                    {user.uid === currentUser.uid ? <h1 className={styles.email}>{user.email}</h1> : null}
                                </div>
                            </> : null}
                    </div>
                    {user && currentUser ?
                        <CurrentUserTabs
                            id={id}
                            user={user}
                            currentUser={currentUser} />
                        : null}
                </div >
            </div>
        </Layout>
    )
}