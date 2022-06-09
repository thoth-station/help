const fs = require("fs");
const yaml = require("js-yaml");
const localSources = yaml.load(
  fs.readFileSync("./config/content-sources.yaml", "utf-8")
);


const remoteSources = [
  {
    name: "community/core",
    remote: "https://github.com/thoth-station/core.git",
    patterns: ["docs/**/*.md", "community/**/*.md"],
  },
  {
    name: "support/thamos",
    remote: "git@github.com:thoth-station/thamos.git",
    patterns: ["thamos/data/defaultThoth.yaml"],
  }
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
        extensions: [`.mdx`],
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
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`md`, `mdx`],
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        gfm: true,
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              disableBgImageOnAlpha: true,
              backgroundColor: 'transparent',
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`md`, `mdx`],
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-123174547-2",
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Thoth Station Help`,
        short_name: `Help`,
        start_url: `/help/`,
        background_color: `#ffffff`,
        theme_color: `#f39200`,
        display: `minimal-ui`,
        icon: `content/logo.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
};
