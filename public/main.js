// polyfill for window.scrollTo
/* eslint-disable */
!function () { "use strict"; function o() { var o = window, t = document; if (!("scrollBehavior" in t.documentElement.style && !0 !== o.__forceSmoothScrollPolyfill__)) { var l, e = o.HTMLElement || o.Element, r = 468, i = { scroll: o.scroll || o.scrollTo, scrollBy: o.scrollBy, elementScroll: e.prototype.scroll || n, scrollIntoView: e.prototype.scrollIntoView }, s = o.performance && o.performance.now ? o.performance.now.bind(o.performance) : Date.now, c = (l = o.navigator.userAgent, new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(l) ? 1 : 0); o.scroll = o.scrollTo = function () { void 0 !== arguments[0] && (!0 !== f(arguments[0]) ? h.call(o, t.body, void 0 !== arguments[0].left ? ~~arguments[0].left : o.scrollX || o.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : o.scrollY || o.pageYOffset) : i.scroll.call(o, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : o.scrollX || o.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : o.scrollY || o.pageYOffset)) }, o.scrollBy = function () { void 0 !== arguments[0] && (f(arguments[0]) ? i.scrollBy.call(o, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : h.call(o, t.body, ~~arguments[0].left + (o.scrollX || o.pageXOffset), ~~arguments[0].top + (o.scrollY || o.pageYOffset))) }, e.prototype.scroll = e.prototype.scrollTo = function () { if (void 0 !== arguments[0]) if (!0 !== f(arguments[0])) { var o = arguments[0].left, t = arguments[0].top; h.call(this, this, void 0 === o ? this.scrollLeft : ~~o, void 0 === t ? this.scrollTop : ~~t) } else { if ("number" == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError("Value could not be converted"); i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop) } }, e.prototype.scrollBy = function () { void 0 !== arguments[0] && (!0 !== f(arguments[0]) ? this.scroll({ left: ~~arguments[0].left + this.scrollLeft, top: ~~arguments[0].top + this.scrollTop, behavior: arguments[0].behavior }) : i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop)) }, e.prototype.scrollIntoView = function () { if (!0 !== f(arguments[0])) { var l = function (o) { for (; o !== t.body && !1 === (e = p(l = o, "Y") && a(l, "Y"), r = p(l, "X") && a(l, "X"), e || r);)o = o.parentNode || o.host; var l, e, r; return o }(this), e = l.getBoundingClientRect(), r = this.getBoundingClientRect(); l !== t.body ? (h.call(this, l, l.scrollLeft + r.left - e.left, l.scrollTop + r.top - e.top), "fixed" !== o.getComputedStyle(l).position && o.scrollBy({ left: e.left, top: e.top, behavior: "smooth" })) : o.scrollBy({ left: r.left, top: r.top, behavior: "smooth" }) } else i.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]) } } function n(o, t) { this.scrollLeft = o, this.scrollTop = t } function f(o) { if (null === o || "object" != typeof o || void 0 === o.behavior || "auto" === o.behavior || "instant" === o.behavior) return !0; if ("object" == typeof o && "smooth" === o.behavior) return !1; throw new TypeError("behavior member of ScrollOptions " + o.behavior + " is not a valid value for enumeration ScrollBehavior.") } function p(o, t) { return "Y" === t ? o.clientHeight + c < o.scrollHeight : "X" === t ? o.clientWidth + c < o.scrollWidth : void 0 } function a(t, l) { var e = o.getComputedStyle(t, null)["overflow" + l]; return "auto" === e || "scroll" === e } function d(t) { var l, e, i, c, n = (s() - t.startTime) / r; c = n = n > 1 ? 1 : n, l = .5 * (1 - Math.cos(Math.PI * c)), e = t.startX + (t.x - t.startX) * l, i = t.startY + (t.y - t.startY) * l, t.method.call(t.scrollable, e, i), e === t.x && i === t.y || o.requestAnimationFrame(d.bind(o, t)) } function h(l, e, r) { var c, f, p, a, h = s(); l === t.body ? (c = o, f = o.scrollX || o.pageXOffset, p = o.scrollY || o.pageYOffset, a = i.scroll) : (c = l, f = l.scrollLeft, p = l.scrollTop, a = n), d({ scrollable: c, method: a, startTime: h, startX: f, startY: p, x: e, y: r }) } } "object" == typeof exports && "undefined" != typeof module ? module.exports = { polyfill: o } : o() }();
/* eslint-enable */

// for query selectors
const richView = document.querySelector('.js-rich-view');
const matches = document.querySelectorAll('.js-grid-match');
const editButton = document.querySelector('.js-modal-edit-button');
const tableToggles = document.querySelectorAll('.js-table-toggle');
const wantToggles = document.querySelectorAll('.js-wants-toggle');
const filterToggle = document.querySelector('.js-filter-toggle');
const keyToggle = document.querySelector('.js-key-toggle');
const printViewToggle = document.querySelector('.js-print-view-toggle');

