// react
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
// service
import { deleteNotificationsOlderThanTwoHours } from './service/service';
import { auth } from './service/firebase';
// utils
import { changeThemeColors } from './utils';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from './redux/actions/user';
import { getUser, getIsLoading } from './redux/selectors/selectors';
import { fetchTheme } from './redux/actions/theme';
import { fetchVideos } from './redux/actions/videos';
// components
import SignUp from './components/SignUp/SignUp';
import ErrorPage from './components/ErrorPage/ErrorPage';
import VideoPage from './components/VideoPage/VideoPage';
import SignIn from './components/SignIn/SignIn';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SignOut from './components/SignOut/SignOut';
import UploadVideo from './components/UploadVideo/UploadVideo';
import Search from './components/Search/Search';
import UserProfile from './components/UserProfile/UserProfile';
import TrendingVideos from './components/TrendingVideos/TrendingVideos';
import History from './components/History/History';
import VoiceControl from './components/VoiceControl/VoiceControl';
import ProgressBar from './components/ProgressBar/ProgressBar';
import HomePage from './components/HomePage/HomePage';
import AlertNotifier from './components/common/AlertNotifier';
import Library from './components/LibraryPage/LibraryPage';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Header from './components/Header/Header';

export default function App() {
  const user = useSelector(getUser);
  const isLoading = useSelector(getIsLoading);
  const dispatch = useDispatch();

  // Initial load of the current user and all videos
  useEffect(() => {
    dispatch(fetchVideos());
    auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  // Initial load of the theme
  useEffect(() => {
    if (user) {
      changeThemeColors(user.theme);
    } else {
      changeThemeColors('dark');
    }
    dispatch(fetchTheme());
  }, [user, dispatch]);

  return (
    <Router>
      <VoiceControl />
      <AlertNotifier />
      <ProgressBar isOn={isLoading} />
      <Switch>
        <Route exact path='/' >
          <Header />
          <HomePage />
        </Route>
        <Route path='/video/:id'>
          <Header />
          <VideoPage />
        </Route>
        <Route path='/search/:id'>
          <Header />
          <Search />
        </Route>
        <Route exact path='/search'>
          <Redirect to='/' />
        </Route>
        <Route path='/upload'>
          <UploadVideo />
        </Route>
        <Route path='/user/:id'>
          <Header />
          <UserProfile />
        </Route>
        <Route path='/library'>
          <Header />
          <Library />
        </Route>
        <Route path='/trending'>
          <Header />
          <TrendingVideos />
        </Route>
        <Route path='/history'>
          <Header />
          <History />
        </Route>
        <Route path='/subscriptions'>
          <Header />
          <Subscriptions />
        </Route>
        <Route path='/signout' >
          {auth.currentUser && user ? <SignOut /> : <Redirect to='/' />}
        </Route>
        <Route path='/signup'>
          {auth.currentUser && user ? <Redirect to='/' /> : <SignUp />}
        </Route>
        <Route path='/signin' >
          {auth.currentUser && user ? <Redirect to='/' /> : <SignIn />}
        </Route>
        <Route path='/reset' >
          {auth.currentUser && user ? <Redirect to='/' /> : <ResetPassword />}
        </Route>
        <Route exact path='/auto-delete-notifications'>
          {deleteNotificationsOlderThanTwoHours()}
        </Route>
        <Route path='*'>
          <ErrorPage />
        </Route>
      </Switch>
    </Router >
  );
}