import AuthForm from "@/components/AuthForm";
import { login } from "@/redux/slices/authSlice";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const handleLogin = async (form: any) => {
        try {
            const res = await axiosInstance.post("auth/login", form);
            dispatch(
                login({
                    user: {
                        email: res.user.email,
                        role: res.user.role,
                        id: res.user.id,
                    },
                    token: res.token,
                    refreshToken: res.refreshToken
                })
            );
            router.push("/");
        } catch (error: any) {
            console.log(error)
            alert(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <AuthForm type="login" onSubmit={handleLogin} />
        </div>
    );
}
