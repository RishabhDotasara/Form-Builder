//basic function to deal with the CRUD operations.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Form } from "@/types/types";

async function addDocument(collectionName: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

function getAllDocuments(collectionName: string, callback: Function) {
  try {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
    return unsubscribe; // Unsubscribe function
  } catch (e) {
    console.error("Error listening to documents: ", e);
    throw e;
  }
}


async function updateDocument(
  collectionName: string,
  docId: string,
  newData: any
) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, newData);
    console.log("Document updated with ID: ", docId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

async function deleteDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", docId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

function getDocumentsForUser(collectionName: string, userId: string, callback: Function) {
  try {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
    return unsubscribe; // Unsubscribe function
  } catch (e) {
    console.error("Error listening to user documents: ", e);
    throw e;
  }
}

function getFormByFormId(
  formId: string,
  callback: (form: Form | null) => void
) {
  try {
    const q = query(
      collection(db, "forms"), // Specific to "forms" collection
      where("formId", "==", formId) // Query where "formId" matches
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        // Assuming you only care about the first matching document
        const doc = querySnapshot.docs[0];
        const form = { id: doc.id, ...doc.data() } as Form; // Ensure proper typing
        callback(form);
      } else {
        console.log("No matching form found!");
        callback(null);
      }
    });

    return unsubscribe; // Return unsubscribe function for cleanup
  } catch (e) {
    console.error("Error fetching form in real-time:", e);
    throw e;
  }
}

export {
  addDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentsForUser,
  getFormByFormId
};
