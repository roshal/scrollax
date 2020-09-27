
// stable version is 62

fetch('/stable.css').then((response) => {
	return response.text()
}).then((styles) => {
	return chrome.devtools.panels.applyStyleSheet(styles)
}).catch((error) => {
	//console.error(error)
})
