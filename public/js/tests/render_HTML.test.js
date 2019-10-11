const { Html } = require('../render_HTML');

describe('add', () => {
	it('should add a to b', () => {
		let localObj = new Html();
		expect(localObj.add(2, 3)).toBe(5);
	});
});
