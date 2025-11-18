import "@/styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { useEffect } from "react";
import { hydrateAuth, login } from "../redux/slices/authSlice";
import Layout from "./layout";
import ToastContainer from "@/components/toast";

function AuthLoader() {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken")
    if (storedUser && storedToken && refreshToken) {
      dispatch(
        login({
          user: JSON.parse(storedUser),
          token: storedToken,
          refreshToken: refreshToken
        })
      );
    }
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <AuthLoader />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
      <ToastContainer />
    </>
  );
}
