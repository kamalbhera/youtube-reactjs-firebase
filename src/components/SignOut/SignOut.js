import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { setAlertOn } from '../../redux/actions/alertNotifier';
import { auth } from '../../service/firebase';

export default function SignOut() {
    const dispatch = useDispatch();
    const history = useHistory();
    auth.signOut();
    dispatch(logout());
    history.replace('/');
    dispatch(setAlertOn('success', 'Successfully signed out'));
    return null;
}
