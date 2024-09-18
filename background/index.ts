import { onMessage } from "webext-bridge/background";

type TLinks = {
	name: string;
	id: number;
	url: string;
};

export const isBlockedUrl = (blockedUrls: TLinks[], currentUrl: string) => {
	if (Array.isArray(blockedUrls)) {
		return blockedUrls.some(
			(dt) => new URL(dt.url).hostname === new URL(currentUrl ?? "").hostname,
		);
	}
};
chrome.runtime.onInstalled.addListener(async () => {
	chrome.storage.local.set({
		blockedUrls: [
			{ id: 0, name: "youtube.com", url: "https://www.youtube.com/" },
			{ id: 1, name: "facebook.com", url: "https://www.facebook.com/" },
			{ id: 2, name: "twitter.com", url: "https://twitter.com/" },
			{ id: 3, name: "instagram.com", url: "https://www.instagram.com/" },
			{ id: 4, name: "reddit.com", url: "https://www.reddit.com/" },
			{ id: 5, name: "tiktok.com", url: "https://www.tiktok.com/" },
		],
	});
	chrome.storage.local.set({ focusMode: false });
});

onMessage("updateBlockedUrls", async ({ data }) => {
	chrome.storage.local.set({ blockedUrls: data });
});
onMessage("focusActive", async ({ data }) => {
	handleFocusModeChange(data);
});
function handleFocusModeChange(isActive) {
	if (isActive) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.storage.local.get(["focusMode", "blockedUrls"], (result) => {
				const focusModeActive = result.focusMode || false;
				const blockedUrls = result.blockedUrls || [];
				if (focusModeActive && isBlockedUrl(blockedUrls, tabs[0]?.url ?? "")) {
					// Redirigir a la página de bloqueo si la URL está en la lista de bloqueadas
					chrome.tabs.update(tabs[0]?.id ?? 0, {
						url: chrome.runtime.getURL("/redirect/index.html"),
					});
				}
			});
		});

		chrome.tabs.onUpdated.addListener(checkAndBlockUrls);
	} else {
		// Cuando se desactive, dejar de monitorizar las pestañas
		chrome.tabs.onUpdated.removeListener(checkAndBlockUrls);
	}
}

function checkAndBlockUrls(
	tabId: number,
	changeInfo: chrome.tabs.TabChangeInfo,
	tab: chrome.tabs.Tab,
) {
	// console.log("🚀 ~ changeInfo:", changeInfo);

	chrome.storage.local.get(["focusMode", "blockedUrls"], (result) => {
		const focusModeActive = result.focusMode || false;
		const blockedUrls = result.blockedUrls || [];
		if (focusModeActive && isBlockedUrl(blockedUrls, tab?.url ?? "")) {
			// Redirigir a la página de bloqueo si la URL está en la lista de bloqueadas
			chrome.tabs.update(tabId, {
				url: chrome.runtime.getURL("/redirect/index.html"),
			});
		}
	});
}
