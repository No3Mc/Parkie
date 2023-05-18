const profileBtn = document.getElementById('profile-btn');
const cardsBtn = document.getElementById('cards-btn');
const iframeContainer = document.getElementById('iframe-container');

profileBtn.addEventListener('click', () => {
	iframeContainer.innerHTML = '<iframe src="/MngProfile"></iframe>';
	iframeContainer.style.display = 'block';
});


iframeContainer.addEventListener('click', () => {
	iframeContainer.style.display = 'none';
	iframeContainer.innerHTML = '';
});
