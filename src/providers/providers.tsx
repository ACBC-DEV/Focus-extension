import type { TLinks } from "@/types";
import { createContext, useEffect, useState, type ReactNode } from "react";

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

export const Providers = ({
	children,
}: GlobalStateProviderProps): JSX.Element => {
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState(false);
	const [links, setLinks] = useState<TLinks[]>([]);
	useEffect(() => {
		chrome.storage.local.get("blockedUrls", ({ blockedUrls }) => {
			if (blockedUrls) {
				setLinks(blockedUrls);
			}
		});
		chrome.storage.local.get("focusMode", ({ focusMode }) => {
			if (focusMode) {
				setFocus(focusMode);
			}
		});
	}, []);
	return (
		<GlobalStateContext.Provider
			value={{ open, setOpen, focus, setFocus, links, setLinks }}
		>
			{children}
		</GlobalStateContext.Provider>
	);
};
