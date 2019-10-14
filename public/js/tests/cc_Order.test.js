const { Order } = require('../cc_Order');

describe('belongsToWeek', () => {
	it('should return TRUE if datestr() is same week as momentObj', () => {
		jest.mock('moment', () => () => ({ format: () => '2018–01–30T12:34:56+00:00' }));
		let localObj = new Order();
		expect(localObj.belongsToWeek('2019–19–10T12:34:56+00:00')).toBe(true);
	});
});
