"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { inviteUserToTeam } from "@/lib/actions/members";
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function InviteAccordian({teamName}:{teamName: string}) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Invite member&apos;s using either their email or username</AccordionTrigger>
                <AccordionContent>
                    <InviteMemberForm teamName={teamName} />
                </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="item-2">
                <AccordionTrigger>Create invite link</AccordionTrigger>
                <AccordionContent>

                </AccordionContent>
            </AccordionItem> */}
        </Accordion>
    )
}

// Define a new schema for inviting a member
const InviteMemberSchema = z.object({
    email_or_username: z.string().min(1, "Required"),
    role: z.nativeEnum(Role),
    use_email: z.boolean(),
});

export function InviteMemberForm({teamName}:{teamName: string}) {
    const form = useForm<z.infer<typeof InviteMemberSchema>>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: {
            email_or_username: "",
            role: Role.MEMBER, // Default role
            use_email: true,
        },
    });

    async function onSubmit(data: z.infer<typeof InviteMemberSchema>) {
        // Here, you can handle the form submission, for example:
        // inviteUserToTeam({ email: data.email, role: data.role });
        toast.loading("Inviting user");
        const formData = new FormData();
        formData.append("role", data.role);
        
        if(data.use_email) {
            formData.append("email", data.email_or_username);
        } else {
            formData.append("username", data.email_or_username);
        }

        const result = await inviteUserToTeam(teamName,formData,null)
        if(result.error){
            toast.error(result.error);
        } else{
            toast.success("User invited successfully");
            form.reset();
        }

        toast.dismiss();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row justify-between items-center">
                <FormField
                    control={form.control}
                    name="use_email"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between mr-2">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row w-full mx-auto">
                <FormField
                    control={form.control}
                    name="email_or_username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} 
                                placeholder={form.watch("use_email") ? "Email" : "Username"}
                                className=" rounded-e-none h-[35px] w-[20rem] items-center  inline-flex origin-center justify-center mx-auto" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <SelectButton onRoleChange={field.onChange} />
                        </FormItem>
                    )}
                />
                </div>
                <Button type="submit" className="h-[35px] mx-auto bg-tertiary hover:bg-white hover:text-black">Invite</Button>
                
            </form>
        </Form>
    );
}

import { Role } from "@prisma/client";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import * as Select from '@radix-ui/react-select';
import { SelectItem } from "@/components/members/select-item";
import { Toaster } from "sonner"

const roleDisplayMap: Record<Role, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
    VIEW_ONLY: "View Only",
};

const SelectButton = ({ onRoleChange }: {  onRoleChange: (newDisplayValue: string) => void }) => {
    const [selectedRole, setSelectedRole] = useState<Role>(Role.MEMBER);

    const handleRoleChange = async (newDisplayValue: string) => {
        // Find the Role key that matches the newDisplayValue
        const newRole = (Object.keys(roleDisplayMap) as Role[]).find(key => roleDisplayMap[key] === newDisplayValue);
        
        if (newRole) {
            setSelectedRole(newRole);
            onRoleChange(newRole);
        } else {
            console.error("Invalid role selection:", newDisplayValue);
        }
    };

    return (
        <Select.Root value={roleDisplayMap[selectedRole as Role]} onValueChange={handleRoleChange}>            
        <Select.Trigger
            className={`inline-flex items-center justify-center rounded-e px-[15px] text-[13px] leading-none h-[35px] gap-[5px]  bg-tertiary  shadow-[0_2px_10px] shadow-black/10 hover:bg-secondary focus:shadow-[0_0_0_2px] focus:shadow-black  outline-none w-full
                `}
            aria-label="Role Selector"
        >
            <Select.Value placeholder={roleDisplayMap[selectedRole as Role]} />
            <Select.Icon className="">
                <ChevronDownIcon />
            </Select.Icon>
        </Select.Trigger>
            <Select.Portal>
                <Select.Content className="overflow-hidden bg-tertiary rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-tertiary  cursor-default">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-[5px]">
                        <Select.Group >
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="View Only">View Only</SelectItem>
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-tertiary  cursor-default">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
