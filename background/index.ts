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
			{ id: 1, name: "youtube.com", url: "https://www.youtube.com/" },
			{ id: 2, name: "facebook.com", url: "https://www.facebook.com/" },
			{ id: 3, name: "twitter.com (x)", url: "https://x.com/" },
			{ id: 4, name: "instagram.com", url: "https://www.instagram.com/" },
			{ id: 6, name: "reddit.com", url: "https://www.reddit.com/" },
			{ id: 7, name: "tiktok.com", url: "https://www.tiktok.com/" },
		],
	});
	chrome.storage.local.set({ focusMode: false });
});
// const rulesr: chrome.declarativeNetRequest.Rule[] = [];
onMessage("focusActive", async ({ data }) => {
	await cleanRules();
	// console.log(data);
	// console.log(typeof data);

	if (typeof data === "boolean") {
		await handleFocusModeChange(data);
	}
});
// |https://www.google.com/
async function cleanRules() {
	const currentUrl = await chrome.declarativeNetRequest.getDynamicRules();
	const rulesIds = currentUrl.map((dt) => dt.id);
	chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: rulesIds,
	});
}
async function handleFocusModeChange(isActive: boolean) {
	if (isActive) {
		chrome.storage.local.get(["blockedUrls"], async (result) => {
			// console.log(result.blockedUrls);
			const rulesInternas = result.blockedUrls.map((dt) => ({
				id: dt.id,
				priority: 1,
				condition: {
					urlFilter: `|${dt.url}`,
					resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
				},
				action: {
					type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
					redirect: {
						extensionPath: "/redirect/index.html",
					},
				},
			}));
			// console.log(rulesInternas);
			chrome.declarativeNetRequest.updateDynamicRules({
				addRules: rulesInternas,
				removeRuleIds: [],
			});
		});
		const a = await chrome.declarativeNetRequest.getDynamicRules();
		// console.log("curetetActived", a);
		// console.log("activado");
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
		const activadedRules = await chrome.declarativeNetRequest.getDynamicRules();
		const rulesIds = activadedRules.map((rule) => rule.id);
		chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: rulesIds,
		});

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
