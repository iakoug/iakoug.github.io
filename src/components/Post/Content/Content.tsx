import React from "react";
import Image from "gatsby-image";
import Frontmatter from "src/types/frontmatter";

import * as styles from "./Content.module.scss";

interface Props {
  title: string;
  body: string;
  frontmatter: Frontmatter;
}

const Content: React.FC<Props> = ({ body, title, frontmatter }: Props) => {
  return (
    <div className={styles.content}>
      <div className={styles.info}>
        <div className={styles.time}>
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.description}>{frontmatter.description}</div>
      </div>
      <Image
        className={styles.cover}
        fluid={frontmatter.cover.childImageSharp.fluid}
      />
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
};

export default Content;
