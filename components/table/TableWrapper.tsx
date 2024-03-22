'use client'
import {FileType} from "@/typings";
import {Button} from "@/components/ui/button";
import { DataTable } from "./Table";
import {columns} from "./columns";
import {useUser} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {useCollection} from "react-firebase-hooks/firestore"
import {collection, orderBy, query, getDocs, onSnapshot, getFirestore} from "firebase/firestore"
import {db} from "@/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import Pagination from '@/components/Pagination';
import firebase from 'firebase/app';
import 'firebase/firestore';

//   function TableWrapper({ skeletonFiles }: { skeletonFiles: FileType[] }) {
//   const { user } = useUser();
//   const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
//   const [sort, setSort] = useState<"asc" | "desc">("desc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(10);

//   const userId = user?.id;
//   // Only proceed with querying if userId is defined
//   useEffect(() => {
//     if (userId) {
//       const emailQuery = collection(db, 'users', userId, "files");
//       const unsubscribe = onSnapshot(emailQuery, (snapshot) => {
//         const emailData: FileType[]  = snapshot.docs.map((doc) =>({
//                 id: doc.id,
//                 filename: doc.data().filename || doc.id,
//                 timestamp:  new Date(doc.data().timestamp?.seconds * 1000) || undefined,
//                 fullName: doc.data().fullName,
//                 downloadURL:  doc.data().downloadURL,
//                 type:  doc.data().type,
//                 size:  doc.data().size,
//               }));
//         console.log(emailData);
//         setInitialFiles(emailData);
//       });

//       return () => unsubscribe();
//     }
//   }, [userId]); // Dependency array ensures this effect runs only when userId changes


//   //   const [docs, loading, Error] = useCollection(
//   //     user &&
//   //     query(
//   //       collection(db, "users", user.id, "files"),
//   //      orderBy("timestamp", sort))
//   //   );

//   // useEffect(() => {
//   //   if (!docs) return;

//   //   const  files: FileType[] = docs.docs.map((doc) => ({
    
//   //       id: doc.id,
//   //       filename: doc.data().filename || doc.id,
//   //       timestamp:  new Date(doc.data().timestamp?.seconds * 1000) || undefined,
//   //       fullName: doc.data().fullName,
//   //       downloadURL:  doc.data().downloadURL,
//   //       type:  doc.data().type,
//   //       size:  doc.data().size,
//   //     }));
    
//   //   setInitialFiles(files);

//   // }, [docs]);

//  console.log(initialFiles)
 

//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentFiles = initialFiles.slice(indexOfFirstUser, indexOfLastUser);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   return (
//     <div className="flex flex-col space-y-5 pb-10">
//       <Button
//         variant={"outline"}
//         onClick={() => {
//           setSort(sort === "desc" ? "asc" : "desc");
//         }}
//         className="ml-auto w-fit"
//       >
//         Sort By {sort === "desc" ? "Newest" : "Oldest"}
//       </Button>

//       <DataTable columns={columns} data={currentFiles} />
//       <div className='mt-8'>
//         <Pagination
//           usersPerPage={usersPerPage}
//           totalUsers={initialFiles.length}
//           paginate={paginate}
//         />
//       </div>
//     </div>
//   );
// }

// export default TableWrapper;


function TableWrapper({ skeletonFiles}: {skeletonFiles: FileType[] }) {
  const {user} = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
    const userId = user?.id;
  // Only proceed with querying if userId is defined
  useEffect(() => {
    if (userId) {
      const emailQuery = collection(db, 'users', userId, "files");
      const unsubscribe = onSnapshot(emailQuery, (snapshot) => {
        const emailData: FileType[]  = snapshot.docs.map((doc) =>{
          const data = doc.data();
          return {
            id: doc.id,
            filename: data.filename || doc.id,
            timestamp:  new Date(doc.data().timeStamp?.seconds * 1000) || undefined, // Convert Firestore timestamp to JavaScript Date object
            fullName: data.fullName,
            downloadURL: data.downloadURL,
            type: data.type,
            size: data.size,
          };
              });
        console.log(emailData);
        // Apply sorting after data retrieval
        const sortedData = sort === "asc"
        ? emailData.sort((a, b) => (a.timestamp.getTime() - b.timestamp.getTime()))
        : emailData.sort((a, b) => (b.timestamp.getTime() - a.timestamp.getTime()));
        setInitialFiles(sortedData);
    });


      return () => unsubscribe();
    }
  }, [userId, sort]); // Dependency array ensures this effect runs only when userId changes


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentFiles = initialFiles.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (initialFiles.length === 0) {
    return (
      <div className="flex flex-col">
        <Button variant={"outline"} className="ml-auto w-36 h-10 mb-5">
          <Skeleton className="w-full h-5" />
        </Button>

        <div className="border rounded-lg">
          <div className="border-b h-12"/>
          {
            skeletonFiles.map((file, index) => (
              <div 
                key={file.id}
                className="flex items-center space-x-4 p-5 w-full"
              >
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-full h-12" />
              </div>
            ))}

            {skeletonFiles.length === 0 && (
              <div className="flex items-center space-x-4 p-5 w-full">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
              </div>
            )}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col space-y-5 pb-10">
      <Button
        variant={"outline"}
        onClick={() => {
          setSort(sort === "desc" ? "asc" : "desc");
        }}
        className="ml-auto w-fit"
      >
        Sort By {sort === "desc" ? "Newest" : "Oldest"}
      </Button>

      <DataTable columns={columns} data={currentFiles} />
      <div className='mt-8'>
      <Pagination
           usersPerPage={usersPerPage}
           totalUsers={skeletonFiles.length}
           paginate={paginate}
       />
    </div>
    </div>
  )
}

export default TableWrapper

