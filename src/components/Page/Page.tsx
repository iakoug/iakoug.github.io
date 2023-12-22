import React, { useEffect, useRef } from "react";

import type { Nullable } from "@/types";

import * as styles from "./Page.module.scss";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children }: Props) => {
  const pageRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <div>
        {title && <h1>{title}</h1>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Page;
