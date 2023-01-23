import { db } from './firebase';
import firebase from 'firebase/app';
import { generateId } from '../utils';
import { setAlertOn } from '../redux/actions/alertNotifier';
import { setLoading, setNotLoading } from '../redux/actions/loadingBar';

// NOTIFICATIONS
export function setNotificationsRead() {
    db.collection('notifications')
        .get()
        .then(res => res.docs.map(el => el.data()))
        .then(res => {
            res.forEach(el => {
                db.collection('notifications').doc(el.notID).update({ isRead: true });
            });
        })
        .catch(err => console.log('error', err.message));
}

export function updateNotifications(video, user, status) {
    const id = generateId();
    const now = Date.now();
    const notificationsData = {
        notID: id,
        videoID: video ? video.id : null,
        videoTitle: video ? video.title : null,
        status: status,
        userID: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        time: now,
        isRead: false
    }
    db.collection('notifications').doc(id).set(notificationsData)
        .catch(err => console.log('error', err.message));
}

export const deleteNotification = (id) => {
    db.collection('notifications').doc(id).delete();
};

export function deleteNotificationsOlderThanTwoHours() {
    const ref = db.collection('notifications');
    const now = Date.now();
    const cutoff = now - 2 * 60 * 60 * 1000;
    ref.orderBy('time').endAt(cutoff).limitToLast(1).get()
        .then(res => res.docs.map(el => el.data()))
        .then(res => res.forEach(doc => {
            if (doc.isRead) {
                ref.doc(doc.notID).delete();
            }
        }))
        .catch(err => console.log(err));
}

// COMMENTS
export function createComment(videoID, user, inputValue) {
    const id = generateId();
    const commentData = {
        commentID: id,
        videoID: videoID,
        comment: inputValue,
        userID: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        isEdit: false
    }
    db.collection('comments').doc(id).set(commentData)
        .catch(err => console.log('error', err.message));
}

export function deleteComment(id) {
    db.collection('comments').doc(id).delete();
}

export function updateComment(id, value) {
    db.collection('comments').doc(id).update({ comment: value, isEdit: false });
}

export function editableComment(id) {
    db.collection('comments').doc(id).update({ isEdit: true });
}

export function uneditableComment(id) {
    db.collection('comments').doc(id).update({ isEdit: false });
}

