import format from 'date-fns/format';
import en from 'date-fns/locale/en-US';

import styles from './styles.module.scss';

export function Header() {
    const currentDate = format(new Date, 'EEEE, MMM d', { locale: en });

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr" />
            <p>The best one to hear. Ever.</p>
            <span>{currentDate}</span>
        </header>
    );
}