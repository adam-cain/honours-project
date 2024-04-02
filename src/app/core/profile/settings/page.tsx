import { Title } from "@/components/PageComponents";
import UserAvatar from "@/components/Profile/avatar";
import ProfileForm from "@/components/Profile/profile-form";
import { FormLabel } from "@/components/ui/form";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  return (
    <>
      <Title>Settings</Title>
      <div className="flex flex-col gap-4">
        <div className="">
          <h2 className="text-2xl font-semibold">User Profile</h2>
          <p className="text-gray-300 text-base ">Add or update your information</p>
        </div>

        <p className="text-lg">Profile Picture</p>
        <div className="w-full flex justify-center items-center">
          <UserAvatar image={session.user.image} username={session.user.name}
            size={32} textSize="text-6xl" />
        </div>


        <ProfileForm session={session} />
      </div>
    </>
  )
}