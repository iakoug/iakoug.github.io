import React from "react";

import type { Node } from "@/types";

import { Comments } from "./Comments";
import { Content } from "./Content";
import { Meta } from "./Meta";
import { Tags } from "./Tags";

import * as styles from "./Post.module.scss";

interface Props {
  post: Node;
}

const Post: React.FC<Props> = ({ post }: Props) => {
  const { html } = post;
  const { tagSlugs } = post.fields;
  const { tags, title, date } = post.frontmatter;

  return (
    <div className={styles.post}>
      <div className={styles.content}>
        <Content body={html} title={title} frontmatter={post.frontmatter} />
      </div>

      <div className={styles.footerWrapper}>
        <div className={styles.footer}>
          👾
          <Meta date={date} />
          {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        </div>
      </div>

      <div className={styles.comments}>
        <Comments />
      </div>
    </div>
  );
};

export default Post;
