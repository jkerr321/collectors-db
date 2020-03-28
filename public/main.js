// for query selectors
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
const tableColour = document.querySelector('.js-table-colour') ? document.querySelector('.js-table-colour').innerHTML : 'ghostwhite';
const title = document.querySelector('.js-title').innerHTML;
document.querySelector(':root').style.setProperty('--primary-color', colourOne);
document.querySelector(':root').style.setProperty('--secondary-color', colourTwo);
document.querySelector(':root').style.setProperty('--tertiary-color', colourThree);
document.querySelector(':root').style.setProperty('--table-color', tableColour);
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
			if (dataPointName === 'notes') {
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
		if (dataPointName === 'programme_got_want' || dataPointName === 'ticket_got_want' && !!dataPointValue) {
			setRadioPlaceholders(dataPointName, eventAttrArray);
		}
	});
};

const setRadioPlaceholders = (dataPointName, eventAttrArray) => {
	let item;
	if(dataPointName === 'programme_got_want') {
		item = 'programme';
	} else {
		item = 'ticket';
	}

	const formWant = document.querySelector(`.js-form-${item}-want`);
	const formGot = document.querySelector(`.js-form-${item}-got`);

	// remove current radio button selection
	formGot.removeAttribute('checked');
	formWant.removeAttribute('checked');

	// set correct value to checked
	eventAttrArray.forEach(attr => {
		if (attr.name === `data-${item}_got_want`) {
			if (attr.value === 'Got') {
				formGot.setAttribute('checked', 'checked');
			} else {
				formWant.setAttribute('checked', 'checked');
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
			if (cell.innerHTML === 'Got') {
				cell.parentNode.classList.add('hidden');
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

module.exports = togglePrintView;