
const scroll = (object, sender) => {
	if (sender.tab == null) {
		return
	}
	console.log('scroll', object)
	const index = (() => {
		if (0 < object.y) {
			return sender.tab.index + 1
		}
		if (object.y < 0) {
			return sender.tab.index - 1
		}
	})()
	if (index == null) {
		return
	}
	chrome.storage.sync.set({
		value: object.y,
	})
	chrome.tabs.query({
		index, windowId: sender.tab.windowId,
	}, (tabs) => {
		const tab = tabs[0]
		if (tab) {
			chrome.tabs.update(tab.id, {
				active: true,
			})
		}
	})
}

const status = (object, sender) => {
	if (sender.tab == null) {
		return
	}
	console.log('status', sender.tab.index, object.right, object.bottom)
}

const rule = {
	conditions: [
		new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {
				hostSuffix: 'roshal.online',
			},
		}),
	],
	actions: [
		new chrome.declarativeContent.ShowPageAction(),
	],
}

chrome.runtime.onInstalled.addListener((details) => {
	console.log('details.reason', '=', details.reason)
	chrome.storage.sync.set({
		color: '#000',
	}, () => {
		console.log('the color is black')
	})
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		chrome.declarativeContent.onPageChanged.addRules([rule]);
	});
})

//chrome.runtime.onInstalled.addListener(() => {
//	chrome.tabs.query({}, (tabs) => {
//		for (const tab of tabs) {
//			if (/^chrome\W/.test(tab.url) === false) {
//				continue
//			}
//			chrome.tabs.executeScript(tab.id, {
//				file: '/scripts/main.js',
//			})
//		}
//	})
//})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const array = {
		scroll, status,
	}
	array[message.key](message.object, sender, sendResponse)
})
