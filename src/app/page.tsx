import styles from "./page.module.css";
import { ReactElement } from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'

// Home Page !

function FeaturePanel(props: {title: string, icon: ReactElement, path: string}) {
  return (
    <Link href={props.path} className={styles.noDecoration}>
      <div className={styles.featurePanel}>
        <div className={styles.featureIcon}>{props.icon}</div>
        <div className={styles.featureTitle}>{props.title}</div>
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <div className={styles.pageBox}>
      <div className={styles.title}>Tarheel Compass</div>
      <div className={styles.subtitle}>Your one-stop shop for assistance in your Tarheel experience.</div>
      <div className={styles.featuresContainer}> 
        <FeaturePanel title="Plan Your Schedule" icon={<CalendarMonthIcon />} path="/schedule" />
        <FeaturePanel title="Search Classes" icon={<SearchIcon />} path="/search" />
        <FeaturePanel title="More Coming Soon" icon={<QuestionMarkIcon />} path="/coming-soon"/>
      </div>
    </div>
  )
}