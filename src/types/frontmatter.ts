interface Frontmatter {
  date: string;
  title: string;
  slug?: string;
  category: string;
  template: string;
  description?: string;
  tags?: Array<string>;
  socialImage?: {
    publicURL: string;
  };
  cover: {
    childImageSharp: {
      fluid: any;
    };
  };
}

export default Frontmatter;
