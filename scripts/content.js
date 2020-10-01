
const limit = 1000
const piece = 32
const pitch = Math.PI / 2
const ratio = 1

const setify = () => {
	return new Set()
}

const negative = [setify(), setify()]
const positive = [setify(), setify()]

const cos = (value) => {
	return Math.cos(value)
}

const sign = (value) => {
	return Math.sign(value)
}

const push = (values, value) => {
	const dealy = value + limit - Date.now()
	values.add(value)
	setTimeout(() => {
		values.delete(value)
	}, dealy)
}

const calculate = (array) => {
	const value = Date.now()
	return array.map((shift, index) => {
		const values = (shift < 0 ? negative : positive)[index]
		const array = [...values.values()]
		if (shift) {
			push(values, value)
		}
		shift *= piece
		return array.reduce((accumulator, stamp) => {
			const delta = value - stamp
			return accumulator + shift * ratio * cos(pitch * delta / limit) ** 2
		}, shift)
	})
}

const scroll = (object) => {
	if (window === object.element) {
		object.element.scrollLeft += object.right
		object.element.scrollTop += object.bottom
	} else {
		window.scrollBy(object.right, object.bottom)
	}
}

window.addEventListener('mousewheel', (event) => {
	if (event.type !== 'mousewheel' || event.ctrlKey || event.metaKey) {
		return
	}
	if (event.altKey && event.shiftKey == null) {
		chrome.runtime.sendMessage({
			object, key: 'scroll',
		})
	} else {
		const array = [event.deltaX, event.deltaY].map(sign)
		const [right, bottom] = calculate(array)
		const object = {
			element: event.target, right, bottom,
		}
		event.preventDefault()
		chrome.runtime.sendMessage({
			object, key: 'status',
		})
		scroll(object)
	}
}, {
	passive: false,
})
