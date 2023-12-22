import React from "react";

import * as styles from "./Page.module.scss";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children }: Props) => {
  return (
    <div className={styles.page}>
      <div>
        {title && <h1>{title}</h1>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Page;