// PLAYLISTS
export const createPlaylist = (user, inputValue) => {
    return function (dispatch) {
        const id = generateId();
        const data = {
            id: id,
            name: inputValue,
            authorID: user.uid,
            videos: []
        };

        db.collection('playlists')
            .doc(id)
            .set(data)
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
};

export const addVideoToPlaylist = (video, playlist) => {
    return function (dispatch) {
        db.collection('playlists')
            .doc(playlist.id)
            .update({
                videos: firebase.firestore.FieldValue.arrayUnion(video.id)
            })
            .then(() => dispatch(setAlertOn('info', `Added to ${playlist.name}`)))
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
};

export const removeVideoFromPlaylist = (video, playlist) => {
    return function (dispatch) {
        db.collection('playlists')
            .doc(playlist.id)
            .update({
                videos: firebase.firestore.FieldValue.arrayRemove(video.id)
            })
            .then(() => dispatch(setAlertOn('info', `Removed from ${playlist.name}`)))
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
};

export const deletePlaylist = (id) => {
    db.collection('playlists').doc(id).delete();
};

export const getUserPlaylists = (userId) => {
    return function (dispatch, getState) {
        return db.collection('playlists').where('authorID', '==', userId).get()
            .then(res => res.docs.map(doc => ({ ...doc.data() })))
            .then(playlists => {
                return playlists.map(playlist => {
                    return { ...playlist, videos: playlist.videos.map(el => getState().videos.videos.find(video => video.id === el)) }
                });
            })
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
}

// VIDEOS

export function filterVideos(params) {
    if (!params.length) return null;
    if (params.length === 1) {
        return db.collection('videos').get()
            .then(res => res.docs)
            .then(res => res.map(x => x.data()))
            .then(res => {
                const result = res.filter(el => el.title.toLowerCase().includes(params[0]));
                return result;
            })
            .catch(err => console.log('error', err.message));
    } else {
        return db.collection('videos').get()
            .then(res => res.docs)
            .then(res => res.map(x => x.data()))
            .then(res => {
                let filtered = res;
                params.forEach(word => {
                    if (word !== ' ') {
                        filtered = filtered.filter(el => el.title.toLowerCase().includes(word));
                    }
                });

                return filtered;
            })
            .catch(err => console.log('error', err.message));
    }
}

export function getVideosByTitle(title) {
    return db.collection('videos').get()
        .then(res => res.docs)
        .then(res => res.map(doc => doc.data()))
        .then(res => {
            if (title) {
                return res.filter(doc => doc.title.match(title));
            } else {
                return res;
            }
        })
        .then(res => res.map(({ title, id }) => ({ title, id })))
}

export function likeOrDislikeVideo(user, video, condition) {
    if (!user) {
        return;
    }
    const isLiked = video.isLikedBy.some(id => id === user.uid);
    const isDisliked = video.isDislikedBy.some(id => id === user.uid);
    if ((isLiked && condition === 'like') || (isDisliked && condition === 'dislike')) {
        return;
    }

    if (isLiked) {
        const filterLikes = video.isLikedBy.filter(id => id !== user.uid);
        db.collection('videos').doc(video.id).update({ isLikedBy: filterLikes, isDislikedBy: [...video.isDislikedBy, user.uid] })
    } else {
        const filterDislikes = video.isDislikedBy.filter(id => id !== user.uid);
        db.collection('videos').doc(video.id).update({ isDislikedBy: filterDislikes, isLikedBy: [...video.isLikedBy, user.uid] })
        updateNotifications(video, user, 'like');
    }
}

export const editVideo = (video, title, description) => {
    return function (dispatch) {
        const obj = { ...video, title, description }
        dispatch(setLoading());
        db.collection('videos')
            .doc(video.id)
            .update(obj,
                (error) => {
                    if (error) {
                        dispatch(setAlertOn('error', error.message));
                    }
                }).then(() => {
                    dispatch(setAlertOn('success', 'Video successfully updated'));
                })
            .catch(err => dispatch(setAlertOn('error', err.message)))
            .finally(() => dispatch(setNotLoading()));
    }
};

export const deleteVideo = (video) => {
    return function (dispatch) {
        dispatch(setLoading());
        db.collection('videos')
            .doc(video.id)
            .delete()
            .then(() => dispatch(setAlertOn('success', 'Video successfully deleted')))
            .catch(err => dispatch(setAlertOn('error', err.message)))
            .finally(() => dispatch(setNotLoading()));
    }
};

export const increaseViews = (video) => {
    return function (dispatch, getState) {
        const user = getState().user.user;
        const isWatchedBy = video.isWatchedBy;
        if (user) {
            if (!isWatchedBy.includes(user.uid)) {
                isWatchedBy.push(user.uid);
            }
        }

        db.collection('videos')
            .doc(video.id)
            .update({ views: video.views + 1, isWatchedBy: isWatchedBy })
            .catch(err => dispatch(setAlertOn('error', err.message)));
    }
};

// THEME
export function updateUserTheme(user, theme) {
    db.collection('users').doc(user.uid).update({ theme: theme })
}

// USER
export function getUserInfo(id) {
    return db.collection('users').doc(id).get().then(res => res);
}

// SUBSCRIBES
export function subscribe(user, video) {
    return function (dispatch) {
        return db.collection('users')
            .doc(user.uid)
            .update({
                subscribes: firebase.firestore.FieldValue.arrayUnion(video.authorID)
            })
            .then(() => {
                dispatch(setAlertOn('success', `You successfully subscribed to ${video.author}`))
                updateNotifications(null, user, 'subscribes for your channel');
            })
            .catch(err => dispatch(setAlertOn('success', err.message)));
    }
}

export function unsubscribe(user, video) {
    return function (dispatch) {
        return db.collection('users')
            .doc(user.uid)
            .update({
                subscribes: firebase.firestore.FieldValue.arrayRemove(video.authorID)
            })
            .then(() => {
                dispatch(setAlertOn('success', `You successfully unsubscribed from ${video.author}`))
            })
            .catch(err => dispatch(setAlertOn('success', err.message)));
    }
}

export function getUserSubscriptions(userId, videos) {
    return db.collection('users').doc(userId).get()
        .then(res => res.data().subscribes)
        .then(res => {
            const userSubscribes = [];
            res.forEach(el => {
                const filterVideos = videos.filter(video => video.authorID === el);
                userSubscribes.push({ author: filterVideos[0].author, videos: filterVideos });
            });
            return userSubscribes;
        });
}

export function isSubscribed(user, video) {
    return db.collection('users').doc(user.uid).get()
        .then(res => res.data().subscribes)
        .then(res => res.includes(video.authorID));
}