const show = (element) => element.classList.remove('hidden');
const hide = (element) => element.classList.add('hidden');

// update html to reflect config values
const colourOne = document.querySelector('.js-colour-one').innerHTML;
const colourTwo = document.querySelector('.js-colour-two') ? document.querySelector('.js-colour-two').innerHTML : 'ghostwhite';
const colourThree = document.querySelector('.js-colour-three') ? document.querySelector('.js-colour-three').innerHTML : 'ghostwhite';
const title = document.querySelector('.js-title').innerHTML;
document.querySelector(':root').style.setProperty('--primary-color', colourOne);
document.querySelector(':root').style.setProperty('--secondary-color', colourTwo);
document.querySelector(':root').style.setProperty('--tertiary-color', colourThree);
document.querySelector('title').innerHTML = title;

const toggleClickableSpan = (element) => {
	// e.g. toggle between 'Show More' / 'Show Less' clickable headings in the HTML
	hide(element);
	if (element.nextElementSibling) {
		show(element.nextElementSibling);
	} else {
		show(element.previousElementSibling);
	}
};

const getSeasonContainer = (event) => {
	let seasonContainer;
	// workaround to emulate event.path which is not available in Safari
	let element = event.target;
	while (element) {
		if (element.dataset && element.dataset.seasonString) {
			seasonContainer = element;
			break;
		} else {
			element = element.parentElement;
		}
	}
	return seasonContainer;
};

const hideModal = (event) => {
	const modal = document.querySelector('.js-modal');
	let element = event.target;
	let shouldClose = true;
	// workaround to emulate event.path which is not available in Safari
	while (element) {
		if (element.classList && element.classList.contains('js-modal') || element.classList && element.classList.contains('js-grid-match')) {
			shouldClose = false;
			break;
		} else {
			element = element.parentElement;
		}
	}
	if (shouldClose) { hide(modal); }
};

const showModal = (event) => {
	const modal = document.querySelector('.js-modal');
	const modalContentForm = document.querySelector('.js-modal-content-form');
	const modalEditable = document.querySelector('.js-modal-content-editable');
	const season = getSeasonContainer(event);
	const dataForModal = Array.from(event.srcElement.attributes);
	populateModalData(dataForModal);
	season.appendChild(modal); // position modal under correct season on page

	if (!document.querySelector('.js-form-password')) { populateForm(dataForModal); }

	// in case modal has been opened elsewhere and edit button clicked, reset to show info not form
	hide(modalContentForm);
	show(modalEditable);

	show(modal);

	// scroll to the modal
	const modalContent = modal.querySelector('.modal-content');
	const bodyRect = document.body.getBoundingClientRect();
	const modalRect = modalContent.getBoundingClientRect();
	const offsetTop = modalRect.top - (bodyRect.top + 120);
	const offsetLeft = modalRect.left - bodyRect.left;
	window.scrollTo({
		top: offsetTop,
		left: offsetLeft,
		behavior: 'smooth'
	});
};

const populateModalData = (eventAttrArray) => {
	eventAttrArray.forEach(attr => {
		// get the name of the data attribute without the 'data-' prefix
		const dataPointName = (attr.name).substring(5);
		const dataPointValue = attr.value;
		// first of all reset all datapoint values in the modal to blank to overwrite anything already there
		if (dataPointName && document.querySelector(`.js-modal-${dataPointName}`)) {
			document.querySelector(`.js-modal-${dataPointName}`).innerHTML = '';
		}
		// if data point value isn't undefined and there is a corresponding modal element
		if (dataPointValue && document.querySelector(`.js-modal-${dataPointName}`)) {
			let preamble = '';
			// add some explainer text to less obvious data points
			if (dataPointName === 'match_notes') {
				preamble = 'Match Notes: ';
			}
			if (dataPointName === 'price') {
				preamble = '<strong>Programme Price:</strong> ';
			}
			if (dataPointName === 'programme_notes') {
				preamble = '<strong>Programme Notes:</strong> ';
			}
			if (dataPointName === 'attendance') {
				preamble = 'Attendance: ';
			}
			if (dataPointName === 'other_items') {
				preamble = '<strong>Other Collection Items:</strong> ';
			}
			document.querySelector(`.js-modal-${dataPointName}`).innerHTML = `${preamble}${dataPointValue}` || '';
		}
	});
};

