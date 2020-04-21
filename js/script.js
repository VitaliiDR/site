let button = document.getElementById('btn');
let span = document.getElementById('span');
let count = 0;
count = parseInt(count);

	button.addEventListener('click', () => {
		count++;
		span.innerHTML = count;
	});