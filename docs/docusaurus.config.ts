import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Bolt - Documentation",
  tagline: "Modular, typed REST API framework for NodeJS",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://bolt-ts.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/itsRems/bolt/tree/main/docs/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
    },
    // // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Bolt - Modular, typed REST API framework for NodeJS",
      logo: {
        alt: "Bolt Logo",
        src: "img/favicon.ico",
      },
      items: [
        {
          label: "Get Started",
          to: "/docs/getting-started",
          position: "right",
        },
        {
          href: "https://github.com/itsRems/bolt",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              href: "https://github.com/itsRems/bolt",
              label: "GitHub",
              position: "right",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nicolas Theck.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
