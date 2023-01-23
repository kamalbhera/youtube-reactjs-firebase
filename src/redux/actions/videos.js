import { db } from '../../service/firebase';
import { setLoading, setNotLoading } from '../actions/loadingBar';

export const FETCH_VIDEOS_SUCCEEDED = 'FETCH_VIDEOS_SUCCEEDED';
export const FETCH_VIDEOS_REQUESTED = 'FETCH_VIDEOS_REQUESTED';
export const FETCH_MY_VIDEOS_SUCCEEDED = 'FETCH_MY_VIDEOS_SUCCEEDED';

export const fetchVideosRequested = () => ({
    type: FETCH_VIDEOS_REQUESTED,
});

export const fetchVideosSucceeded = (videos) => ({
    type: FETCH_VIDEOS_SUCCEEDED,
    payload: videos,
});

export const fetchVideos = () => {
    return function (dispatch) {
        dispatch(setLoading());
        dispatch(fetchVideosRequested());
        db.collection('videos').onSnapshot(snapshot => {
            let dbVideos = [];
            snapshot.docs.map(doc => (dbVideos.push({ ...doc.data() })))
            dispatch(fetchVideosSucceeded(dbVideos));
            dispatch(setNotLoading());
        })
    }
};