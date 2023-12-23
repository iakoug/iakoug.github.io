import React from "react";

import { Link } from "gatsby";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

import * as styles from "./Author.module.scss";

type Props = {
  author: {
    name: string;
    bio: string;
    photo: string;
  };
  isIndex?: boolean;
  className?: string
};

const Author = ({ author, isIndex, className }: Props) => (
  <div>
    <div className={[styles.author, className || ''].join(' ')}>
      <div className={styles.titleContainer}>
        {isIndex ? (
          <h1 className={styles.title}>
            <Link className={styles.link} to="/">
              {author.name}
            </Link>
          </h1>
        ) : (
          <h2 className={styles.title}>
            <Link className={styles.link} to="/">
              {author.name}
            </Link>
          </h2>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  </div>
);

export default Author;
