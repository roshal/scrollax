
const keys = ['limit', 'piece', 'pitch', 'ratio']

for (const key of keys) {
	const element = document.createElement('input')
	chrome.storage.sync.get(key, (object) => {
		element.value = object[key]
	})
	element.addEventListener('change', (event) => {
		chrome.storage.sync.set({
			[key]: event.target.value,
		}, () => {
			console.log(key, event.target.value)
		})
	})
	document.body.appendChild(element)
}
