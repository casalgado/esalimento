class Print extends Html {
	constructor() {
		super();
		this.container = document.getElementById('printContainer');
	}

	addImage() {
		this.container.appendChild(HTML.create('img', 'logoHeader', 'invoiceImage', { src: 'img/logoNFB.png' }));
	}
}