const populateForm = (eventAttrArray) => {
	// set placeholder values
	eventAttrArray.forEach(attr => {
		// get the name of the data attribute without the 'data-' prefix
		const dataPointName = (attr.name).substring(5);
		const dataPointValue = attr.value;

		if (document.querySelector(`.js-form-${dataPointName}`)) {
			document.querySelector(`.js-form-${dataPointName}`).value = `${dataPointValue}` || '';
		}
		if (dataPointName === 'programme_got_want' && !!dataPointValue) {
			const radioOne = document.querySelector('.js-form-programme-want');
			const radioTwo = document.querySelector('.js-form-programme-got');
			setRadioPlaceholders(dataPointName, eventAttrArray, radioOne, radioTwo);
		}
		if (dataPointName === 'ticket_got_want' && !!dataPointValue) {
			const radioOne = document.querySelector('.js-form-ticket-want');
			const radioTwo = document.querySelector('.js-form-ticket-got');
			setRadioPlaceholders(dataPointName, eventAttrArray, radioOne, radioTwo);
		}
	});
};

const setRadioPlaceholders = (dataPointName, eventAttrArray, radioOne, radioTwo) => {
	// remove current radio button selection
	radioOne.removeAttribute('checked');
	radioTwo.removeAttribute('checked');

	// set correct value to checked
	eventAttrArray.forEach(attr => {
		if (attr.name === `data-${dataPointName}`) {
			if (attr.value === radioOne.value) {
				radioOne.setAttribute('checked', 'checked');
			} else {
				radioTwo.setAttribute('checked', 'checked');
			}
		}
	});
};

const showForm = () => {
	const modalContentForm = document.querySelector('.js-modal-content-form');
	const modalEditable = document.querySelector('.js-modal-content-editable');
	show(modalContentForm);
	hide(modalEditable);
};

const toggleFilter = (event) => {
	toggleClickableSpan(event.srcElement);
	const filter = document.querySelector('.js-filter-form');
	if (filter.classList.contains('hidden')) {
		show(filter);
	} else {
		hide(filter);
	}
};

const toggleKey = (event) => {
	toggleClickableSpan(event.srcElement);
	const key = document.querySelector('.js-key');
	if (key.classList.contains('hidden')) {
		show(key);
	} else {
		hide(key);
	}
};

const toggleWants = (event) => {
	toggleClickableSpan(event.srcElement);
	const seasonContainer = getSeasonContainer(event);
	const matchCells = seasonContainer.querySelectorAll('td');

	if (event.srcElement.classList.contains('js-show-wants')) {
		matchCells.forEach(cell => {
			// hide all rows then remove 'hidden' if any cells contain 'Want' - enables showing wants for programmes and tickets
			cell.parentNode.classList.add('hidden');
			if (cell.innerHTML === 'Want') {
				cell.parentNode.classList.remove('hidden');
			}
		});
	} else {
		matchCells.forEach(cell => show(cell.parentNode));
	}
};

const toggleTable = (event) => {
	const seasonContainer = getSeasonContainer(event);
	const table = seasonContainer.querySelector('.js-games-table');
	const dots = seasonContainer.querySelector('.js-games-dots-container');
	const wantsToggle = seasonContainer.querySelector('.js-wants-toggle');
	const showAllSpan = seasonContainer.querySelector('.js-show-all');
	const modal = document.querySelector('.js-modal');

	if (!modal.classList.contains('hidden')) { hide(modal); }
	if (event.srcElement.classList.contains('js-show-more')) {
		hide(dots);
		show(table);
		if (wantsToggle) {
			show(wantsToggle);
		}
	} else {
		if (wantsToggle) {
			hide(wantsToggle);
		}
		hide(table);
		show(dots);

		// when hiding table also unfilter 'wants' back to full list
		toggleWants(event);
		toggleClickableSpan(showAllSpan);
	}
	toggleClickableSpan(event.srcElement);
};

const togglePrintView = (event) => {
	const printView = document.querySelector('.js-print-view');
	const richView = document.querySelector('.js-rich-view');
	const richViewContainer = document.querySelector('.js-rich-view__container');
	toggleClickableSpan(event.srcElement);

	if (printView.classList.contains('hidden')) {
		hide(richView);
		richViewContainer.classList.add('hide-border');
		show(printView);
	} else {
		hide(printView);
		richViewContainer.classList.remove('hide-border');
		show(richView);
	}
};

tableToggles.forEach(toggle => toggle.addEventListener('click', e => toggleTable(e)));
matches.forEach(match => match.addEventListener('click', e => showModal(e)));
wantToggles.forEach(toggle => toggle.addEventListener('click', e => toggleWants(e)));
editButton.addEventListener('click', e => showForm(e));
filterToggle.addEventListener('click', e => toggleFilter(e));
if (keyToggle) { keyToggle.addEventListener('click', e => toggleKey(e)); }
if (printViewToggle) { printViewToggle.addEventListener('click', e => togglePrintView(e)); }
richView.addEventListener('click', e => hideModal(e));
