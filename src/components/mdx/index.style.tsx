import Styled from 'styled-components'

export const Wrapper = Styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
    overflow: hidden;
    box-sizing: border-box;
    line-height: 1.6;

    h1, h2, h3, h4, h5, h6 {
        margin: 44px 0 0 0;
        font-weight: bold;
    }

    p, li {
        font-weight: 400;
        font-family: "Source Sans Pro";
    }
`

export const Code = Styled.code.attrs({
  className: 'theme-code'
})`
    margin: 0 4px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 14px;
    background: rgb(239, 243, 245);
`

export const Pre = Styled.pre`
    position: relative;
    margin: 16px 0;
    border-radius: 4px;
    padding: 16px 16px 16px 48px;
    line-height: 2;
    color: #22863a;
    border: 1px solid #d1d5da;
    overflow-x: scroll;
    tab-size: 4;
    hyphens: none;

    code {
        margin:0;
        padding: 0;
        border-radius: 0;
        background: transparent;
        font-family: 'Roboto Mono', Consolas, Menlo, Monaco, courier, monospace;
    }

    .line-numbers-rows {
        position: absolute;
        left: 16px !important;
        top: 16px;

        span {
            counter-increment: linenumber;

            &:before {
                content: counter(linenumber);
                display: block;
                text-align: right;
            }
        }
    }

    .gatsby-highlight-code-line {
        display: block;
        width: calc(100% + 16px);
        margin-left: -48px;
        padding-left: 48px;
        background-color: #fffbdd;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: #6a737d;
    }

    .token.namespace {
        opacity: 1;
    }

    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
        color: #e36209;
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.url,
    .token.inserted {
        color: #005cc5;
    }

    .token.atrule,
    .token.attr-value,
    .token.keyword {
        color: #d73a49;
    }

    .token.entity {
        color: #657b83;
    }

    .token.function,
    .token.class-name {
        color: #6f42c1;
    }

    .token.regex,
    .token.important,
    .token.variable {
        color: rgb(225, 109, 117);
    }

    .token.operator {
        color: #e36209;
    }

    .token.important,
    .token.bold {
        font-weight: bold;
    }

    .token.italic {
        font-style: italic;
    }

    .token.entity {
        cursor: help;
    }
`

export const P = Styled.p`
    margin: 16px 0;
    font-size: 16px;
    line-height: 28px;
    font-weight: 400;
    word-break: break-word;
    hyphens: auto;
`

export const H1 = Styled.h1`
    font-size: 32px;
`

export const H2 = Styled.h2`
    font-size: 28px;
`

export const H3 = Styled.h3`
    font-size: 24px;
`

export const H4 = Styled.h4`
    font-size: 20px;
`

export const H5 = Styled.h5`
    font-size: 16px;
`

export const H6 = Styled.h6`
    font-size: 12px;
`

export const Bloackquote = Styled.div.attrs({
  className: 'theme-quote'
})`
    margin: 16px 0;
    padding: 16px 24px;
    border-radius: 8px;

    P {
        margin: 0;
    }
`

export const Ul = Styled.ul`
    margin: 8px 0 8px 32px;
`

export const Ol = Styled.ol``

export const Li = Styled.li`
    font-size: 16px;
    font-weight: 400;
`

export const Table = Styled.table`
    width: 100%;
    border: 1px solid rgb(204, 217, 223);
    border-radius: 4px;
    border-spacing: 0px;
    margin: 16px 0px;
`

export const Tr = Styled.tr`
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
`

export const Th = Styled.th`
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 8px 16px;
`

export const Td = Styled.td`
    text-align: left;
    padding: 8px 16px;
    border-top: 1px solid rgb(204, 217, 223);
    font-weight: 400;
    font-family: "Source Sans Pro";
`

export const Em = Styled.em`
    padding: 2px 4px;
    font-style: theme;
    background: rgba(196,240,255,.5);
`

export const Strong = Styled.strong`
    font-weight: bold;
`

export const Delete = Styled.del`
    color: rgba(0, 0, 0, 0.45);
`

export const Hr = Styled.hr`
    position: relative;
    width: 12px;
    margin: 48px auto;
    border: none;
    border-top: 1px solid #989DA3;

    &:before, &:after {
        content: ' ';
        position: absolute;
        width: 2px;
        border: none;
        border-top: 1px solid #989DA3;
    }

    &:before {
        top: -1px;
        left: -4px;
    }

    &:after {
        top: -1px;
        right: -4px;
    }
`
