import React from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/Feed";
import { Layout } from "@/components/Layout";
import { Meta } from "@/components/Meta";
import { Page } from "@/components/Page";
import { useSiteMetadata } from "@/hooks";
import { AllMarkdownRemark, PageContext } from "@/types";

interface Props {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: PageContext;
}

const List: React.FC<Props> = ({ data, pageContext }: Props) => {
  const { group } = pageContext;
  const { edges } = data.allMarkdownRemark;

  return (
    <Layout>
      <Page title={group}>
        <Feed edges={edges} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  fragment Cover on File {
    childImageSharp {
      fluid(
        maxWidth: 1200
        maxHeight: 500
        pngCompressionSpeed: 8
        cropFocus: CENTER
      ) {
        base64
        aspectRatio
        src
        srcSet
        sizes
        presentationWidth
        presentationHeight
      }
    }
  }

  query List($limit: Int! = 1000, $offset: Int! = 0) {
    allMarkdownRemark(
      limit: $limit
      skip: $offset
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            description
            category
            title
            date
            slug
            cover {
              ...Cover
            }
          }
        }
      }
    }
  }
`;

export const Head: React.FC = () => {
  const { title, subtitle } = useSiteMetadata();
  const pageTitle = `LIST - ${title}`;

  return <Meta title={pageTitle} description={subtitle} />;
};

export default List;
