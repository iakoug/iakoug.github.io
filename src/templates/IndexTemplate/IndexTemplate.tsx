import React from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/Feed";
import { Layout } from "@/components/Layout";
import { Meta } from "@/components/Meta";
import { Page } from "@/components/Page";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";
import { useSiteMetadata } from "@/hooks";
import { AllMarkdownRemark, PageContext } from "@/types";

interface Props {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: PageContext;
}

const IndexTemplate: React.FC<Props> = ({ data, pageContext }: Props) => {
  const { pagination } = pageContext;
  const { hasNextPage, hasPrevPage, prevPagePath, nextPagePath } = pagination;

  const { edges } = data.allMarkdownRemark;

  return (
    <Layout>
      <Sidebar isIndex />
      <Page>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
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

  query IndexTemplate($limit: Int!, $offset: Int!) {
    allMarkdownRemark(
      limit: $limit
      skip: $offset
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            categorySlug
            slug
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

export const Head: React.FC<Props> = ({ pageContext }) => {
  const { title, subtitle } = useSiteMetadata();
  const {
    pagination: { currentPage: page },
  } = pageContext;
  const pageTitle = page > 0 ? `Posts - Page ${page} - ${title}` : title;

  return <Meta title={pageTitle} description={subtitle} />;
};

export default IndexTemplate;
