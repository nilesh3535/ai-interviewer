"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// Add this to your existing signUp function to handle Google sign-in
export async function signUp(params: SignUpParams) {
  const { uid, name, email, password } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      // For Google sign-in, we should allow existing users to sign in
      if (!password) {
        return {
          success: true,
          message: "Google account already exists. Proceeding with sign-in.",
        };
      }
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // For Google users, get their profile photo
    let photoURL = "/user-avatar.jpg"; // Default avatar
    
    if (!password) {
      try {
        // Get the user from Firebase Auth
        const authUser = await auth.getUser(uid);
        if (authUser.photoURL) {
          photoURL = authUser.photoURL;
        }
      } catch (photoError) {
        console.error("Error getting user photo:", photoError);
        // Continue with default photo if there's an error
      }
    }
    
    // save user to db with only the necessary fields
    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      // If the user signed up with Google, store that information
      authProvider: password ? "email" : "google",
      // Use the Google profile photo if available, otherwise use default
      photoURL: photoURL,
      address:"",
      city:"",
      state:"",
      zip:"",
      country:"",
      phone:"",
      linkedin:"",
      bio:"student",
      packs:"1"
    });

    return {
      success: true,
      message: password 
        ? "Account created successfully. Please sign in." 
        : "Google account created successfully.",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    
    // Handle Firebase specific errors
    if ((error as { code?: string }).code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    // More specific error handling for decoder errors
    if (error instanceof Error && error.message.includes("DECODER routines")) {
      return {
        success: false,
        message: "Database connection error. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    
    // Get user from Firestore to check auth provider
    const firestoreUser = await db.collection("users").doc(userRecord.uid).get();
    const userData = firestoreUser.data();
    const isGoogleUser = userData?.authProvider === "google";
    
    // Skip email verification check for Google users as they're already verified
    if (!userRecord.emailVerified && !isGoogleUser) {
      return {
        success: false,
        message: "Please verify your email before signing in.",
      };
    }

    await setSessionCookie(idToken);
    
    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: unknown) {
    console.log(error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
// Update getCurrentUser to check email verification
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;
    
    const userData = userRecord.data();
    const isGoogleUser = userData?.authProvider === "google";
    
    // Get the user from Auth to check email verification
    const authUser = await auth.getUser(decodedClaims.uid);
    
    // Skip email verification check for Google users
    if (!authUser.emailVerified && !isGoogleUser) {
      // Clear the session cookie
      cookieStore.delete("session");
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Add this function to your existing auth.action.ts file

export async function updateUserAvatar({ 
  userId, 
  photoURL 
}: { 
  userId: string; 
  photoURL: string;
}) {
  try {
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({
      photoURL
    });
    
    return { success: true, message: "Your avatar was updated successfully!"};
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return { success: false, error };
  }
}
export async function registerMeByOpening(
  interviewId: string,
  userId: string
): Promise<void> {
  const interviewRef = db.collection("interviews").doc(interviewId);

  // This will create `candidates` as an array if it doesn’t exist,
  // or append to it if it does.
  await interviewRef.set(
    {
      candidates: FieldValue.arrayUnion(userId),
    },
    { merge: true }
  );
}

export async function updateUserProfile({
  userId,
  firstName,
  lastName,
  email,
  phone,
  bio,
  linkedin,
  gstin,
  company
}: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  linkedin?: string;
  gstin?: string;
  company?: string;
}) {
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: phone || "",
      bio: bio || "Student",
      linkedin: linkedin || "",
      gstin:gstin || "",
      company:company || "",
    });

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
}
export async function updateUserAddress({
  userId,
  address,
  city,
  state,
  zip,
  country,
}: {
  userId: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}) {
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      address: address || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "",
    });

    return { success: true, message: "Address updated successfully!" };
  } catch (error) {
    console.error("Error updating user address:", error);
    return { success: false, error };
  }
}

export async function insertOrder(params: OrderProps) {
  const { paymentid,orderid, amount, packs,paymentType,oldBalance,remaining, userId,packType } = params;

  try {
    await db.collection("orders").add({
      paymentid,
      orderid,
      amount,
      packs,
      paymentDate: new Date().toISOString(),
      paymentType,
      oldBalance:oldBalance,
      userId,
      description:`${packs} ${packs=="1"? "pack":"pack's"} added`,
      createdAt: new Date().toISOString(),
      packType:packType
    });

    return { success: true, message: "Transaction recorded successfully!" };
  } catch (error) {
    console.error("Error inserting transaction:", error);
    return { success: false, error };
  }
}
export async function updateWallet({
  packs,
  userId
}: {
  packs: string;
  userId:string
}) {
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      packs: packs || "",
    });

    return { success: true, message: "Wallet updated successfully!" };
  } catch (error) {
    console.error("Error updating user Wallet:", error);
    return { success: false, error };
  }
}

export async function insertTransaction(params: TransactionProps) {
  const { paymentid,orderid,type,amount, packs,paymentType,oldBalance,remaining, userId,packType } = params;

  try {
    await db.collection("transactions").add({
      paymentid,
      orderid,
      type,
      amount,
      packs,
      paymentType,
      oldBalance:oldBalance,
      remaining:remaining,
      userId,
      description:`${packs} ${packs=="1"? "pack":"pack's"} ${type.toLocaleLowerCase()}.`,
      createdAt: new Date().toISOString(),
      packType:packType
    });

    return { success: true, message: "Transaction recorded successfully!" };
  } catch (error) {
    console.error("Error inserting transaction:", error);
    return { success: false, error };
  }
}

interface Roles{
  id:string;
  role:string;
  createdAt:string;
  flag: boolean;
}
interface Skills {
  id: string;
  skill: string;
  createdAt: string;
  flag: boolean;
}
export async function getAllRoles(): Promise<Roles[]> {
  const snapshot = await db.collection("roles")
 .orderBy("role", "asc")
  .get();

  if (snapshot.empty) return [];

  const roles = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Roles[];

  return roles;
}
export async function getAllSkills(): Promise<Skills[]> {
  const snapshot = await db.collection("skills")
 .orderBy("skill", "asc")
  .get();

  if (snapshot.empty) return [];

  const skills = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Skills[];

  return skills;
}
