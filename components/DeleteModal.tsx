import { CopyIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore } from "@/store/store"
import { useUser } from "@clerk/nextjs"
import { deleteObject, ref } from "firebase/storage"
import { db, storage } from "@/firebase"
import { collection, deleteDoc, doc } from "firebase/firestore"
import toast from "react-hot-toast"

export function DeleteModal() {
   const {user} = useUser();
   const [
      isDeleteModalOpen,
      setIsDeleteModalOpen, 
      fileId,
      setFileId,
    ] = useAppStore((state: any) => [
      state.isDeleteModalOpen, 
      state.setIsDeleteModalOpen, 
      state.fileId,
      state.setFileId,
    ])

    async function deleteFile() {
      if (!user || !fileId) return;

      const toastId = toast.loading("Deleting...");


      const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

      try{
          deleteObject(fileRef)
            // .then(async () => {
            //     deleteDoc(doc(db, "users", user.id, "files", fileId)).then(() => {
            //        console.log("deleted");

            //        toast.success("Deleted Successfully", {
            //           id: toastId,
            //        })
            //     })
            // })
            .then(() => {
               // Delete the document from Firestore
               return deleteDoc(doc(db, "users", user.id, "files", fileId));
             })
             .then(() => {
               console.log("Deleted");
               toast.success("Deleted Successfully", {
                 id: toastId,
               });
             })
             .catch((error) => {
               console.error("Error deleting document:", error);
               toast.error("Error deleting document", {
                 id: toastId,
               });
             })
            .finally(() => {
               setIsDeleteModalOpen(false)
            })
      } catch (error) {
         console.log(error)
         setIsDeleteModalOpen(false)

         toast.error("Error deleting document", {
            id: toastId
         })
      }
      }
    
  return (
    <Dialog 
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) =>{ 
         setIsDeleteModalOpen(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your file!
          </DialogDescription>
        </DialogHeader>
         <div className="flex space-x-2 py-3">
            <Button
               size="sm"
               className="px-3 flex-1"
               variant="ghost"
               onClick={() => setIsDeleteModalOpen(false)}
            >
               <span className="sr-only">Cancel</span>
               <span>Cancel</span>
            </Button>

            <Button
               type="submit"
               size="sm"
               className="px-3 flex-1"
               variant="destructive"
               onClick={() => deleteFile()}
            >
               <span className="sr-only">Delete</span>
               <span>Delete</span>
            </Button>
         </div>
      </DialogContent>
    </Dialog>
  )
}
