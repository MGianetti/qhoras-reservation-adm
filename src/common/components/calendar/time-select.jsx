import { useState, useEffect, useMemo, useRef } from 'react';

import { makeStyles, useTheme } from '@mui/styles';

import { Typography, NoSsr, TextField } from '@mui/material';

import PropTypes from 'prop-types';
import { createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const timeRefExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

const useStyles = makeStyles(() => ({
    valueContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    select: {
        minWidth: 60,
        '&:hover': {
            backgroundColor: '#f5f5f5'
        }
    }
}));

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} style={{ padding: '9px 14px' }} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps
                }
            }}
            {...props.selectProps.TextFieldProps}
        />
    );
}

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired
};

function SingleValue(props) {
    return (
        <Typography style={{ lineHeight: 'initial' }} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired
};

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired
};

const components = {
    Control,
    SingleValue,
    ValueContainer,
    animatedComponents
};

function TimeSelect(props) {
    const classes = useStyles();
    const theme = useTheme();

    const {
        isClearable = false,
        showDropDownIndicator = false,
        allowMulti = false,
        allowSearch = true,
        placeholder = 'Please select',
        required = true,
        options = null,
        originalValue = null,
        length = 5,
        matchFrom = 'start',
        onChange = () => {}
    } = props;

    const [timeValue, setTimeValue] = useState(originalValue || 0);
    const [findElement, setFindElement] = useState(false);

    useEffect(() => {
        if (findElement) {
            const firstTimeElement = document.querySelector('#' + refMenu.current.inputRef.id.replace('input', 'option-0'));

            const selected = firstTimeElement && [...firstTimeElement.parentElement.children].find((el) => el.innerHTML === timeValue.value);
            selected && selected.scrollIntoView();
            setFindElement(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [findElement]);

    useEffect(() => {
        setTimeValue(originalValue);
    }, [originalValue]);

    const refMenu = useRef();

    return useMemo(() => {
        const handleChange = (newValue) => {
            setTimeValue(newValue);
            onChange(newValue);
        };
        const handleInputChange = (inputValue) => {
            if (inputValue.length > length) {
                return inputValue.substr(0, 5);
            }

            if ((isNaN(inputValue) && Array.from(inputValue).find((char) => isNaN(char) && char !== ':')) || Array.from(inputValue).filter((char) => char === ':').length > 1) {
                const newInputValue = Array.from(inputValue)
                    .filter((value) => !isNaN(value))
                    .join('');
                return newInputValue;
            }
        };
        const formatCreateLabel = (inputValue) => {
            return inputValue;
        };
        const handleNewOptionValidate = (inputValue) => {
            const isNew = timeRefExp.test(inputValue) && !options.find((cTime) => cTime.value === inputValue) ? true : false;
            return isNew;
        };

        const selectStyles = {
            input: (base) => ({
                ...base,
                color: theme.palette.primary.main,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
                '& input': {
                    font: 'inherit'
                }
            }),
            menuPortal: (base) => ({ ...base, zIndex: 10000, minWidth: 80 }),

            dropdownIndicator: (base) => ({
                ...base,
                display: showDropDownIndicator ? 'initial' : 'none'
            }),

            indicatorSeparator: (base) => ({
                ...base,
                display: showDropDownIndicator ? 'initial' : 'none'
            })
        };

        return (
            <>
                <NoSsr>
                    <CreatableSelect
                        ref={refMenu}
                        classes={classes}
                        className={classes.select}
                        styles={selectStyles}
                        components={components}
                        options={options}
                        defaultValue={originalValue}
                        value={timeValue}
                        isClearable={isClearable}
                        isMulti={allowMulti}
                        isSearchable={allowSearch}
                        menuPortalTarget={document.body}
                        menuPlacement={'auto'}
                        required={required}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onInputChange={handleInputChange}
                        formatCreateLabel={formatCreateLabel}
                        isValidNewOption={handleNewOptionValidate}
                        filterOption={createFilter({ matchFrom: matchFrom })}
                        onMenuOpen={() => {
                            setFindElement(true);
                        }}
                    />
                </NoSsr>
            </>
        );
    }, [originalValue, timeValue, allowMulti, allowSearch, classes, isClearable, length, matchFrom, onChange, options, placeholder, required, showDropDownIndicator, theme]);
}

export default TimeSelect;
