import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Sonnet",
  description:"Sonnet AI",
  url: site_url,
  ogImage: `${site_url}/_static/logo.jpg`,
  mailSupport: "devathulvinod@gmail.com",
  links: {
    twitter: "https://twitter.com/intent/tweet?url=http%3A%2F%2Flocalhost%3A3000",
    github: "https://github.com/DevAthul-88",
  }
};

