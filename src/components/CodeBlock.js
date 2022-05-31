import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer";
import github from "prism-react-renderer/themes/github";
import { graphql, StaticQuery } from 'gatsby';


export const CodeBlock = ({relativePath, type}) => {
  return (
    <StaticQuery
      query={graphql`
        query TextQuery {
          allText {
            nodes {
              raw
              name
            }
          }
        }
      `}
      render={data => {
        const node = data?.allText?.nodes?.find(node => node.relativePath === relativePath)
        if(node) {
          return (
            <Highlight {...defaultProps} code={node.raw} language={type} theme={github}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
                )}
            </Highlight>
          )
        }
      }}
    />

  )
}