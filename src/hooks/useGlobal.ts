import { GlobalStateContext } from "@/providers/providers";
import type { TLinks } from "@/types";
import { useContext } from "react";

export const useGlobal = () => {
	const context = useContext(GlobalStateContext);
	const { setLinks, links, focus, open, setFocus, setOpen } = context;
	const updateStorage = async (key: "blockedUrls" | "focusMode") => {
		if (key === "blockedUrls") {
			await chrome.storage.local.set({ blockedUrls: links });
		} else {
			await chrome.storage.local.set({ focusMode: focus });
		}
		chrome.runtime.sendMessage({ type: "refresh" });
	};
	const addLink = (newLink: TLinks) => {
		setLinks([...links, newLink]);
		updateStorage("blockedUrls");
	};
	const toogleFocus = (value = false) => {
		setFocus(value);
		updateStorage("focusMode");
	};
	const deleteLink = (id: number) => {
		setLinks(links.filter((item) => item.id !== id));
	};

	if (!context) {
		throw new Error(
			"useGlobalState debe ser usado dentro de GlobalStateProvider",
		);
	}
	return { addLink, links, deleteLink, toogleFocus, open, focus, setOpen };
};
