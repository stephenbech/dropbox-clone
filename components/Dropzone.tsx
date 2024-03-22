'use client'
import { useState } from "react";
import DropzoneComponent from "react-dropzone";
import { cn } from "@/lib/utils";
import { useUser} from "@clerk/nextjs";
import {addDoc, collection, serverTimestamp, doc, updateDoc} from "firebase/firestore"
import {db, storage } from "@/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import toast from "react-hot-toast"

function Dropzone(){
   const [loading, setLoading] = useState(false)
   const {isLoaded, isSignedIn, user} = useUser();
   const onDrop =(acceptedFiles: File[]) =>{
   //    acceptedFiles.forEach((file) => {
   //       const reader = new FileReader();

   //       reader.onabort = () => console.log("file reading was aborted");
   //       reader.onerror = () => console.log("file reading has failed");
   //       reader.onload = async () => {
   //          await uploadPost(file);
   //       };
   //       reader.readAsArrayBuffer(file)
   //    });
   // }

   // const uploadPost = async (selectedFile: File) => {
   //       if (loading) return;
   //       if (!user) return;
   //       setLoading(true);

   //       const toastId = toast.loading("Uploading...");

   //       // ADDdOC -> USERS/USER12345/FILES
   //       const docRef = await addDoc(collection (db, "users", user.id, "files"), {
   //          userId: user.id,
   //          filename: selectedFile.name,
   //          fullName: user.fullName,
   //          profileImg: user.imageUrl,
   //          timeStamp: serverTimestamp(),
   //          type: selectedFile.type,
   //          size: selectedFile.size,
   //       } )

   //       const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);

   //       uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
   //          const downloadURL = await getDownloadURL(imageRef);

   //          await updateDoc(doc(db, "users", user.id, "files", docRef.id ), {
   //             downloadURL: downloadURL
   //          })
   //       })


   //       toast.success("Uploaded Successfully", {
   //          id: toastId,
   //       })
   //       setLoading(false);
   // }

   acceptedFiles.forEach(async (file) => {
      try {
         if (!user) throw new Error("User not signed in");
         setLoading(true);

         const toastId = toast.loading("Uploading...");

         // Add document metadata to Firestore
         const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            filename: file.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timeStamp: serverTimestamp(),
            type: file.type,
            size: file.size,
         });

         // Upload file to Firebase Storage
         const fileRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
         await uploadBytes(fileRef, file);

         // Get download URL and update Firestore document
         const downloadURL = await getDownloadURL(fileRef);
         await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
            downloadURL: downloadURL
         });

         toast.success("Uploaded Successfully", {
            id: toastId,
         });
      }   catch (error) {
         console.error("Error uploading file:", error);
         toast.error("Error uploading file");
      } 
      finally {
         setLoading(false);
      }
   });
};



   //max file size 20mb
   const maxSize = 20971520;
   
   return(
      <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
         {({
            getRootProps, 
            getInputProps,
            isDragActive, 
            fileRejections, 
            isDragReject 
         }) =>{ 
            const isFileTooLarge = 
               fileRejections.length > 0 && fileRejections[0].file.size > maxSize
            return(
            <section className="m-4">
               <div {...getRootProps()} className={cn(
                  "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center ",
                  isDragActive ? "bg-[#035FFE] text-white animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
               )}>
                  <input {...getInputProps()} />
                  {!isDragActive && "Click here or drop files here."}
                  {isDragActive && !isDragReject && "Drop to upload this file!"}
                  {isFileTooLarge && (
                     <div className="text-red-500 m-4 ">File is too large.</div>
                  )}
               </div>
            </section>
         )}}
      </DropzoneComponent>
    );
}

export default Dropzone