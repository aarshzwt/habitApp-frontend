// pages/home.js

import AllHabits from "@/components/Home/AllHabits";
import Badges from "@/components/Home/Badges";
import Header from "@/components/Home/Header";
import Progress from "@/components/Home/Progress";
import TodayHabits from "@/components/Home/TodayHabits";
import TemplateList from "@/components/TemplateList";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function HomePage() {
  const { isLoggedIn, isHydrated } = useSelector((state: any) => state.auth);
  const [user, setUser] = useState();
  const router = useRouter();
  const { isReady } = router;
  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [isLoggedIn, isHydrated])

  useEffect(() => {
    getUserDetails();
  }, [])

  async function getUserDetails() {
    try {
      const userInfo = await axiosInstance.get(`/user`);
      setUser(userInfo.data)
      // const users = await axiosInstance.get('/user/leaderboard');
      // console.log(users)
    } catch (err) {
      console.error(err)
    }
  }

  if (!isReady || !isHydrated || !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8">
      {user && <Header user={user} />}

      <section className="mb-8">
        <TodayHabits onStatusUpdated={getUserDetails} />
      </section>

      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <Progress />
        <Badges /> */}
        <TemplateList />
      </section>

      <section>
        <AllHabits />
      </section>
    </div>
  );
}
