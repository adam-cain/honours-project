import ProfileForm from "@/components/Profile/profile-form";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function Page() {
  const session = await getSession();
  const user = session.user;
  
  const updateUserData = async (name: string) => {
    "use server"

    const updatedData = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: name
      }
    });
    user.name = updatedData.username;
    return updatedData;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <ProfileForm
          session={session}
          onUpdate={updateUserData}
        />
      </div>
    </>
  )
}