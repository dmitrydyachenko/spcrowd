/* External libraries */
import Data2xml from 'data2xml';

export function GetGroupsXml(data) {
	const convert = Data2xml({ xmlDecl: false });
	const formattedData = [];

	for (let i = 0; i < data.length; i++) {
		const _attr = { 
			Name: data[i].Name, 
			PermissionLevel: data[i]['Permission Level'] || 'Read'
		};

		const group = { _attr };

		formattedData.push(group);
	}

	let xml = convert('Group', formattedData);
	xml = `<Groups>${xml}</Groups>`;

	console.log(xml);

	return xml;
}