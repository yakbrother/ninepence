---
title: "Everything new in Astro Micro"
description: "Features, enhancements, and changes."
date: "2024-05-09"
draft: true
---

import Callout from "@/components/Callout.astro";



## Giscus comments 💬

[Giscus](https://giscus.app) leverages Github discussions to act as a comments system. To get Giscus working on your own website, see [here](/story/01-getting-started#deploy-the-site).

---

## Callout component 🆕

<Callout>
  Adipisicing et officia reprehenderit fugiat occaecat cupidatat exercitation
  labore consequat ullamco nostrud non.
</Callout>

<Callout type="info">
  Adipisicing et officia reprehenderit fugiat occaecat cupidatat exercitation
  labore consequat ullamco nostrud non.
</Callout>

<Callout type="warning">
  Adipisicing et officia reprehenderit fugiat occaecat cupidatat exercitation
  labore consequat ullamco nostrud non.
</Callout>

<Callout type="error">
  Adipisicing et officia reprehenderit fugiat occaecat cupidatat exercitation
  labore consequat ullamco nostrud non.
</Callout>

---

## UI enhancements 🎨

- Elements are styled and animate on focus
- Increased contrast in light mode
- Active theme is indicated by theme buttons
- Separate syntax highlight themes for light and dark mode
- Code blocks have a copy button
- Add pagination to the bottom of story posts
- Create 404 page
- Add ToC component to posts

---

## Other changes

- Change fonts to Geist Sans and Geist Mono
- Switch base color from "stone" to "neutral"
- Change formatted date to use "long" option for month
- Minor spacing changes throughout
- Remove "work" collection and components
  - If desired, you can get the code from [Astro Nano](https://github.com/markhorn-dev/astro-nano)
- Slightly increased link decoration offset
- Slightly sped-up animations
- Reversed animation
- Ensure posts use an h1 tag for post titles
- Tweaked typography

---

## Issues ⚠️

### Active issues

No active issues!

### Closed issues

- Fixed by [blopker](https://github.com/blopker): [ToC links are obscured by Header when scrolled to](https://github.com/trevortylerlee/astro-micro/issues/4)
- Fixed by [arastoonet](https://github.com/arastoonet): [Fix typo in README](https://github.com/trevortylerlee/astro-micro/pull/19)
- Fixed by [cgranier](https://github.com/cgranier): [Pagination links advance by slug/folder](https://github.com/trevortylerlee/astro-micro/issues/26)
- Fixed by [cgranier](https://github.com/cgranier): [Hides Table of Contents when there are no headings](https://github.com/trevortylerlee/astro-micro/pull/30)
- Fixed: [Giscus does not appear when switching stories via post navigation](https://github.com/trevortylerlee/astro-micro/issues/32)
- Fixed: [Geist font renders incorrectly on Windows](https://github.com/trevortylerlee/astro-micro/issues/33)
- Fixed: [Pagination fails in Cloudflare Pages](https://github.com/trevortylerlee/astro-micro/issues/39)

- Fixed: [Implement tags](https://github.com/trevortylerlee/astro-micro/issues/70)
- Fixed by [anaxite](https://github.com/anaxite): [Update Astro to 5.0](https://github.com/trevortylerlee/astro-micro/issues/73)
- Fixed by [MoyaF](https://github.com/MoyaF): [Table of Contents links not working](https://github.com/trevortylerlee/astro-micro/issues/75)
- Fixed by [antoniovalentini](https://github.com/antoniovalentini): [Possible bugs due to outdated Astro version 5.0.3](https://github.com/trevortylerlee/astro-micro/issues/78)
