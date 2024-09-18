import { GlobalStateContext } from "@/providers/providers";
import type { TLinks } from "@/types";
import { useContext, useEffect } from "react";
import { sendMessage } from "webext-bridge/popup";
export const useGlobal = () => {
	const context = useContext(GlobalStateContext);
	const { setLinks, links, focus, open, setFocus, setOpen } = context;

	useEffect(() => {
		chrome.action.setBadgeText({ text: focus ? "ON" : "" });
		chrome.action.setBadgeBackgroundColor({
			color: focus ? "green" : [0, 0, 0, 0],
		});
	}, [focus]);
	const addLink = (newLink: TLinks) => {
		const newLinks = [...links, newLink];
		setLinks(newLinks);
		sendMessage("updateBlockedUrls", { data: newLinks }, "background");
	};
	const toogleFocus = (value = false) => {
		setFocus(value);
		chrome.storage.local.set({ focusMode: value });
		sendMessage("focusActive", { data: value }, "background");
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
