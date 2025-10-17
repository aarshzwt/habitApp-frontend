import { useState } from "react";

interface AuthFormPropsType {
    type: "signup" | "login",
    onSubmit: (form: FormType) => void
}
interface FormType {
    username: string,
    email: string,
    password: string,
    role: string
}
export default function AuthForm({ type, onSubmit }: AuthFormPropsType) {
    const [form, setForm] = useState<FormType>({
        username: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                {type === "login" ? "Login" : "Sign Up"}
            </button>

            {type === "login" ? <div> Don't have an account yet? <a href="signup">Sign Up</a></div> : <div> Already have an account? <a href="/login">Login</a></div>}
        </form>
    );
}
