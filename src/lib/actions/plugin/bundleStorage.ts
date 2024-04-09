import { put } from "@vercel/blob";
import fs from "fs";

export async function uploadFunction(filePath: string, id: string) {
    const bundleCode = fs.readFileSync(filePath, 'utf8');
    try {
        const bundleCode = fs.readFileSync(filePath, 'utf8');
        const result = await put(`functions/${id}.js`, bundleCode,{
            contentType: 'application/javascript',
            access: 'public',
            addRandomSuffix: false
        });
        return {success: true, message: result};
    } catch (error) {
        return {success: false, message: error};
    }
}

// import { NextResponse } from "next/server";

// export const runtime = "edge";

// export async function POST(req: Request) {
//   if (!process.env.BLOB_READ_WRITE_TOKEN) {
//     return new Response(
//       "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
//       {
//         status: 401,
//       },
//     );
//   }

//   const file = req.body || "";
//   const contentType = req.headers.get("content-type") || "text/plain";
//   const filename = `${nanoid()}.${contentType.split("/")[1]}`;
//   const blob = await put(filename, file, {
//     contentType,
//     access: "public",
//   });

//   return NextResponse.json(blob);
// }
