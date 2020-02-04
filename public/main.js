// for query selectors
const matches = document.querySelectorAll('.js-grid-match');
const editButton = document.querySelector('.js-modal-edit-button');
const tableToggles = document.querySelectorAll('.js-table-toggle');
const wantToggles = document.querySelectorAll('.js-wants-toggle');
const filterToggle = document.querySelector('.js-filter-toggle');
const printViewToggle = document.querySelector('.js-print-view-toggle');
const dataPoints = ['season', 'league', 'date', 'opponent', 'home_away', 'score', 'competition', 'match_notes', 'got_want', 'price', 'notes', 'id'];

const show = (element) => element.classList.remove('hidden');
const hide = (element) => element.classList.add('hidden');

// update html to reflect config values
const colourOne = document.querySelector('.js-colour-one').innerHTML;
const colourTwo = document.querySelector('.js-colour-two').innerHTML;
const title = document.querySelector('.js-title').innerHTML;
document.querySelector(':root').style.setProperty('--primary-color', colourOne);
document.querySelector(':root').style.setProperty('--secondary-color', colourTwo);
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

	// modalInfo = {
	// 	season: '1908/09',
	// 	opponent: 'Tranmere Rovers',
	// 	etc...
	// }
	let modalInfo = {};
	dataPoints.forEach(dataPoint => {
		modalInfo[dataPoint] = event.srcElement.attributes[`data-${dataPoint}`].value;
	});

	populateModalData(modalInfo);
	season.appendChild(modal); // position modal under correct season on page

	populateForm(modalInfo);

	// in case modal has been opened elsewhere and edit button clicked, reset to show info not form
	hide(modalContentForm);
	show(modalEditable);

	show(modal);

	// TODO THIS DOESN'T WORK
	// const modalContent = modal.querySelector('.modal-content');
	// const position = modalContent.getBoundingClientRect();
	// console.log('==================');
	// console.log('modal', modal);
	// console.log('==================');

	// console.log('==================');
	// console.log('position', position);
	// console.log('==================');
	// window.scrollTo({
	// 	top: position.top,
	// 	left: position.left,
	// 	behavior: 'smooth'
	// });
};

const populateModalData = (modalInfo) => {
	dataPoints.forEach(dataPoint => {
		if (document.querySelector(`.js-modal-${dataPoint}`)) {
			let preamble = '';
			// add some explainer text to less obvious data points
			if (modalInfo[dataPoint] && dataPoint === 'match_notes') {
				preamble = 'Match Notes: ';
			}
			if (modalInfo[dataPoint] && dataPoint === 'price') {
				preamble = 'Programme Price: ';
			}
			if (modalInfo[dataPoint] && dataPoint === 'notes') {
				preamble = 'Programme Notes: ';
			}
			document.querySelector(`.js-modal-${dataPoint}`).innerHTML = `${preamble}${modalInfo[dataPoint]}` || '';
		}
	});
};

const populateForm = (modalInfo) => {
	// set placeholder values
	dataPoints.forEach(dataPoint => {
		if (document.querySelector(`.js-form-${dataPoint}`)) {
			document.querySelector(`.js-form-${dataPoint}`).placeholder = `${modalInfo[dataPoint]}` || '';
		}
	});

	document.querySelector('.js-form-id').value = modalInfo.id;

	const formWant = document.querySelector('.js-form-want');
	const formGot = document.querySelector('.js-form-got');

	// remove current radio button selection
	formGot.removeAttribute('checked');
	formWant.removeAttribute('checked');

	if (modalInfo.got_want === 'Got') {
		formGot.setAttribute('checked', '');
	} else {
		formWant.setAttribute('checked', '');
	}
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
	if(filter.classList.contains('hidden')) {
		show(filter);
	} else {
		hide(filter);
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
	const dots = seasonContainer.querySelector('.js-games-dots');
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
	toggleClickableSpan(event.srcElement);

	if (printView.classList.contains('hidden')) {
		hide(richView);
		show(printView);
	} else {
		hide(printView);
		show(richView);
	}
};

tableToggles.forEach(toggle => toggle.addEventListener('click', e => toggleTable(e)));
matches.forEach(match => match.addEventListener('click', e => showModal(e)));
wantToggles.forEach(toggle => toggle.addEventListener('click', e => toggleWants(e)));
editButton.addEventListener('click', e => showForm(e));
filterToggle.addEventListener('click', e => toggleFilter(e));
if(printViewToggle) { printViewToggle.addEventListener('click', e => togglePrintView(e)); }
