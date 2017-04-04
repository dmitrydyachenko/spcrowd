/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetListsXml(data) {
	const convert = Data2xml({ xmlDecl: false });
	const formattedData = [];

	for (let i = 0; i < data.length; i++) {
		const type = data[i].Type;
		const lowerCaseType = type ? type.toLowerCase().replace(/\s+/g, '') : '';

		if (lowerCaseType !== 'system') {
			const _attr = { 
				Name: ToCamelCase(data[i].Name), 
				Type: lowerCaseType && lowerCaseType === 'library' ? 'DocumentLibrary' : 'GenericList'
			};

			const list = { _attr };

			formattedData.push(list);
		}
	}

	let xml = convert('List', formattedData);
	xml = `<Lists>${xml}</Lists>`;

	console.log(xml);

	return xml;
}