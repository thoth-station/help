const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require(`fs`);
const yaml = require(`js-yaml`);
const { nanoid } = require(`nanoid`);

const tocSources = yaml.load(fs.readFileSync(`./config/toc-sources.yaml`, `utf-8`));

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const file = path.resolve(`./src/templates/Mdx.js`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMdx.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: file,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, getNode, actions: { createNodeField }, reporter }) => {
  if (node.internal.type === `Mdx`) {
    const fileNode = getNode(node.parent);
    const gitRemoteNode = getNode(fileNode.gitRemote___NODE);

    const slug =
      (gitRemoteNode ? `/${gitRemoteNode.sourceInstanceName}` : '') +
      createFilePath({
        node,
        getNode,
        basePath: '',
        trailingSlash: false,
      }) +
      (fileNode.name !== 'index' ? `.${fileNode.extension}` : '');

    const srcLink =
      (gitRemoteNode
        ? `${gitRemoteNode.webLink}/blob/master/`
        : `${getNode('Site').siteMetadata.srcLinkDefault}/blob/master/content/`) +
      fileNode.relativePath;

    createNodeField({ node, name: 'slug', value: slug });
    createNodeField({ node, name: 'srcLink', value: srcLink });

    reporter.info(`node created: ${slug}`);
  }
}

// Create new node collection `NavData` for navigation, parsing table of content files `tocSources`
exports.sourceNodes = ({ actions: { createNode }, createNodeId, createContentDigest, reporter, }) => {
  const navItems = tocSources.flatMap((tocSource) => {
    const fileLocation = `${__dirname}/${tocSource}`;
    if (!fs.existsSync(fileLocation)) {
      reporter.error(`Table of Contents file ${fileLocation} missing.  Skipped.`);
      return [];
    }
    const toc = yaml.load(fs.readFileSync(fileLocation, `utf-8`));

    return toc.map((navItem) => ({
      ...navItem,
      id: navItem.id || nanoid(),
      links: navItem.links && navItem.links.map((link) => ({ ...link, id: link.id || nanoid() })),
    }));
  });

  createNode({
    id: createNodeId(`NavData`),
    navItems,
    internal: {
      type: `NavData`,
      contentDigest: createContentDigest(navItems),
    },
  });

  reporter.success('nodes created: NavData');
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
      srcLink: String
    }
    
    type NavDataNavItemsLinks {
      id: String
      label: String
      remote: String
      href: String
    }
    
    type NavDataNavItems {
      id: String
      label: String
      href: String
    }
  `)
}
