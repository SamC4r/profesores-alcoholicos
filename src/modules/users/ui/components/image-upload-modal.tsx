'use client';
import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";

interface ThumbnailUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
    userId,
    open,
    onOpenChange
}:ThumbnailUploadModalProps) => {

    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        utils.users.getOne.invalidate({userId})
        onOpenChange(false);
    }

    console.log("USERID",userId)
    
    return (
        <ResponsiveModal
            title='Upload your profile picture'
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone 
                endpoint="imageUploader"
                input={{userId}}
                onClientUploadComplete={onUploadComplete}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </ResponsiveModal>
    )
}