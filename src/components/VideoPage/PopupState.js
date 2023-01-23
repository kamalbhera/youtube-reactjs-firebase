import { Link } from 'react-router-dom';
import styles from './VideoPage.module.scss';
import { Typography, Box, Popover } from '@material-ui/core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

export default function Popup({ content, button, text }) {
    return (
        <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
                <div>
                    <div variant="contained" {...bindTrigger(popupState)}>
                        {button}
                    </div>
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2} className={styles.messageContainer}>
                            <Typography>
                                <p>{content}</p>
                                <p className={styles.info}>{text}</p>
                                <Link to="/signin" className={styles.signin}>SIGN IN</Link>
                            </Typography>
                        </Box>
                    </Popover>
                </div>
            )}
        </PopupState>
    );
}