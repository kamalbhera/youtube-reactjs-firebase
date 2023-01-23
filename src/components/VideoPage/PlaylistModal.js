// react
import { useEffect, useState } from 'react';
import styles from './PlaylistModal.module.scss';
// service
import { addVideoToPlaylist, createPlaylist, removeVideoFromPlaylist, deletePlaylist } from '../../service/service';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
import { getPlaylists } from '../../redux/actions/playlists';
// components
import { Modal, FormControlLabel, Checkbox, TextField, List, Button } from '@material-ui/core';
import { PlaylistAdd as PlaylistAddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import PopUp from './PopupState';

export default function PlaylistModal({ video }) {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const user = useSelector(getUser);
    const playlists = useSelector(state => state.playlists.playlists);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(getPlaylists(user.uid));
        }
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && inputValue && user.uid) {
            dispatch(createPlaylist(user, inputValue));
            setInputValue('');
        }
    };

    const addOrRemoveVideo = (e, playlist) => {
        if (e.target.checked) {
            dispatch(addVideoToPlaylist(video, playlist));
        } else {
            dispatch(removeVideoFromPlaylist(video, playlist));
        }
    };

    const text = 'Sign in to add this video to a playlist.';
    const loggedUserPlaylist = (
        <div onClick={handleOpen}><PlaylistAddIcon /> <span>SAVE</span></div>
    );
    const unloggedUserPlaylist = (
        <div><PopUp text={text} button={<><PlaylistAddIcon /><span>SAVE</span></>} content={'Want to watch this again later?'} /></div>
    );

    return (
        <div>
            <div className={styles.playlistContainer}>
                {user ? loggedUserPlaylist : unloggedUserPlaylist}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={styles.modalContainer}>
                    <List>
                        {
                            playlists ? playlists.map((playlist, index) => (
                                <div className={styles.playlist} key={playlist.id}>
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            onClick={(e) => { addOrRemoveVideo(e, playlist) }}
                                            name={playlist.name} value={playlist.name}
                                            checked={playlist.videos.some(el => el === video.id)} />}
                                        label={playlist.name} />
                                    <DeleteIcon onClick={() => deletePlaylist(playlist.id)} className={styles.trash} />
                                </div>
                            )) : null}
                    </List>
                    <TextField id="standard-basic" placeholder={'Enter playlist name...'} value={inputValue} onKeyPress={handleKeyPress} onChange={onInputChange} />
                    <div><Button variant="contained" color="secondary" onClick={handleKeyPress}>CREATE</Button></div>
                </div>
            </Modal>
        </div>
    )
}