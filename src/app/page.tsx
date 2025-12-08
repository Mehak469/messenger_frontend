"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/logo";
import Footer from "../components/footer";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already logged in
      // const accessToken = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      
      if (userData) {
        // User is logged in, redirect to chats
        router.push("/chats");
      } else {
        // User is not logged in, redirect to auth
        router.push("/auth");
      }
    }, 3000); // 3 seconds
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '20px'
    }}>
      <Logo />
      <Footer />
    </div>
  );
}