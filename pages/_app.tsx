import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
	const userData = useUserData();

	return (
		<>
			<Toaster position="bottom-center" />
			<UserContext.Provider value={userData}>
				<Navbar />
				<Component {...pageProps} />
			</UserContext.Provider>
		</>
	);
}
export default MyApp;
