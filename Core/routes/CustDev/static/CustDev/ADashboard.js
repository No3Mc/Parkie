const botBtn = document.getElementById('bot-btn');
const custsBtn = document.getElementById('custs-btn');
const promoBtn = document.getElementById('promo-btn');
const dafaqBtn = document.getElementById('dafaq-btn');

const iframeContainer = document.getElementById('iframe-container');

botBtn.addEventListener('click', () => {
	iframeContainer.innerHTML = '<iframe src="/bawt"></iframe>';
	iframeContainer.style.display = 'block';
});

custsBtn.addEventListener('click', () => {
	iframeContainer.innerHTML = '<iframe src="/MngCusts"></iframe>';
	iframeContainer.style.display = 'block';
});

promoBtn.addEventListener('click', () => {
	iframeContainer.innerHTML = '<iframe src="/MngPromos"></iframe>';
	iframeContainer.style.display = 'block';
});

dafaqBtn.addEventListener('click', () => {
	iframeContainer.innerHTML = '<iframe src="/help"></iframe>';
	iframeContainer.style.display = 'block';
});





iframeContainer.addEventListener('click', () => {
	iframeContainer.style.display = 'none';
	iframeContainer.innerHTML = '';
});
