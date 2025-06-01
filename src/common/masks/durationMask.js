const formatDuration = (durationInHours) => {
    const hours = Math.floor(durationInHours / 60);
    const minutes = durationInHours % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export default formatDuration;
