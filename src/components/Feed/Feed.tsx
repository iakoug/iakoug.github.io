import React from "react";
import { Link } from "gatsby";
import { Edge } from "@/types";
import Image from "gatsby-image";

import * as styles from "./Feed.module.scss";

type Props = {
  edges: Array<Edge>;
};

const Feed: React.FC<Props> = ({ edges }: Props) => {
  return (
    <div className={styles.feed}>
      {edges.map((edge) => {
        return (
          <div className={styles.item} key={edge.node.fields.slug}>
            {edge.node.frontmatter.cover && (
              <Link
                className={styles.link}
                to={edge.node.frontmatter?.slug || edge.node.fields.slug}
              >
                <Image
                  className={styles.cover}
                  fluid={edge.node.frontmatter.cover.childImageSharp.fluid}
                ></Image>
              </Link>
            )}

            <div className={styles.meta}>
              <time
                className={styles.time}
                dateTime={new Date(
                  edge.node.frontmatter.date,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              >
                {new Date(edge.node.frontmatter.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                  },
                )}
              </time>
              <span className={styles.divider} />
              <span className={styles.category}>
                <Link
                  to={edge.node.fields.categorySlug}
                  className={styles.link}
                >
                  {edge.node.frontmatter.category}
                </Link>
              </span>
            </div>
            <h2 className={styles.title}>
              <Link
                className={styles.link}
                to={edge.node.frontmatter?.slug || edge.node.fields.slug}
              >
                {edge.node.frontmatter.title}
                {edge.node.frontmatter.description && (
                  <span
                    style={{
                      fontWeight: 200,
                      fontSize: 20,
                    }}
                  >
                    &nbsp;{edge.node.frontmatter.description}
                  </span>
                )}
              </Link>
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
