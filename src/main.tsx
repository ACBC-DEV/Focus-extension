import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/providers/providers";
import Popup from "@/Popup.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Provider>
			<Popup />
		</Provider>
	</StrictMode>,
);
