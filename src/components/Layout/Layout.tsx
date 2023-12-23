import React, { useEffect } from "react";
import { useTheme } from "@/hooks";
import { Author } from "../Sidebar/Author";
import { useSiteMetadata } from "@/hooks";

import * as styles from "./Layout.module.scss";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  const [{ mode }] = useTheme();
  const { author } = useSiteMetadata();

  useEffect(() => {
    document.documentElement.className = mode;
  }, [mode]);

  return (
    <div>
      <Author className={styles.author} author={author} isIndex />
      {children}
      <div className={styles.footer}>
        © 2016-{new Date().getFullYear()} All rights reserved.
      </div>
    </div>
  );
};

export default Layout;
