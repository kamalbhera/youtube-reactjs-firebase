// react
import { useEffect, useState } from 'react';
import styles from './UserProfile.module.scss';
// service
import { deleteVideo, editVideo, getUserSubscriptions } from '../../service/service';
// redux
import { useDispatch, useSelector } from 'react-redux';
// components
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import VideoCard from '../VideoCard/VideoCard';
import AlertDialog from './DialogBoxes/AlertDialog';
import FormDialog from './DialogBoxes/FormDialog';
import Carousel from '../common/Carousel/Carousel';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} className={styles.container}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    tabBar: {
        backgroundColor: '#202020',
        color: 'var(--t-color)',
        paddingLeft: '150px'
    },
    container: {
        paddingLeft: '50px',
    }
}));

export default function CurrentUserTabs({ id, user, currentUser }) {
    const [video, setVideo] = useState(null);
    const [value, setValue] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const history = useSelector(state => state.videos.videos.filter(video => video.isWatchedBy.includes(id)));
    const liked = useSelector(state => state.videos.videos.filter(video => video.isLikedBy.includes(id)));
    const userVideos = useSelector(state => state.videos.videos.filter(video => video.authorID === id));
    const allVideos = useSelector(state => state.videos.videos);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (allVideos) {
            getUserSubscriptions(id, allVideos).then(res => setSubscriptions(res));
        }
    }, []);

    const onEditOpen = (video) => {
        setOpenEdit(true);
        setVideo(video);
    };

    const onDeleteOpen = (video) => {
        setOpenAlert(true);
        setVideo(video);
    };

    const onEditClick = (title, description) => {
        setOpenEdit(false);
        dispatch(editVideo(video, title, description));
    };

    const onDeleteClick = () => {
        setOpenAlert(false);
        dispatch(deleteVideo(video, user.uid));
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    className={classes.tabBar}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Videos" {...a11yProps(0)} />
                    {history ? <Tab label="History" {...a11yProps(1)} /> : null}
                    <Tab label="Liked" {...a11yProps(2)} />
                    <Tab label="Subscriptions" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} className={classes.container}>
                {userVideos && userVideos.length ? userVideos.map(video => (
                    <div key={video.id}>
                        <VideoCard key={video.id} url={video.url} title={video.title} views={video.views} author={video.author} authorPhotoURL={video.authorPhotoURL} id={video.id} duration={video.duration} />
                        {user.uid === currentUser.uid ?
                            <div className={styles.optionsContainer}>
                                <p id={styles.editButton} onClick={() => onEditOpen(video)}>Edit</p>
                                <p id={styles.deleteButton} onClick={() => onDeleteOpen(video)}>Delete</p>
                            </div> : null}
                    </div>
                )) : <h1 className={styles.emptyContainerTitle}>No videos added yet</h1>}
            </TabPanel>
            {history ?
                <TabPanel value={value} index={1} className={classes.container}>
                    {history.length ? history.map(video => (
                        <VideoCard key={video.id} views={video.views} url={video.url} title={video.title} author={video.author} authorPhotoURL={video.authorPhotoURL} id={video.id} duration={video.duration} />
                    )) : <h1 className={styles.emptyContainerTitle}>Your history is empty</h1>}
                </TabPanel> : null}
            <TabPanel value={value} index={2} className={classes.container}>
                {liked && liked.length ? liked.map(video => (
                    <VideoCard key={video.id} url={video.url} views={video.views} title={video.title} author={video.author} authorPhotoURL={video.authorPhotoURL} id={video.id} duration={video.duration} />
                )) : <h1 className={styles.emptyContainerTitle}>Like some videos first</h1>}
            </TabPanel>
            <TabPanel value={value} index={3} className={classes.container}>
                {subscriptions.length ? <Carousel array={subscriptions} /> : <h1 className={styles.emptyContainerTitle}>Subscribe to some users first</h1>}
            </TabPanel>
            <FormDialog handleClose={handleCloseEdit} onEditClick={onEditClick} open={openEdit} video={video} />
            <AlertDialog handleClose={handleCloseAlert} onDeleteClick={onDeleteClick} open={openAlert} video={video} />
        </div>
    );
}
