"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form} from "@/components/ui/form"
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GithubAuthProvider,
  TwitterAuthProvider
} from "firebase/auth";
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";
import VerificationScreen from "./auth/VerificationScreen";
import AuthCard from "./auth/AuthCard";
import AuthHeader from "./auth/AuthHeader";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const [verificationSent, setVerificationSent] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
   const [wwaiting, setIsWaiting] = useState(false);
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsWaiting(true);
        try {
            if(type === 'sign-up') {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                
                // Send verification email
                await sendEmailVerification(userCredentials.user);
                
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if(!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                // Show verification screen
                setUserEmail(email);
                setVerificationSent(true);
                toast.success('Account created. Please verify your email.');
            } else {
                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    setUserEmail(email);
                    setVerificationSent(true);
                    toast.error('Please verify your email before signing in.');
                    return;
                }

                const idToken = await userCredential.user.getIdToken();

                if(!idToken) {
                    toast.error('Sign in failed')
                    return;
                }

                await signIn({
                    email, idToken
                })

                toast.success('Sign in successfully.');
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            toast.error(`Invalid credentials. Please try again.`);
            setIsWaiting(false); // ensure this always runs
        }finally {
          setTimeout(() => {
            setIsWaiting(false); // ensure this always runs
          }, 2000);
        }
    }
    
    const handleResendVerification = async () => {
        try {
            setIsResending(true);
            // Re-authenticate to get the user object
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                userEmail, 
                form.getValues().password
            );
            
            await sendEmailVerification(userCredential.user);
            toast.success('Verification email resent. Please check your inbox.');
        } catch (error) {
            console.error('Error resending verification:', error);
            toast.error('Failed to resend verification email. Please try again.');
        } finally {
            setIsResending(false);
        }
    };
    
    const handleCheckVerification = async () => {
        try {
            setIsChecking(true);
            // Re-authenticate to get the user object
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                userEmail, 
                form.getValues().password
            );
            
            // Reload the user to get the latest emailVerified status
            await reload(userCredential.user);
            
            if (userCredential.user.emailVerified) {
                // User is verified, proceed with sign in
                const idToken = await userCredential.user.getIdToken();
                await signIn({ email: userEmail, idToken });
                toast.success('Email verified successfully. Signing in...');
                router.push('/');
            } else {
                toast.error('Your email is not verified yet. Please check your inbox.');
            }
        } catch (error) {
            console.error('Error checking verification:', error);
            toast.error('Failed to check verification status. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleBackToSignIn = () => {
        setVerificationSent(false);
        router.push('/sign-in');
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            
            // Add these settings to help with the sign-in experience
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            try {
                const userCredential = await signInWithPopup(auth, provider);
                
                // Get user info
                const user = userCredential.user;
                
                // Get the ID token
                const idToken = await user.getIdToken();

                
                // Always try to create/update the user record in your database
                const signUpResult = await signUp({
                    uid: user.uid,
                    name: user.displayName || 'User',
                    email: user.email || '',
                    password: '' // Empty password indicates Google sign-in
                });
                
                if (!signUpResult?.success) {
                    toast.error(signUpResult?.message || 'Failed to create account');
                    setIsGoogleLoading(false);
                    return;
                }
                
                // Sign in the user with your backend
                const signInResult = await signIn({
                    email: user.email || '',
                    idToken
                });
                
                if (!signInResult?.success) {
                    toast.error(signInResult?.message || 'Failed to sign in');
                    setIsGoogleLoading(false);
                    return;
                }
                
                toast.success('Signed in successfully with Google');
                
                // Use router.replace instead of push to avoid navigation issues
                router.replace('/');
            } catch (popupError: unknown) {
                console.error("Popup error:", popupError);
                
                if ((popupError as { code?: string }).code === 'auth/popup-closed-by-user' ||
                    (popupError as { code?: string }).code === 'auth/popup-blocked' ||
                    (popupError as Error).message?.includes('Cross-Origin-Opener-Policy')) {
                      setIsGoogleLoading(false);
                    toast.error('Popup authentication failed. Please try again.');
                    throw popupError; // Re-throw to be caught by the outer catch
                }
            }
        } catch (error: unknown) {
            console.error('Google sign-in error:', error);
            
            // Handle specific error cases
            if ((error as { code?: string }).code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in cancelled. Please try again.');
            } else if ((error as { code?: string }).code === 'auth/popup-blocked') {
                toast.error('Pop-up blocked by browser. Please allow pop-ups for this site.');
            } else {
                toast.error(`Google sign-in failed: ${(error as Error)?.message || 'Unknown error'}`);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const [isFacebookLoading, setIsFacebookLoading] = useState(false);
   const handleFacebookSignIn = async () => {
  try {
    setIsFacebookLoading(true);
    const provider = new FacebookAuthProvider();
    provider.addScope("email");

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const signUpResult = await signUp({
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        password: '' // Social login: no password
      });

      if (!signUpResult?.success) {
        toast.error(signUpResult?.message || 'Failed to create account');
        return;
      }

      const signInResult = await signIn({
        email: user.email || '',
        idToken
      });

      if (!signInResult?.success) {
        toast.error(signInResult?.message || 'Failed to sign in');
        return;
      }

      toast.success('Signed in successfully with Facebook');
      router.replace('/');
    } catch (popupError: any) {
      console.error("Popup error:", popupError);

      // Handle account-exists-with-different-credential
      if (popupError.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = FacebookAuthProvider.credentialFromError(popupError);
        const email = popupError.customData?.email;

        if (!pendingCred || !email) {
          toast.error("Unable to resolve sign-in conflict. Try another login method.");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes('google.com')) {
          toast.info('Signing in with Google to link Facebook...');
          const googleProvider = new GoogleAuthProvider();
          const googleResult = await signInWithPopup(auth, googleProvider);

          await linkWithCredential(googleResult.user, pendingCred);
          toast.success('Facebook linked to your Google account!');
          router.replace('/');
          return;
        } else {
          toast.error("Please sign in with your original method to link Facebook.");
          return;
        }
      }

      // Other popup errors
      if (popupError.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (popupError.code === 'auth/popup-blocked') {
        toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      } else {
        toast.error(`Facebook sign-in failed: ${popupError.message || 'Unknown error'}`);
      }
    }
  } catch (error: any) {
    console.error('Facebook sign-in error:', error);
    toast.error(`Facebook sign-in failed: ${error.message || 'Unknown error'}`);
  } finally {
    setIsFacebookLoading(false);
  }
};
const [isGithubLoading, setIsGithubLoading] = useState(false);
const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      const provider = new GithubAuthProvider();
      provider.addScope("email");
  
      // Sign in with GitHub
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
  
        // Sign up or create the user
        const signUpResult = await signUp({
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          password: '' // Social login, no password needed
        });
  
        if (!signUpResult?.success) {
          toast.error(signUpResult?.message || 'Failed to create account');
          return;
        }
  
        // Sign in the user
        const signInResult = await signIn({
          email: user.email || '',
          idToken
        });
  
        if (!signInResult?.success) {
          toast.error(signInResult?.message || 'Failed to sign in');
          return;
        }
  
        toast.success('Signed in successfully with GitHub');
        router.replace('/'); // Redirect to home or dashboard
      } catch (popupError: any) {
        console.error("Popup error:", popupError);
  
        // Handle account-exists-with-different-credential
        if (popupError.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = GithubAuthProvider.credentialFromError(popupError);
          const email = popupError.customData?.email;
  
          if (!pendingCred || !email) {
            toast.error("Unable to resolve sign-in conflict. Try another login method.");
            return;
          }
  
          const methods = await fetchSignInMethodsForEmail(auth, email);
  
          if (methods.includes('google.com')) {
            toast.info('Signing in with Google to link GitHub...');
            const googleProvider = new GoogleAuthProvider();
            const googleResult = await signInWithPopup(auth, googleProvider);
  
            await linkWithCredential(googleResult.user, pendingCred);
            toast.success('GitHub linked to your Google account!');
            router.replace('/');
            return;
          } else {
            toast.error("Please sign in with your original method to link GitHub.");
            return;
          }
        }
  
        // Other popup errors
        if (popupError.code === 'auth/popup-closed-by-user') {
          toast.error('Sign-in cancelled. Please try again.');
        } else if (popupError.code === 'auth/popup-blocked') {
          toast.error('Pop-up blocked. Please allow pop-ups for this site.');
        } else {
          toast.error(`GitHub sign-in failed: ${popupError.message || 'Unknown error'}`);
        }
      }
    } catch (error: any) {
      console.error('GitHub sign-in error:', error);
      toast.error(`GitHub sign-in failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGithubLoading(false);
    }
  };
    
    const isSignIn = type === 'sign-in';
    
    // Show verification screen if email verification has been sent
    if (verificationSent) {
        return (
            <VerificationScreen
                userEmail={userEmail}
                isResending={isResending}
                isChecking={isChecking}
                onResendVerification={handleResendVerification}
                onCheckVerification={handleCheckVerification}
                onBackToSignIn={handleBackToSignIn}
            />
        );
    }

    // Regular auth form
    return (
        <AuthCard>
            <AuthHeader title={isSignIn ? `AI-powered real-time interview platform for smarter hiring`:``} />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-0 form"
              >
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your Name"
                    type="text"
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Your email address"
                  type="email"
                />

                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <Button className="btn" type="submit">
                {wwaiting ? (
                <span className="animate-spin h-4 w-4 border-2 border-violet-800 rounded-full border-t-transparent"></span>
            ) : isSignIn ? "Sign In" : "Create an Account"}
                </Button>
              </form>
            </Form>
            
            {/* Divider */}
            <div className="relative flex items-center justify-center mt-1 mb-0">
              <div className="absolute border-t border-gray-700 w-full"></div>
              <span className="relative px-4 bg-gray-700 text-light-300 text-sm rounded-lg">or</span>
            </div>
            
            {/* Google Sign In Button */}
            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-dark-300 transition-colors cursor cursor-pointer"
            >
              {isGoogleLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-200 rounded-full border-t-transparent"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
              )}
              <span>{isSignIn ? "Sign in with Google" : "Sign up with Google"}</span>
            </Button>
            {/* Facebook In Button */}
            <Button 
            type="button"
            variant="outline"
            onClick={handleFacebookSignIn}
            disabled={isFacebookLoading}
            className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-dark-300 transition-colors cursor-pointer"
            >
            {isFacebookLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-200 rounded-full border-t-transparent"></span>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#3B5998" d="M24,4C12.954,4,4,12.954,4,24c0,9.991,7.309,18.287,16.868,19.735V29.694h-5.08v-5.694h5.08v-4.338
                    c0-5.024,2.985-7.788,7.557-7.788c2.189,0,4.479,0.391,4.479,0.391v4.923h-2.525c-2.487,0-3.26,1.544-3.26,3.128v3.684h5.548
                    l-0.887,5.694h-4.661v14.041C36.691,42.287,44,33.991,44,24C44,12.954,35.046,4,24,4z"/>
                </svg>
            )}
            <span>{isSignIn ? "Sign in with Facebook" : "Sign up with Facebook"}</span>
            </Button>


            {/* GitHub Sign In Button */}
            {/* <Button 
            type="button"
            variant="outline"
            onClick={handleGithubSignIn}
            disabled={isGithubLoading}
            className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-dark-300 transition-colors cursor-pointer"
            >
            {isGithubLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-200 rounded-full border-t-transparent"></span>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.371 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 
                0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.614-4.042-1.614-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 
                1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.776.419-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.931 
                0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.513 11.513 0 0 1 3.003-.404c1.02.005 
                2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.649.243 2.873.12 3.176.77.84 
                1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.475 
                5.921.43.372.823 1.102.823 2.222 0 1.606-.015 
                2.898-.015 3.293 0 .32.216.694.825.576C20.565 
                21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
            )}
            <span>{isSignIn ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
            </Button>  */}
           

            <p className="text-center flex flex-col sm:flex-row gap-3 justify-center mt-3">
              {isSignIn ? "No account yet?" : "Have an account already?"}
              <Link
                href={!isSignIn ? "/sign-in" : "/sign-up"}
                className="font-bold text-user-primary ml-1"
              >
                {!isSignIn ? "Sign In" : "Sign Up"}
              </Link>
            </p>
        </AuthCard>
    );
};

export default AuthForm;
