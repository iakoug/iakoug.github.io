import React, { useEffect } from "react";
import { useTheme } from "@/hooks";
import { Author } from "../Sidebar/Author";
import { useSiteMetadata } from "@/hooks";

import * as styles from "./Layout.module.scss";
import { Link } from "gatsby-link";

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
      <Author author={author} isIndex />
      {children}
      <div className={styles.footer}>
        <Link to="/list">
          <span className={styles.copyRight}>
            © 2016-{new Date().getFullYear()} All rights reserved.
          </span>
        </Link>
        &nbsp; Visit&nbsp;
        <Link target="__blank" to="https://home.iakoug.cn">
          <span>Home Site.</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
