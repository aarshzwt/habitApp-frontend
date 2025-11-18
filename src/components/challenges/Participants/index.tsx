'use client';
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useSelector } from "react-redux";
import Router from "next/router";
import { Participant } from "../types";
import { ParticipantCard } from "./ParticipantCard";
import HabitCalendar from "@/components/HabitCalendar"; // ✅ make sure path is correct
import { ParticipantModal } from "./Participantmodal";

export function Participants({ challengeId }: { challengeId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [refetch, setRefetch] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res = await axiosInstance.get<{ participants: Participant[] }>(
        `/challenges/${challengeId}/participants`
      );

      const { currentUser, others } = res.participants.reduce(
        (acc, p) => {
          if (p.user_id === user.id) acc.currentUser = p;
          else acc.others.push(p);
          return acc;
        },
        { currentUser: null as Participant | null, others: [] as Participant[] }
      );

      setCurrentUser(currentUser);
      setParticipants(others);
    };

    if (!user) Router.push("/login");
    else fetchParticipants();
  }, [refetch, challengeId, user]);

  if (!currentUser && participants.length === 0)
    return <p className="text-gray-500 italic">No participants yet.</p>;

  return (
    <div className="mt-8 container mx-auto px-4">
      <h3 className="font-bold text-2xl text-gray-800 mb-6">Participants</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Participants grid */}
        <div>
          {participants.length === 0 ? (
            <p className="text-gray-500">No other participants yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto pr-1">
              {participants.map((p) => (
                <ParticipantCard
                  key={p.user_id}
                  participant={p}
                  onClick={() => setSelected(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Your Progress */}
        {currentUser && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Your Progress
            </h4>
            <ParticipantCard participant={currentUser} expanded />
            <div className="mt-5">
              <HabitCalendar
                type="challenge"
                allLogs={currentUser.logs}
                startDate={currentUser.start_date}
                endDate={currentUser.end_date ?? null}
                onChange={() => { setRefetch((prev) => !prev) }}
              />
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ParticipantModal
          participant={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
