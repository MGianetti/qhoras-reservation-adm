import { styled } from '@mui/material/styles';

import { Drawer, Divider } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

import CalendarSmall from './calendar-small';
import clsx from 'clsx';

const PREFIX = 'CalendarDrawer';
const drawerWidth = 260;

const classes = {
    hide: `${PREFIX}-hide`,
    drawer: `${PREFIX}-drawer`,
    drawerPaper: `${PREFIX}-drawerPaper`,
    drawerHeader: `${PREFIX}-drawerHeader`,
    calendarSmall: `${PREFIX}-calendarSmall`,
    miniCalendar: `${PREFIX}-miniCalendar`
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    [`& .${classes.hide}`]: {
        display: 'none'
    },

    [`&.${classes.drawer}`]: {
        width: drawerWidth,
        flexShrink: 0
    },

    [`& .${classes.drawerPaper}`]: {
        width: drawerWidth,
        position: 'relative',
        zIndex: 3,
        [theme.breakpoints.down('md')]: {
            borderRadius: 8
        }
    },

    [`& .${classes.drawerHeader}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },

    [`& .${classes.calendarSmall}`]: {
        marginTop: theme.spacing(4),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(4),
        marginLeft: theme.spacing(1),
        minHeight: 265,
        minWidth: 240,
        background: theme.palette.background.paper
    }
}));

const useStyles = makeStyles((theme) =>
    createStyles({
        miniCalendarOpen: {
            display: 'flex',
            [theme.breakpoints.down('md')]: {
                position: 'absolute',
                left: 30,
                boxShadow: '4px 7px 13px #dfdede, -6px -4px 15px #dfdede',
                borderRadius: 8
            }
        },
        miniCalendarClose: {
            [theme.breakpoints.down('md')]: {
                display: 'none'
            }
        }
    })
);

function CalendarDrawer(props) {
    const { open, miniCalendarOpen } = props;

    const classes2 = useStyles();

    return (
        <StyledDrawer
            // style={{display: 'flex'}}
            className={clsx({
                [classes2.miniCalendarOpen]: miniCalendarOpen,
                [classes2.miniCalendarClose]: !miniCalendarOpen
            })}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div className={classes.calendarSmall}>
                <CalendarSmall />
            </div>
            <Divider />
        </StyledDrawer>
    );
}

export default CalendarDrawer;
