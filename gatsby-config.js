const fs = require("fs");
const yaml = require("js-yaml");
const localSources = yaml.load(
  fs.readFileSync("./config/content-sources.yaml", "utf-8")
);


const remoteSources = [
  {
    name: "documentation/core",
    remote: "https://github.com/thoth-station/core.git",
    patterns: ["docs/**/*.md", "community/**/*.md"],
  },
];

module.exports = {
  pathPrefix: `/help`,
  siteMetadata: {
    title: `Thoth Station Help`,
    description: `Thoth Station Help`,
    siteUrl: `https://thoth-station.ninja/help`,
    // default URL for all content within this repository for linking to the source of the content
    srcLinkDefault: `https://github.com/thoth-station/help`,
    github: "https://github.com/thoth-station",
    youtube: "https://www.youtube.com/channel/UClUIDuq_hQ6vlzmqM59B2Lw",
    twitter: "https://twitter.com/ThothStation",
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sass`,
    ...remoteSources.map(({ name, remote, patterns }) => ({
      resolve: `gatsby-source-git`,
      options: {
        name,
        remote,
        patterns,
        local: `${__dirname}/.content-cache/${name}`,
      },
    })),
    ...localSources.map(({ dir, name, ignore }) => ({
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/${dir}`,
        name,
        ignore,
      },
    })),
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
              linkImagesToOriginal: false
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                });
              });
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby Starter Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Thoth Station Help`,
        short_name: `Help`,
        start_url: `/help/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#f39200`,
        display: `minimal-ui`,
        icon: `content/logo.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
