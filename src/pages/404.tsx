import React from "react";

import { Layout } from "@/components/Layout";
import { Meta } from "@/components/Meta";
import { Page } from "@/components/Page";
import { useSiteMetadata } from "@/hooks";

const NotFount: React.FC = () => {
  return (
    <Layout>
      <Page title="404 Not found">
        <p>Let me share a recurring nightmare I have with you. </p>
        <p>
          In this dream, I was walking alone in the dark on a road without
          return. There were no signs on the road. Endless time to the end of
          the road, abyss ahead was dark and silent. Wenn du lange in einen
          Abgrund blickst, blickt der Abgrund auch dich hinein... So I jumped
          down like this with endless falling, circling...
        </p>
        <p>
          That's the good version of the dream. In the other one, there's just
          ... screaming. And darkness.
        </p>
      </Page>
    </Layout>
  );
};

export const Head: React.FC = () => {
  const { title, subtitle } = useSiteMetadata();
  const pageTitle = `404 - ${title}`;

  return <Meta title={pageTitle} description={subtitle} />;
};

export default NotFount;
