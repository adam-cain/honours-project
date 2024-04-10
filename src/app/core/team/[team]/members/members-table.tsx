
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SelectButton } from '@/components/members/select-button';
import Avatar from "@/components/Profile/avatar";
import { Member } from "@/lib/actions/members";

export default function MembersTable({ members, hasPermission }: { members: {error: string;} | Member[] , hasPermission: boolean }) {
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[70px]"></TableHead>
                    <TableHead className="w-auto">Username</TableHead>
                    <TableHead className="w-auto" >Email</TableHead>
                    <TableHead className="w-[140px]">Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.isArray(members) && members.map((member) => (
                    <TableRow key={member.username}>
                        <TableCell>{<Avatar username={member.username} image={member.image} />}</TableCell>
                        <TableCell>{member.username}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell className=""><SelectButton member={member} hasPerm={hasPermission} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
