//basic function to deal with the CRUD operations.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Form } from "@/types/types";
import { User } from "firebase/auth";

async function addDocument(collectionName: string, data: any, docId?: string) {
  try {
    const pathParts = collectionName.split("/")
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
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      }
    );
    return unsubscribe; // Unsubscribe function
  } catch (e) {
    console.error("Error listening to documents: ", e);
    throw e;
  }
}

function getAllMyDocuments(
  collectionName: string,
  userId: string,
  callback: Function
) {
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
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

function getDocumentsForUser(
  collectionName: string,
  userId: string,
  callback: Function
) {
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

async function deleteByFormId(formId: string, collectionName:string) {
  try {
    const q = query(
      collection(db, collectionName), // Specific to "forms" collection
      where("formId", "==", formId) // Query where "formId" matches
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      console.log("Form deleted with ID: ", formId);
      return true;
    } else {
      console.log("No matching form found to delete!");
      return false;
    }
  } catch (e) {
    console.error("Error deleting form: ", e);
    throw e;
  }
}

async function deleteByField(collectionName: string, fieldName: string, fieldValue: any) {
  try {
    const q = query(
      collection(db, collectionName), // Specific to "forms" collection
      where(fieldName, "==", fieldValue) // Query where "formId" matches
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      console.log("Document deleted with field: ", fieldName, fieldValue);
      return true;
    } else {
      console.log("No matching document found to delete!");
      return false;
    }
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

const storeUser = async (user: User) => {
  const userData = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // The document ID is the user's UID
  await setDoc(doc(db, "users", user.uid), userData, { merge: true });
  console.log("User document created or updated");
};

async function getDocumentById(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document:", e);
    throw e;
  }
}

export {
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentsForUser,
  getFormByFormId,
  deleteByFormId,
  storeUser,
  getAllMyDocuments,
  deleteByField
};
