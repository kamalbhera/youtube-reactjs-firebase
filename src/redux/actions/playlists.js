import { db } from '../../service/firebase';

export const SHOW_PLAYLISTS = 'SHOW_PLAYLISTS';

const showPlaylists = (playlists) => ({
    type: SHOW_PLAYLISTS,
    payload: playlists
});

export const getPlaylists = (userID) => {
    return function (dispatch) {
        db.collection('playlists').where('authorID', '==', userID).onSnapshot(snapshot => {
            const playlists = snapshot.docs.map(doc => ({ ...doc.data() }));
            dispatch(showPlaylists(playlists));
        })
    }
};