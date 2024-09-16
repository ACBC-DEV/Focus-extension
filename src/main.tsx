import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "@/Popup.tsx";
import { Providers } from "./providers/providers";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Providers>
			<Popup />
		</Providers>
	</StrictMode>,
);
