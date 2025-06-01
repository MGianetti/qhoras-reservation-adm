import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
    createStyles({
        lineDivisorContainer: {
            borderTop: '1px solid #dadce0'
        },
        lineDivisor: {
            height: 60,
            '&:after': {
                content: "''",
                borderBottom: '1px solid #dadce0',
                position: 'absolute',
                width: '100%',
                marginTop: -1,
                zIndex: 1,
                pointerEvents: 'none'
            }
        },
        columnDivisor: {
            height: '100%',
            paddingLeft: 8,
            borderRight: '1px solid #dadce0'
        }
    })
);

function LineDivisor() {
    const classes = useStyles();

    return (
        <div className={classes.lineDivisorContainer}>
            {Array.from(Array(24).keys()).map((_, ix) => (
                <div key={`time-line-divisor-${ix}`} className={classes.lineDivisor} data-group="time-line" />
            ))}
        </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
}

export default LineDivisor;
