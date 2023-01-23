export const LOADING = 'LOADING';
export const NOT_LOADING = 'NOT_LOADING';

export const setLoading = () => ({
    type: LOADING,
});

export const setNotLoading = () => ({
    type: NOT_LOADING,
});