'use client'
import { useState } from "react";
import { AuthFormPropsType, FormType } from "./types";
import { TIMEZONES } from '@/assets/timezons'
import dynamic from "next/dynamic";
const SelectField = dynamic(() => import("./SelectField"), { ssr: false });

export default function AuthForm({ type, onSubmit }: AuthFormPropsType) {
    const [form, setForm] = useState<FormType>({
        username: "",
        email: "",
        password: "",
        timezone: "UTC", // auto detect
        role: "user"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTimezoneChange = (selected: any) => {
        setForm({ ...form, timezone: selected?.value || "UTC" });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md w-full bg-white p-8 rounded-xl shadow-md"
        >
            <h2 className="text-2xl font-semibold mb-6">
                {type === "login" ? "Login" : "Sign Up"}
            </h2>

            {type === "signup" && (
                <input
                    className="mb-4 w-full p-2 border rounded"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            )}

            <input
                className="mb-4 w-full p-2 border rounded"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />

            <input
                className="mb-6 w-full p-2 border rounded"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />

            {type === "signup" && (
                <SelectField
                    name="timezone"
                    options={TIMEZONES}
                    value={
                        TIMEZONES.find(tz => tz.value === form.timezone)
                    }
                    onChange={handleTimezoneChange} // ADD ONCHANGE
                    required
                    placeholder="Select timezone"
                    className="z-10 mb-5"
                />
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                {type === "login" ? "Login" : "Sign Up"}
            </button>

            {type === "login"
                ? <div> Don't have an account yet? <a href="signup">Sign Up</a></div>
                : <div> Already have an account? <a href="/login">Login</a></div>
            }
        </form>
    );
}
