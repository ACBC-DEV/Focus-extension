const getBlockedUrls = async () => {
	const blockedUrls = await chrome.storage.local.get("blockedUrls");
	return blockedUrls;
};
export const isBlockedUrl = async (url) => {
	const blockedUrls = await getBlockedUrls();
	return blockedUrls.some((blockedUrl) =>
		new URL(url).href.includes(new URL(blockedUrl).hostname),
	);
};
chrome.runtime.onInstalled.addListener(async () => {
	chrome.storage.local.set({
		blockedUrls: [
			{ id: 0, name: "youtube.com", url: "*://www.youtube.com/*" },
			{ id: 1, name: "facebook.com", url: "*://www.facebook.com/*" },
			{ id: 2, name: "twitter.com", url: "https://twitter.com/" },
			{ id: 3, name: "instagram.com", url: "https://www.instagram.com/" },
			{ id: 4, name: "reddit.com", url: "https://www.reddit.com/" },
			{ id: 5, name: "tiktok.com", url: "https://www.tiktok.com/" },
		],
	});
	chrome.storage.local.set({ focusMode: false });
	console.log("background.js installed");
});

chrome.runtime.onMessage.addListener(async (message) => {
	console.log(message);
});

console.log("background.js loaded");
