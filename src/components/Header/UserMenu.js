// react
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './Header.module.scss';
// service
import { updateUserTheme } from '../../service/service';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
import { setDarkTheme, setLightTheme } from '../../redux/actions/theme';
// components
import { Tooltip, ClickAwayListener } from '@material-ui/core';
import { VideoCall as VideoCallIcon, ExitToApp as ExitToAppIcon, AccountBox as AccountBoxIcon, InvertColors as InvertColorsIcon } from '@material-ui/icons';
import NotificationsMenu from './NotificationsMenu';

export default function UserMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const user = useSelector(getUser);
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClickProfile = () => {
        setOpenProfile((prev) => !prev);
    };
    const handleClickAwayProfile = () => {
        setOpenProfile(false);
    };
    const changeTheme = () => {
        if (user) {
            if (theme === 'dark') {
                updateUserTheme(user, 'light');
            } else {
                updateUserTheme(user, 'dark');
            }
        } else {
            if (theme === 'dark') {
                dispatch(setLightTheme());
            } else {
                dispatch(setDarkTheme());
            }
        }
    };

    return (
        <div id={styles.userIcons}>
            <Tooltip title="Upload a video" placement="bottom">
                <VideoCallIcon fontSize='default' className={styles.icons} onClick={() => history.push('/upload')} />
            </Tooltip>
            <Tooltip title="Change site colors" placement="bottom">
                <InvertColorsIcon className={styles.icons} onClick={changeTheme} />
            </Tooltip>
            <NotificationsMenu />
            <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClickAwayProfile}
            >
                <div className={styles.dropdownContainer} >
                    {user ?
                        <Tooltip title="My profile" placement="bottom">
                            {user.photoURL ?
                                <img className={styles.userPhoto} onClick={handleClickProfile} src={user.photoURL} alt='user logo' />
                                : <h1 onClick={handleClickProfile} className={styles.userIcon}>{user.displayName ? user.displayName[0] : null}</h1>}
                        </Tooltip>
                        : null}
                    {openProfile ? (
                        <ul className={styles.dropdown}>
                            {user ?
                                <li className={styles.displayFlex}>
                                    {user.photoURL ?
                                        <img className={styles.userPhoto} src={user.photoURL} alt='user logo' /> :
                                        <h1 className={styles.userIcon}>{user.displayName[0]}</h1>
                                    }
                                    <div className={styles.userInfo}>
                                        <h4 className={styles.marginNone}>{user.displayName}</h4>
                                        <p className={styles.marginNone}>{user.email}</p>
                                    </div>
                                </li> : null
                            }
                            <div className={styles.line}></div>
                            <Link to={`/user/${user.uid}`} className={styles.links}>
                                <li className={styles.listItem}>
                                    <AccountBoxIcon className={styles.iconColorGrey} />
                                    <p className={styles.text}>My channel</p>
                                </li>
                            </Link>
                            <div className={styles.line}></div>
                            <Link to='/signout' className={styles.links}>
                                <li className={styles.listItem}>
                                    <ExitToAppIcon className={styles.iconColorGrey} />
                                    <p className={styles.text}>Sign out</p>
                                </li>
                            </Link>
                        </ul>
                    ) : null}
                </div>
            </ClickAwayListener>
        </div >
    );
}