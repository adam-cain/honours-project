import { Title } from "@/components/PageComponents";
import ProfileForm from "@/components/Profile/profile-form";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();
  
  return(
    <>
      <Title>Settings</Title>
      <div className="flex flex-col gap-4">
        <div className="">
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <p className="text-gray-300 text-base ">Add or update your information</p>
        </div>
        <ProfileForm session={session} />
      </div>
    </>
  )
}