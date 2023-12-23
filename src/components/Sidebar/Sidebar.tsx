import React from "react";

// import { Contacts } from "./Contacts";
// import { Copyright } from "./Copyright";
// import { Menu } from "./Menu";

import * as styles from "./Sidebar.module.scss";

// type Props = {
//   isIndex?: boolean;
// };

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.inner}>
        {/* <Menu menu={menu} /> */}
        {/* <Contacts contacts={author.contacts} />
        <Copyright copyright={copyright} /> */}
      </div>
    </div>
  );
};

export default Sidebar;
