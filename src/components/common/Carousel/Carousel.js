// react
import styles from './Carousel.module.scss';
// redux
import { useSelector } from 'react-redux';
import { getUser, getUserLoading } from '../../../redux/selectors/selectors';
// components
import VideoCard from '../../VideoCard/VideoCard';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  root: {
    padding: '0',
    overflow: 'auto',
    fontSize: 'inherit',
    maxWidth: 'none',
    textAlign: 'left',
    lineHeight: 'initial',
    whiteSpace: 'initial',
    letterSpacing: 'initial',
    textTransform: 'initial',
    fontWeight: 'initial',
    color: 'var(--bg-color-32)'
  },
  label: {
    color: 'var(--t-color)'
  }
});

export default function Carousel({ array, emptyPage, noLoggedInUserPage, title }) {
  const classes = useStyles();
  const user = useSelector(getUser);
  const isUserLoading = useSelector(getUserLoading);

  return (
    <>
      {isUserLoading && <h1 className={styles.welcomeText}>Loading...</h1>}
      {user && (<div className={styles.playlistsContainer}>
        {array && array.length ? array.map((element, index) => (
          <AppBar position="static" color="default" key={index}>
            <div className={styles.playlistName}>{element.name ? element.name.toUpperCase() : element.author.toUpperCase()}</div>
            <Tabs
              value={false}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              key={element.id}
            >
              {element.videos.length ? element.videos.map((video, index) => (
                <Tab
                  classes={{
                    root: classes.root
                  }}
                  key={video.id}
                  label={
                    <VideoCard url={video.url} title={video.title} key={video.id} views={video.views}
                      author={video.author} authorPhotoURL={video.authorPhotoURL} id={video.id} />} {...a11yProps(index)} />
              )) : <Tab className={classes.label} label="The playlist is empty..." {...a11yProps(0)} />}
            </Tabs>
          </AppBar>
        )) : emptyPage}
      </div>)}
      {!isUserLoading && !user && noLoggedInUserPage}
    </>
  );
}