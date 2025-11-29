"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/logo";
import Footer from "../components/footer";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth"); // Redirect to auth page
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