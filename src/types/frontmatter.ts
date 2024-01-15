interface Frontmatter {
  date: string;
  title: string;
  slug?: string;
  category: string;
  template: string;
  description?: string;
  tags?: Array<string>;
  cover: {
    childImageSharp: {
      fluid: any;
    };
  };
  by?: string
}

export default Frontmatter;
