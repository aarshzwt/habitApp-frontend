import Header from "@/components/Header";
import { subscribeUser } from "@/utils/push";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (user)
        subscribeUser(user.id);
    }
  }, [user]);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
