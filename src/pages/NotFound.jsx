import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import styles from './NotFound.module.css'

export default function NotFound() {
  const { t, lang } = useLang()
  return (
    <div className={styles.page}>
      <div className={`${styles.card} glass`}>
        <span className={styles.code}>404</span>
        <h1>{t.general.not_found}</h1>
        <p>{lang === 'fr' ? 'La page que vous cherchez n\'existe pas.' : 'The page you are looking for does not exist.'}</p>
        <Link to="/" className={styles.btn}>{t.general.back_home}</Link>
      </div>
    </div>
  )
}
