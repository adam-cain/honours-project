import { getTeam } from "@/lib/actions/team";
import { Suspense } from "react";
import Image from "next/image";
import { BuildingIcon } from "lucide-react";

export default async function Page({ params }: { params: { team: string } }) {    
    const team = await getTeam(params.team);

    const imageSize = 100;
    const imageMargin = 50;
    return <>
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex gap-x-4 items-center border-b py-4">
                <div
                    className="rounded-full object-cover border flex items-center justify-center my-2"
                    style={{ width: imageSize, height: imageSize, minWidth: imageSize, minHeight: imageSize }}
                >
                    {team?.logo ? (
                        <Image
                            className="rounded-full object-cover"
                            style={{ width: imageSize, height: imageSize }}
                            src={team.logo}
                            alt={`${team.name} logo`}
                            width={imageSize}
                            height={imageSize}
                            layout="fixed"
                        />
                    ) : (
                        <BuildingIcon style={{ width: imageSize - imageMargin, height: imageSize - imageMargin }} />
                    )}
                </div>
                <div>
                    <h1 className=" font-semibold text-5xl my-2">{team.name}</h1>
                    <p className="text-base my-2">{team.description}</p>
                </div>
            </div>
            <h1>Shows list of general info such as analytics etc. here</h1>
        </Suspense>
    </>
}