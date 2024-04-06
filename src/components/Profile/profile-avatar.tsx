"use client"
import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import UserAvatar from './avatar';
import {uploadProfileImage} from './uploadProfileImage';

type Props = {
    user: any;
};

export default function ProfileAvatar({ user }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(user.image);
    const triggerFileInput = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', files[0]);
            formData.append('userId', user.id);

            try {
                const response = await uploadProfileImage(formData);
                if (response) {
                    setImage(response);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <>
            <div className="text-lg flex flex-row gap-2 align-middle">
                Profile Picture
                <div className="border rounded flex flex-row justify-center p-1 hover:bg-white hover:text-black aspect-square">
                {uploading ? (
                    <Loader2 className="size-3.5 my-auto cursor-not-allowed animate-spin" />
                ) : (
                    <Upload className="size-3.5 my-auto cursor-pointer" onClick={triggerFileInput} />
                )}
                <form>
                <input
                    type="file"
                    id="image"
                    name='image'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    disabled={uploading}
                    required
                    onChange={handleFileChange}
                />
                </form>
                </div>
            </div>
            <div className="w-full flex justify-center items-center">
                <UserAvatar image={image} username={user.name} size={32} textSize="text-6xl" />
            </div>
        </>
    );
}
