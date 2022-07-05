import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/clientApp";
import db from "../firebase/clientApp";
import { addDoc, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import crc32 from "crc-32";
import { useAccount } from "wagmi";
const md5 = require("md5");

type User = {
  address: string;
  score: number;
};

const Home: NextPage = () => {
  const [users, usersLoading, usersError] = useCollection(
    collection(db, "users")
  );
  const [currentUser, setCurrentUser] = useState<User>();
  const { address, isConnecting, isDisconnected } = useAccount();

  const userId = address ? md5(address).substring(0, 20) : undefined;

  useEffect(() => {
    // fetch user from DB, if it exists
    async function getUser() {
      if (userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const foundUser = docSnap.data() as User;
          setCurrentUser(foundUser);
          console.log("found user: ", foundUser);
        } else {
          console.log("user not found");
        }
      }
    }
    getUser();
  }, [userId]);

  // add user to DB if it doesn't exist
  const addUser = async () => {
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), {
      address: address,
      score: 0,
    });
  };

  // increment user's score
  const updateUserScore = async () => {
    if (!currentUser || !userId) {
      console.log("no user to update");
      return;
    }
    const newUser = { ...currentUser, score: currentUser.score + 1 };
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), newUser);
    setCurrentUser(newUser);
  };

  return (
    <div className={styles.container}>
      <ConnectButton />
      {isConnecting ? (
        <div>Connecting…</div>
      ) : (
        <>
          <button onClick={addUser}>Add User</button>
          <button onClick={updateUserScore}>Approve</button>
        </>
      )}{" "}
    </div>
  );
};

export default Home;
