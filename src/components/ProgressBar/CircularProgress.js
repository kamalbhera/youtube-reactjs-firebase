import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Typography, Box } from '@material-ui/core';

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

export default function CircularStatic({ percentage }) {
    const [progress, setProgress] = useState(percentage);
    useEffect(() => {
        setProgress(percentage)
    }, [percentage]);

    return <CircularProgressWithLabel value={progress} />;
}