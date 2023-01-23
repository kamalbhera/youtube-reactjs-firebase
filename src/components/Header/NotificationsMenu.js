// react
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import ReactTimeAgo from 'react-time-ago';
// service
import { deleteNotification, setNotificationsRead } from '../../service/service';
import { db } from '../../service/firebase';
// redux
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
// components
import { Tooltip, Badge, ClickAwayListener } from '@material-ui/core';
import { Notifications as NotificationsIcon, Cancel } from '@material-ui/icons';
import UserLogo from '../common/UserLogo/UserLogo';

export default function NotificationsMenu() {
    const [openNotify, setOpenNotify] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [notifications, setNotifciatons] = useState([]);
    const user = useSelector(getUser);

    useEffect(() => {
        let mounted = true;
        if (user) {
            db.collection('notifications')
                .where('userID', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .onSnapshot((notifications) => {
                    let dbNot = [];
                    notifications.forEach((not) => {
                        dbNot.push(not.data());
                    });
                    if (mounted) {
                        setNotifciatons(dbNot);
                    }
                });
            return () => mounted = false;
        }
    }, [user]);

    useEffect(() => {
        setUnreadNotifications(notifications.filter(notification => !notification.isRead));
    }, [notifications.length]);

    const handleClickNotify = () => {
        setOpenNotify((prev) => !prev);
        setTimeout(() => {
            setNotificationsRead();
            setUnreadNotifications([]);
        }, 2000);
    };
    const handleClickAwayNotify = () => {
        setOpenNotify(false);
    };

    const noNotifications = (
        <><NotificationsIcon fontSize="large" id={styles.bigNotifyIcon} />
            <p className={styles.greyText}>No new notifications.</p></>
    );

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={handleClickAwayNotify}
        >
            <div className={styles.dropdownContainer} >
                <Tooltip title="Notifications" placement="bottom">
                    <div onClick={handleClickNotify}>
                        <Badge className={styles.badge} badgeContent={unreadNotifications.length} color="error" >
                            <NotificationsIcon className={styles.icons} />
                        </Badge>
                    </div>
                </Tooltip>
                {openNotify ? (
                    <div id={styles.dropdownNotify} className={styles.dropdown}>
                        <h4 className={styles.notifyTitle}>Notifications</h4>
                        <div className={styles.line}></div>
                        <div className={styles.greyText}>
                            {notifications.length ? notifications.map((notification, index) => (
                                <div key={index} className={!notification.isRead ? styles.unread : styles.read}>
                                    <Link to={`/users/${notification.userID}`}>
                                        <UserLogo author={notification.displayName} authorPhotoURL={notification.photoURL} /></Link>
                                    {notification.videoID ?
                                        <span className={styles.info}>{`${notification.displayName} ${notification.status} your video `}
                                            <Link to={`/video/${notification.videoID}`}>{notification.videoTitle}</Link>
                                        </span> : <span className={styles.info}>{`${notification.displayName} ${notification.status}`}</span>}
                                    <ReactTimeAgo date={notification.timestamp.toDate()} locale="en-US" />
                                    <Cancel className={styles.cancel} onClick={() => deleteNotification(notification.notID)} />
                                </div>
                            )) : <div>{noNotifications}</div>}
                        </div>
                    </div>
                ) : null}
            </div>
        </ClickAwayListener>
    )
}