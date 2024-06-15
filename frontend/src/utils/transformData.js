const transformData = (source, data) => {
	if (
		source === 'resnet50' ||
		source === 'mitb5' ||
		source === 'food' ||
		source === 'bird' ||
		source === 'realestate'
	) {
		const countMap = {};

		data.forEach((item) => {
			const label = item.label;
			if (countMap[label]) {
				countMap[label]++;
			} else {
				countMap[label] = 1;
			}
		});

		return Object.keys(countMap).map((label) => {
			let obj = {};
			obj[label] = countMap[label];
			return obj;
		});
	} else if (source === 'age' || source === 'emotions') {
		return data.map((item, index) => {
			let personKey = `person${index + 1}`;
			let obj = {};
			obj[personKey] = item.label;
			return obj;
		});
	} else {
		return data;
	}
};

export default transformData;
