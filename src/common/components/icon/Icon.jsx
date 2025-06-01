import icons from '../../../assets/icons';
import styles from './Icon.module.scss';

const Icon = ({ name, width, height, color, ...props }) => {
    const src = icons[name];

    return <img className={styles.icon} src={src} alt="Icon" style={{ width, height, fill: color }} {...props} />;
};

export default Icon;
