import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { setAlertOff } from '../../redux/actions/alertNotifier';
import { getAlertMessage, getAlertStatus, getAlertType } from '../../redux/selectors/selectors';

export default function AlertNotifier() {
    const alertStatus = useSelector(getAlertStatus);
    const alertMessage = useSelector(getAlertMessage);
    const alertType = useSelector(getAlertType);
    const dispatch = useDispatch();

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAlertOff());
    };

    return (
        <>
            {alertStatus ?
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={alertStatus}
                    autoHideDuration={5000}
                    onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alertType}>{alertMessage}</Alert>
                </Snackbar> : null}
        </>
    )
}