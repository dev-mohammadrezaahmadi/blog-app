import styles from "../styles/Loader.module.css";

interface LoaderProps {
	show: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show }) => {
	return show ? <div className={`${styles.loader} animate-spin`}></div> : null;
};

export default Loader;
