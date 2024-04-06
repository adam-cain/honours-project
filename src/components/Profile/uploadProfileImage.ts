"use server"
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function uploadProfileImage(formData: FormData) {
  const imageFile = formData.get('image') as File;
  const blob = await put(imageFile.name, imageFile, {
    access: 'public',
  });

  const userId = formData.get('userId') as string;

  await prisma.user.update({
      where: { id: userId },
      data: {
          image: blob.url
      }
  });

  return blob.url;
}
  

