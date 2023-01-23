// react
import { useState } from 'react';
import { useHistory } from 'react-router';
import styles from './VoiceControl.module.scss';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/selectors/selectors';
import { setLoading, setNotLoading } from '../../redux/actions/loadingBar';
// components
import MicIcon from '@material-ui/icons/Mic';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const recognition = new SpeechRecognition();

export default function VoiceControl() {
  const [isListening, setListening] = useState(false);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const history = useHistory();

  recognition.lang = 'en-US';

  const activeMicr = () => {
    dispatch(setLoading());
    recognition.start();
    setListening(true);
  };

  recognition.onend = () => {
    dispatch(setNotLoading());
    setListening(false);
  };

  recognition.onresult = (e) => {
    const command = e.results[0][0].transcript;
    if (command.includes('home') || command.includes('go to home') || command.includes('back to home') || command.includes('home page')) {
      history.push('/');
    } else if (command.includes('login') || command.includes('sign in') || command.includes('go to sign in') || command.includes('back to sign in') || command.includes('sign in page')) {
      history.push('/signin');
    } else if (command.includes('register') || command.includes('sign up') || command.includes('go to sign up') || command.includes('back to sign up') || command.includes('sign up page')) {
      history.push('/signup');
    } else if (command.includes('upload') || command.includes('go to upload') || command.includes('back to upload') || command.includes('upload page')) {
      history.push('/upload');
    } else if (command.includes('subscribe') || command.includes('subscription') || command.includes('subscribes')) {
      history.push('/subscriptions');
    } else if (command.includes('library') || command.includes('playlists') || command.includes('playlist') || command.includes('my videos')) {
      history.push('/library');
    } else if (command.includes('history') || command.includes('history page') || command.includes('history section') || command.includes('watched')) {
      history.push('/history');
    } else if (command.includes('profile') || command.includes('my profile') || command.includes('profile page') || command.includes('my page')) {
      history.push(`user/${user.uid}`);
    } else if (command.includes('trending') || command.includes('trending page') || command.includes('trending videos')) {
      history.push('/trending');
    } else {
      let value = command.trim().split(' ').map(el => el.toLowerCase().trim()).join('+');
      if (value.length) {
        history.push('/search/' + value);
      }
    }
  };

  return (
    <div onClick={activeMicr} className={isListening ? styles.listening : styles.notListening}>
      <MicIcon />
    </div>
  )
}