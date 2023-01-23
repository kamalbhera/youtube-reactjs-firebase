// alert
export const getAlertState = state => state.alert;
export const getAlertStatus = state => getAlertState(state).isOpen;
export const getAlertType = state => getAlertState(state).type;
export const getAlertMessage = state => getAlertState(state).message;
// loading
export const getLoadingState = state => state.loading;
export const getIsLoading = state => getLoadingState(state).isLoading;
// user
export const getUser = state => state.user.user;
export const getUserLoading = state => state.user.isLoading;
export const getUserSubscribes = state => state.user.user.subscribes;
// videos
export const getVideos = state => state.videos.videos;