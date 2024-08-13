import * as React from 'react';
import styles from "./Button.module.css";

export default function Button(props: {onClick: Function, children: React.ReactNode}) {
  
    return (
        <div className={styles.button}>
            {props.children}
        </div>
    )
}