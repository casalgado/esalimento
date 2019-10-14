const { Sheet, zeroPad } = require('../cb_Sheet');

describe('zeroPad', () => {
	it('should add the zeros correctly 1,2', () => {
		expect(zeroPad(1, 2)).toBe('01');
	});

	it('should add the zeros correctly 1,3', () => {
		expect(zeroPad(2, 3)).toBe('002');
	});

	it('should add the zeros correctly 2,3', () => {
		expect(zeroPad(12, 3)).toBe('012');
	});
});

describe('belongsToWeek', () => {
	it('should return TRUE if datestr() is same week as momentObj', () => {
		jest.mock('moment', () => () => ({ format: () => '2018–01–30T12:34:56+00:00' }));
		let localObj = new Sheet();
		expect(localObj.belongsToWeek('2019–19–10T12:34:56+00:00')).toBe(true);
	});
});

describe('add', () => {
	it('should add a to b', () => {
		let localObj = new Sheet();
		expect(localObj.add(2, 3).toBe(5));
	});
});
