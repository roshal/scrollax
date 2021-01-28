
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
			accumulator += shift * ratio * cos(pitch * delta / limit) ** 2
			return 1024 < accumulator ? 1024 : accumulator
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

const generate = (event) => {
	if (event.metaKey) {
		return
	}
	const array = [event.deltaX, event.deltaY].map(sign)
	const [right, bottom] = calculate(array)
	const object = {
		right, bottom, element: event.target,
	}
	if (event.altKey) {
		return {
			object, key: 'scroll',
		}
	}
	event.preventDefault()
	if (event.shiftKey) {
		object.positive = 0 < event.deltaY
		return {
			object, key: event.ctrlKey ? 'move' : 'update',
		}
	}
	scroll(object)
	return {
		object, key: 'status',
	}
}

const wheel = (event) => {
	const object = generate(event)
	if (object && typeof chrome.app.isInstalled !== 'undefined') {
		chrome.runtime.sendMessage(object)
	}
}

const activate = () => {
	window.addEventListener('wheel', wheel, {
		passive: false,
	})
}

chrome.runtime.onMessage.addListener((message, sender, send) => {
	if (message.key === 'activate') {
		send(9876543210)
		activate()
	}
})

activate()

window.addEventListener('keydown', (event) => {
	if (event.altKey || event.metaKey) {
		return
	}
	console.log(event)
	if (event.ctrlKey && event.key === ' ') {
		scroll({
			element: window,
			bottom: event.shiftKey ? -256 : 256,
		})
		event.preventDefault()
	}
})

window.addEventListener('scroll', (event) => {
	console.log(9, event)
})
