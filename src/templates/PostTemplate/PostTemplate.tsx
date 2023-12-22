import React from "react";

import { graphql } from "gatsby";

import { Layout } from "@/components/Layout";
import { Meta } from "@/components/Meta";
import { Post } from "@/components/Post";
import { useSiteMetadata } from "@/hooks";
import { Node } from "@/types";

interface Props {
  data: {
    markdownRemark: Node;
  };
}

const PostTemplate: React.FC<Props> = ({ data: { markdownRemark } }: Props) => (
  <Layout>
    <Post post={markdownRemark} />
  </Layout>
);

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

  query PostTemplate($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        date
        description
        tags
        title
        cover {
          ...Cover
        }
        socialImage {
          publicURL
        }
      }
    }
  }
`;

export const Head: React.FC<Props> = ({ data }) => {
  const { title, subtitle, url } = useSiteMetadata();

  const {
    frontmatter: {
      title: postTitle,
      description: postDescription = "",
      socialImage,
    },
  } = data.markdownRemark;

  const description = postDescription || subtitle;
  const image = socialImage?.publicURL && url.concat(socialImage?.publicURL);

  return (
    <Meta
      title={`${postTitle} - ${title}`}
      description={description}
      image={image}
    />
  );
};

export default PostTemplate;
