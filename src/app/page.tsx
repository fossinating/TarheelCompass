/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import { ReactElement } from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link'
import Image from "next/image";

// Home Page !

export default function Page() {
  return (
      <div className={styles.pageBox}>
        {/* eslint-disable-next-line jsx-a11y/alt-text*/}
        <img className={styles.backgroundImage} src={"/backgrounds/IMG_3213.webp"}/>
        <div className={styles.pageContent}>
          <div className={styles.textSection}>
            <div className={styles.line_one}>Your guide to</div>
            <div className={styles.line_two}>a simpler class registration</div>
            <Link href={"/schedule"} className={styles.cta_button}>Get Started</Link>
          </div>
          <div className={styles.hero_img}>
            <img src="/hero_image.webp" alt="Picture of an example schedule"/>
          </div>
        </div>
      </div>
  )
}