import UserAvatar from "@/components/Profile/avatar";
import ProfileForm from "@/components/Profile/profile-form";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Upload } from 'lucide-react';


export default async function Page() {
  const session = await getSession();
  const user = session.user;

  const updateUserData = async (name: string) => {
    "use server"
    console.log("Updating user data",name);
    
    const updatedData = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: name
      }
    });
    console.log("Updated data", updatedData);
    
    return updatedData;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="">
          <h2 className="text-2xl font-semibold">User Settings</h2>
          <p className="text-gray-300 text-base ">Add or update your information</p>
        </div>

        <p className="text-lg">Profile Picture <span><Upload/></span></p>
        <div className="w-full flex justify-center items-center">
          <UserAvatar image={user.image} username={user.name}
            size={32} textSize="text-6xl" />
        </div>
        <ProfileForm
          session={session} 
          onUpdate={updateUserData}
          />
      </div>
    </>
  )
}