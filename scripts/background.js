
const scroll = (object, sender) => {
	console.log('--scroll', object)
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
	chrome.tabs.getCurrent((tab) => {
		if (tab == null) {
			return
		}
		chrome.tabs.update(tab.id, {
			active: true,
		})
	})
}

const move = (object, sender) => {
	console.log('--move')
	chrome.tabs.query({
		currentWindow: true, highlighted: true,
	}, (tabs) => {
		const array = tabs.map((tab) => {
			console.log(tab.id, tab)
			return tab.id
		})
		const index = tabs.reduce((accumulator, tab) => {
			return accumulator.index < tab.index ? accumulator : tab
		}).index - (object.positive ? -1 : 1)
		if (object.positive) {
			chrome.tabs.move(array, {
				index: -1,
			})
		}
		chrome.tabs.move(array, {
			index: index < 0 ? 0 : index,
		})
	})
}

const highlight = (object, sender) => {
	console.log('--highlight')
	const index = sender.tab.index - (object.positive ? -1 : 1)
	chrome.tabs.highlight({
		tabs: index,
		// windowId: sender.tab.windowId,
	})
}

const status = (object, sender) => {
	console.log('--status', sender.tab.index, object.right, object.bottom)
	if (sender.tab == null) {
		return
	}
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
		move, highlight, scroll, status,
	}
	array[message.key](message.object, sender, sendResponse)
})

const activate = (tabs) => {
	for (const tab of tabs) {
		chrome.tabs.sendMessage(tab.id, {
			key: 'activate',
		}, (response) => {
			console.log('response', response)
		})
	}
}

chrome.commands.onCommand.addListener((command, tab) => {
	if (command === 'activate') {
		chrome.tabs.query({
			active: true, currentWindow: true,
		}, activate)
	}
})
