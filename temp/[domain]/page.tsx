import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toDateString } from "@/lib/utils";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";

export async function generateStaticParams() {
  const allSites = await prisma.organization.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // // feel free to remove this filter if you want to generate paths for all sites
    // where: {
    //   subdomain: "demo",
    // },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  // const [data, posts] = await Promise.all([
  //   getSiteData(domain),
  //   getPostsForSite(domain),
  // ]);

  // if (!data) {
  //   notFound();
  // }

  return (
    <>
      <div className="mb-20 w-full">
        { domain }
      </div>
    </>
  );
}
