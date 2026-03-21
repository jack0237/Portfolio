import { db, storage } from "./firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const INITIAL_BLOG_POSTS = [
  {
    id: "1",
    title: "ENCRYPTED THOUGHTS",
    date: "14 AUG 2024",
    readTime: "05 MIN READ",
    eyebrow: "System Intel / Journal",
    image: "blogImg1",
    content: "Building high-performance interfaces requires a relentless focus on decoupling state and prioritizing immutable rendering patterns."
  },
  {
    id: "2",
    title: "THE VOID AESTHETIC",
    date: "22 SEP 2024",
    readTime: "07 MIN READ",
    eyebrow: "Design Systems",
    image: "blogImg2",
    content: "Why Glassmorphism works when paired with stark neon accents and aggressive typography."
  },
  {
    id: "3",
    title: "DECENTRALIZED ARCHITECTURE",
    date: "05 OCT 2024",
    readTime: "12 MIN READ",
    eyebrow: "Engineering / Web3",
    image: "blogImg3",
    content: "State synchronization across distributed networks using verifiable protocols and custom EVM smart contracts."
  }
];

export const INITIAL_RESUME_EXPERIENCE = [
  {
    id: "1",
    title: "Lead Frontend Engineer",
    company: "Vercel Inc. / Nexus Corp",
    date: "2022 - PRESENT",
    description: "Spearheaded the migration of legacy monolithic architectures into decoupled, high-performance micro-frontends. Engineered complex global state management systems using Redux and localized context, reducing render cycles by over 40%. Implemented responsive glassmorphism design systems scaling across 50+ localized applications."
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Digital Void Agency",
    date: "2020 - 2022",
    description: "Architected secure RESTful APIs utilizing Node.js and Express, integrated closely with highly available NoSQL database clusters. Built interactive 3D visualizations for web clients using Three.js and WebGL. Deployed containerized applications reducing horizontal scaling deployment times to mere seconds."
  },
  {
    id: "3",
    title: "Systems Architecture Intern",
    company: "Cyberdyne Systems",
    date: "2019 - 2020",
    description: "Assisted the core infrastructure team in optimizing data queries across distributed networks. Wrote automated CI/CD pipelines integrating rigorous end-to-end testing, catching critical state mutations prior to production deployments."
  }
];

export const INITIAL_RESUME_SKILLS = [
  { id: "1", label: "React / Next.js", level: 6 },
  { id: "2", label: "JavaScript / ES6", level: 6 },
  { id: "3", label: "Node.js & Express", level: 5 },
  { id: "4", label: "TypeScript", level: 5 },
  { id: "5", label: "CSS / Tailwind / Sass", level: 6 },
  { id: "6", label: "MongoDB / NoSQL", level: 4 },
  { id: "7", label: "Docker / CI-CD", level: 4 },
  { id: "8", label: "Figma / UI Systems", level: 5 }
];

export const INITIAL_CERTIFICATIONS = [
  {
    id: "1",
    title: "Google UX Design Professional Certificate",
    issuer: "Coursera",
    date: "2023",
    status: "completed",
    link: ""
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    issuer: "Frontend Masters",
    date: "2024",
    status: "ongoing",
    link: ""
  }
];

export const fetchCollection = async (collectionName, fallback) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (querySnapshot.empty) {
      return fallback || [];
    }
    // Return array of objects with their Firestore doc id preserved
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error(`Error fetching collection ${collectionName}:`, err);
    return fallback || [];
  }
};

export const fetchDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("Document not found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

export const saveDocument = async (collectionName, id, data) => {
  try {
    // Omit the id from the stored object fields since it is the document key
    const { id: _, ...docData } = data;
    await setDoc(doc(db, collectionName, id), docData);
  } catch (err) {
    console.error(`Error saving to ${collectionName}:`, err);
  }
};

export const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    console.error(`Error deleting from ${collectionName}:`, err);
  }
};

export const uploadImage = async (file, path) => {
  if (!file) return null;
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
