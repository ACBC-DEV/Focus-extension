import type { TLinks } from "@/types";
import {
	createContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { sendMessage } from "webext-bridge/popup";

// Definir el tipo de los valores que manejará nuestro contexto
interface GlobalStateContextType {
	open: boolean;
	setOpen: (value: boolean) => void;
	focus: boolean;
	setFocus: (value: boolean) => void;
	links: TLinks[];
	setLinks: (value: TLinks[]) => void;
}

// Crear el contexto con valores por defecto
export const GlobalStateContext = createContext<GlobalStateContextType>(
	{} as GlobalStateContextType,
);

// Crear el Provider que envolverá nuestra aplicación o las partes que necesiten acceso al estado global
interface GlobalStateProviderProps {
	children: ReactNode;
}

export const Provider = ({
	children,
}: GlobalStateProviderProps): JSX.Element => {
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState(false);
	const [links, setLinks] = useState<TLinks[]>([]);
	useEffect(() => {
		chrome.storage.local.get(["blockedUrls", "focusMode"], (result) => {
			const { blockedUrls, focusMode } = result;
			if (blockedUrls) {
				setLinks(blockedUrls);
			}
			if (focusMode) {
				console.log("there", focusMode);
				setFocus(focusMode);
				sendMessage("focusActive", { data: focusMode }, "background");
			}
		});
	}, []);
	const contextValue = useMemo(
		() => ({ open, setOpen, focus, setFocus, links, setLinks }),
		[open, focus, links],
	);
	return (
		<GlobalStateContext.Provider value={contextValue}>
			{children}
		</GlobalStateContext.Provider>
	);
};
