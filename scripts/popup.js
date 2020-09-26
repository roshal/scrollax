
const element = document.createElement('button')

document.body.appendChild(element)

chrome.storage.sync.get('color', (items) => {
	element.style.backgroundColor = items.color
	element.style.color = 'white'
	element.innerText = items.color
})

chrome.storage.sync.get('value', (items) => {
	element.innerText = items.value
})

element.onclick = (element) => {
	const code = [
		'document.body.style.backgroundColor', '=', JSON.stringify(element.target.innerText),
	].join(' ')
	chrome.tabs.query({
		active: true, currentWindow: true,
	}, (tabs) => {
		const tab = tabs[0]
		if (tab == null) {
			return
		}
		chrome.tabs.executeScript(tab.id, {
			code,
		})
	})
}
