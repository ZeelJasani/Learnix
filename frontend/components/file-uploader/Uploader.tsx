"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";



interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl: string;
    fileType: "image" | "video";
}

interface iAppProps {
    value: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: "image" | "video";
}




export function Uploader({ onChange, value, fileTypeAccepted }: iAppProps) {
    const fileUrl = useConstructUrl(value || "")
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: fileTypeAccepted,
        objectUrl: value ? fileUrl || "" : "",
    });

    const uploadFile = useCallback(
        async (file: File) => {
            setFileState(prev => ({
                ...prev,
                uploading: true,
                progress: 0,
                error: false,
            }));

            try {
                // First get the pre-signed URL from our API
                const presignedResponse = await fetch("/api/s3/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted === "image",
                    }),
                });

                if (!presignedResponse.ok) {
                    const error = await presignedResponse.text();
                    throw new Error(`Upload failed: ${error}`);
                }

                const { presignedUrl, key, contentType } = await presignedResponse.json();

                // Upload the file directly to S3 using the pre-signed URL
                const xhr = new XMLHttpRequest();
                
                await new Promise<void>((resolve, reject) => {
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setFileState(prev => ({
                                ...prev,
                                progress,
                            }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve();
                        } else {
                            reject(new Error(`Upload failed with status ${xhr.status}`));
                        }
                    };

                    xhr.onerror = () => {
                        reject(new Error('Network error during upload'));
                    };

                    xhr.open('PUT', presignedUrl, true);
                    xhr.setRequestHeader('Content-Type', contentType || file.type);
                    xhr.send(file);
                });

                // Update the file state with the new file
                setFileState(prev => ({
                    ...prev,
                    progress: 100,
                    key: key,
                    file: file,
                    objectUrl: URL.createObjectURL(file),
                    uploading: false,
                }));

                // Call the onChange callback with the file key
                onChange?.(key);
                toast.success("File uploaded successfully");
            } catch (error) {
                console.error("Upload error:", error);
                toast.error(error instanceof Error ? error.message : "Failed to upload file");

                setFileState(prev => ({
                    ...prev,
                    progress: 0,
                    error: true,
                    uploading: false,
                }));
            }
        },
        [fileTypeAccepted, onChange]
    )



const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl)
        }

        setFileState({
            file: file,
            uploading: false,
            progress: 0,
            objectUrl: URL.createObjectURL(file),
            error: false,
            id: uuidv4(),
            isDeleting: false,
            fileType: fileTypeAccepted
        });

        uploadFile(file);
    }
}, [fileState.objectUrl, uploadFile, fileTypeAccepted]);



async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
        setFileState((prev) => ({
            ...prev,
            isDeleting: true,
        }));


        const response = await fetch("/api/s3/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key: fileState.key,
            }),
        });

        if (!response.ok) {
            toast.error("failed to remove file from storage");

            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
                error: true,

            }));
            return;
        }


        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl)
        }

        onChange?.("");






        setFileState(() => ({
            file: null,
            uploading: false,
            progress: 0,
            objectUrl: "",
            error: false,
            id: null,
            isDeleting: false,
            fileType: fileTypeAccepted
        }));

        toast.success("File removed successfully");
    } catch {
        toast.error("Something went wrong");
        setFileState((prev) => ({
            ...prev,
            isDeleting: false,
            error: true,
        }));
    }
}

function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
        const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files");
        const fileSizeTooBig = fileRejection.find(
            (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if (fileSizeTooBig) {
            toast.error("file size limit exceeds");
        }

        if (tooManyFiles) {
            toast.error("Too many files selected, max is 1");
        }
    }
}


function renderContent() {
    if (fileState.uploading) {
        return (
            <RenderUploadingState
                file={fileState.file as File}
                progress={fileState.progress}
            />
        )
    }

    if (fileState.error) {
        return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
        return (
            <RenderUploadedState
                previewUrl={fileState.objectUrl}
                handleRemoveFile={handleRemoveFile}
                isDeleting={fileState.isDeleting}
                fileType={fileState.fileType}
            />
        );
    }

    return <RenderEmptyState isDragActive={isDragActive} />
}






// Update fileState when value prop changes (for existing files)
useEffect(() => {
    if (value && value !== fileState.key) {
        setFileState(prev => ({
            ...prev,
            key: value,
            objectUrl: fileUrl || "",
            file: null,
            uploading: false,
            error: false,
            isDeleting: false,
        }));
    } else if (!value && fileState.key) {
        // Clear state when value is empty
        setFileState(prev => ({
            ...prev,
            key: undefined,
            objectUrl: "",
            file: null,
            uploading: false,
            error: false,
            isDeleting: false,
        }));
    }
}, [value, fileState.key, fileUrl]);

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        };
    }, [fileState.objectUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
    });

    return (
        <Card 
            {...getRootProps()} 
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
                isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'
            )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
};