import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { serialize } from "next-mdx-remote/serialize";
import { replaceTweets } from "@/lib/remark-plugins";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.organization.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.chat.findMany({
        where: {
          organization: subdomain ? { subdomain } : { customDomain: domain },
          deployed: true,
        },
        select: {
          name: true,
          description: true,
          createdAt: true,
        },
      });
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )();
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await prisma.chat.findFirst({
        where: {
          organization: subdomain ? { subdomain } : { customDomain: domain },
          deployed: true,
        },
      });

      if (!data) return null;

      const [mdxSource, adjacentPosts] = await Promise.all([
        data.description!,
        prisma.chat.findMany({
          where: {
            organization: subdomain ? { subdomain } : { customDomain: domain },
            deployed: true,
            NOT: {
              id: data.id,
            },
          },
          select: {
            name: true,
            createdAt: true,
            description: true,
          },
        }),
      ]);

      return {
        ...data,
        mdxSource,
        adjacentPosts,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

// Markdown with jsx components
// async function getMdxSource(postContents: string) {
//   // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
//   // https://mdxjs.com/docs/what-is-mdx/#markdown
//   const content =
//     postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
//   // Serialize the content string into MDX
//   const mdxSource = await serialize(content, {
//     mdxOptions: {
//       remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
//     },
//   });

//   return mdxSource;
// }
