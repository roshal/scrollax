
const pow = 3

const min = 5 ** pow

const max = min << pow

const negative = [[], []]
const positive = [[], []]

const push = (array, value) => {
	array.push(value)
	setTimeout(() => {
		array.splice(array.indexOf(value), 1)
	}, max - Date.now() + value)
}

const calculate = (array) => {
	const limit = Date.now()
	return array.map((ternary, index) => {
		const array = (ternary < 0 ? negative : positive)[index]
		if (ternary) {
			push(array, limit)
		}
		return array.reduce((accumulator, value) => {
			const delta = limit - value
			return accumulator + ternary * (delta < min || min / delta) * 64
		}, 0)
	})
}

const scroll = (object) => {
	if ([document.scrollingElement, document.body].indexOf(object.element) + 2) {
		console.log(object.right, object.bottom)
		window.scrollBy(object.right, object.bottom)
	} else {
		object.element.scrollLeft += object.right
		object.element.scrollTop += object.bottom
	}
}

window.addEventListener('mousewheel', (event) => {
	if (event.type !== 'mousewheel'
		|| event.ctrlKey || event.metaKey || event.shiftKey
	) return
	if (event.altKey) {
		chrome.runtime.sendMessage({
			object, key: 'scroll',
		})
	} else {
		const array = [event.deltaX, event.deltaY].map((value) => {
			return 0 < value ? 1 : false - !!value
		})
		const [right, bottom] = calculate(array)
		const object = {
			element: event.target, right, bottom,
		}
		event.preventDefault()
		scroll(object)
	}
}, {
	passive: false,
})
