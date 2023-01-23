// react
import { useState } from 'react';
import styles from './Dialogs.module.scss';
// redux
import { useDispatch } from 'react-redux';
import { setAlertOn } from '../../../redux/actions/alertNotifier';
// components
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { TextField } from '@material-ui/core';

export default function FormDialog({ handleClose, onEditClick, open, video }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const onSubmit = () => {
        if (!title.trim()) {
            return dispatch(setAlertOn('error', 'Please add a title!'));
        } else if (!description.trim()) {
            return dispatch(setAlertOn('error', 'Please add a description!'));
        } else if (description.trim().length < 10) {
            return dispatch(setAlertOn('error', 'The description must be atleast 10 characters'));
        }

        setTitle('');
        setDescription('');
        onEditClick(title, description);
    };

    const onTitleChange = (e) => {
        e.preventDefault();
        setTitle(e.target.value);
    };

    const onDescriptionChange = (e) => {
        e.preventDefault();
        setDescription(e.target.value);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="dialogTitle"
        >
            <div className={styles.formDialog}>
                <DialogTitle id="dialogTitle">
                    Update this video?
                </DialogTitle>
                <DialogContent>
                    Old title:
                    <DialogContentText>
                        {video ? video.title : null}
                    </DialogContentText>
                        Old description:
                    <DialogContentText>
                        {video ? video.description : null}
                    </DialogContentText>
                </DialogContent>
                <div className={styles.inputs}>
                    <TextField required type="text" size="small" label="New title" variant="outlined" value={title} onChange={(e) => onTitleChange(e)} className={styles.input} />
                    <TextField required className={styles.input} type="text" size="medium" label="New description" variant="outlined" value={description} onChange={(e) => onDescriptionChange(e)} />
                </div>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                        handleClose();
                        setTitle('');
                        setDescription('');
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}