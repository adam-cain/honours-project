'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadImage(imageFile: File) {
    const blob = await put(imageFile.name, imageFile, {
        access: 'public',
    });
    revalidatePath('/');
    return blob;
}