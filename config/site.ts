export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PlayLater",
  description: "Game backlog app",
  mainNav: [],
  sideNav: [
    {
      title: "Library",
      href: "/library",
      subNavs: [
        {
          title: "Backlog",
          href: "/library?status=backlog",
          key: "backlog",
        },
        {
          title: "In Progress",
          href: "/library?status=in-progress",
          key: "in-progress",
        },
        {
          title: "Completed",
          href: "/library?status=completed",
          key: "completed",
        },
        {
          title: "Abandoned",
          href: "/library?status=abandoned",
          key: "abandoned",
        },
      ],
    },
    {
      title: "Add Game",
      href: "/add",
    },
    {
      title: "Search",
      href: "/search",
    },
  ],
};
