import AuthForm from "@/components/AuthForm";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";

export default function Signup() {
    const router = useRouter();

    const handleSignup = async (form: any) => {
        try {
            const res = await axiosInstance.post("auth/register", form);
            console.log(res)
            alert(res.message);
            router.push("/login");
        } catch (error: any) {
            alert(error.response?.data?.message || "Signup failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <AuthForm type="signup" onSubmit={handleSignup} />
        </div>
    );
}
