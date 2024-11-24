//basic function to deal with the CRUD operations.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

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

async function getAllDocuments(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (e) {
    console.error("Error getting documents: ", e);
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

async function getDocumentsForUser(collectionName: string, userId: string) {
  try {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (e) {
    console.error("Error getting documents for user: ", e);
    throw e;
  }
}

export {
  addDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentsForUser,
};
