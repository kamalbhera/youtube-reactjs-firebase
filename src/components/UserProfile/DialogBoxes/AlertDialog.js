import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import styles from './Dialogs.module.scss';

export default function AlertDialog({ handleClose, onDeleteClick, open, video }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className={styles.formDialog}>
                <DialogTitle id="alert-dialog-title">Are you sure about deleting this video?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {video ? video.title : null}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => onDeleteClick(video)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}