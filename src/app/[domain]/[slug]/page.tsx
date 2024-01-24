import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPostData, getSiteData } from "@/lib/fetchers";
import { toDateString } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getPostData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { name, description } = data;

  return {
    name,
    description,
    openGraph: {
      name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      name,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

export async function generateStaticParams() {
  const allPosts = await prisma.chat.findMany({
    select: {
      organization: {
        select: {
          subdomain: true,
          customDomain: true,
        },
      },
    },
    // feel free to remove this filter if you want to generate paths for all posts
    where: {
      organization: {
        subdomain: "demo",
      },
    },
  });

  const allPaths = allPosts
    .flatMap(({ organization }) => [
      organization?.subdomain && {
        domain: `${organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      organization?.customDomain && {
        domain: organization.customDomain
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const data = await getPostData(domain, slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 dark:text-stone-400 md:text-base">
            {toDateString(data.createdAt)}
          </p>
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {data.name}
          </h1>
          <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
            {data.description}
          </p>
        </div>
        <a
          // if you are using Github OAuth, you can get rid of 
          rel="noreferrer"
          target="_blank"
        >
          <div className="my-8">
            <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
            </div>
            <div className="text-md ml-3 inline-block align-middle dark:text-white md:text-lg">
              by <span className="font-semibold"></span>
            </div>
          </div>
        </a>
      </div>
      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
      </div>
      {data.adjacentPosts.length > 0 && (
        <div className="relative mb-20 mt-10 sm:mt-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-stone-300 dark:border-stone-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-stone-500 dark:bg-black dark:text-stone-400">
              Continue Reading
            </span>
          </div>
        </div>
      )}
      {data.adjacentPosts && (
        <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
        </div>
      )}
    </>
  );
}
