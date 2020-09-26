
const colors = [
	'#000',
	'#fff',
	'#f00',
	'#ff0',
	'#0f0',
	'#0ff',
	'#00f',
	'#f0f',
]

for (const color of colors) {
	const element = document.createElement('button')
	element.style.backgroundColor = color
	element.addEventListener('click', () => {
		chrome.storage.sync.set({
			color,
		}, () => {
			const string = ['color', 'is', color].join(' ')
			console.log(string)
		})
	})
	document.body.appendChild(element)
}
