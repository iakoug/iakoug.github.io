import React, { useEffect } from "react";
import { useTheme } from "@/hooks";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  const [{ mode }] = useTheme();

  useEffect(() => {
    document.documentElement.className = mode;
  }, [mode]);

  return <div>{children}</div>;
};

export default Layout;
