"use client"
import Avatar from "@/components/dashboardNavbar/avatar";
import { approveOrgAccessRequest } from "@/lib/actions/members";

export function RequestsForAccessRow({ requestsforAccess, orgName }: { requestsforAccess: any, orgName: string}) {

    const handleAccept = async (request: any) => {

        const res = await approveOrgAccessRequest(orgName, request.requestedByUser.username, null);
        if (res.success) {
            // Remove the request from the list
            // setRequestsForAccess(requestsforAccess.filter((req: any) => req.requestedByUser.username !== request.requestedByUser.username));
            console.log('Request accepted');
            
        } 
    }
    return (
        <div>
            {requestsforAccess.map((request: any, index: number) => (
                <div key={index} className="flex justify-between p-4 border-b">
                    <div className="flex flex-row items-center gap-x-4">
                        <Avatar username={request.requestedByUser.username} image={request.requestedByUser.image} />
                        <div>{request.requestedByUser.username}</div>
                    </div>
                    <div className="gap-x-4 flex">
                        <button onClick={handleAccept}>Accept</button>
                        {/* Add the user to the organisation and delete the request */}
                        <button>Reject</button>
                        {/* Delete the request */}
                    </div>
                </div>
            ))}
        </div>
    )
}