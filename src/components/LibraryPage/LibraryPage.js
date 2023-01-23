// react
import { useEffect, useState } from 'react';
import styles from './LibraryPage.module.scss';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
// components
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Carousel from '../common/Carousel/Carousel';
import GuestHeader from '../common/GuestHeader/GuestHeader';
import { getUserPlaylists } from '../../service/service';
import Layout from '../Layout/Layout';

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState([]);
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getUserPlaylists(user.uid)).then(res => setPlaylists(res));
    }
  }, [user]);

  const emptyPlaylistPage = (
    <div className={styles.emptyPage}>
      <VideoLibraryIcon />
      <h2>Your library is empty for now</h2>
      <h2>Enjoy your favorite videos</h2>
      <h5>Go and find whatever you like</h5>
    </div>
  );

  const noLoggedInUserPage = (
    <div className={styles.emptyPage}>
      <VideoLibraryIcon />
      <h2>Enjoy your favorite videos!</h2>
      <h5>Sign in to access videos that you've liked or saved</h5>
      <div className={styles.signIn} > <GuestHeader /></div>
    </div>
  );

  return (
    <Layout>
      {playlists.length && user && <h1 className={styles.welcomeText}>Your playlists</h1>}
      <div className={styles.carouselContainer}>
        <Carousel array={playlists} emptyPage={emptyPlaylistPage} noLoggedInUserPage={noLoggedInUserPage} />
      </div>
    </Layout>
  );
}