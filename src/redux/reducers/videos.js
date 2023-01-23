import { FETCH_VIDEOS_SUCCEEDED, FETCH_VIDEOS_REQUESTED, FETCH_MY_VIDEOS_SUCCEEDED } from '../actions/videos';

const INITIAL_STATE = {
    videos: [],
    myVideos: [],
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_VIDEOS_REQUESTED:
            return {
                ...state,
            };
        case FETCH_VIDEOS_SUCCEEDED:
            return {
                ...state,
                videos: action.payload,
            };
        case FETCH_MY_VIDEOS_SUCCEEDED:
            return {
                ...state,
                myVideos: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
