"use client";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import SubmitButton from "../ui/submit-button"
import { useSession } from "next-auth/react";
import ProfileAvatar from "@/components/Profile/profile-avatar";
import { Title } from "../PageComponents";

type Props = {
    session: any
    onUpdate?: any
}

const EditUserProfileSchema = z.object({
    name: z.string().min(1, "Required"),
    email: z.string().email("Required"),
})

export default function ProfileForm({ session, onUpdate }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = session;
    const { update } = useSession()

    const form = useForm<z.infer<typeof EditUserProfileSchema>>({
        mode: "onChange",
        resolver: zodResolver(EditUserProfileSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
        },
    });

    const handleSubmit = async (
        values: z.infer<typeof EditUserProfileSchema>
    ) => {
        setIsLoading(true)
        await onUpdate(values.name)
        await update()
        setIsLoading(false)
        console.log("Updated user details", user);
        window.location.reload();                
    }

    useEffect(() => {
        form.reset({ name: user.name, email: user.email })
    }, [user, form])

    return (
        <Form {...form}>
            <div className="flex felx-row w-full justify-between" >
                <div className="">
                <Title>User Settings</Title>
                <p className="text-gray-300 text-base ">Add or update your information</p>
                </div>
                <div className="w-32">
                <SubmitButton
                onClick={form.handleSubmit(handleSubmit)}
                loading={isLoading}
                className="text-sm"
            >
                Save Settings
            </SubmitButton>
                </div>

            </div>
            <ProfileAvatar user={user} />
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>

                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg">Username</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Name"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg">Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={true}
                                    placeholder="Email"
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
