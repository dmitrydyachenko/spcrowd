/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetContentTypesXml(data, namespaces) {
	const convert = Data2xml({ xmlDecl: false });
	const formattedData = [];

	for (let i = 0; i < data.length; i++) {
		const type = data[i]['Parent Type'];
		const lowerCaseType = type ? type.toLowerCase().replace(/\s+/g, '') : '';

		const _attr = { 
			Name: ToCamelCase(data[i].Name), 
			ParentContentType: type ? type.replace(/\s+/g, '') : 'Item'
		};

		const contentType = { _attr };

		formattedData.push(contentType);
	}

	let xml = convert('ContentType', formattedData);
	xml = `<ContentTypes Group="${namespaces.group}">${xml}</ContentTypes>`;

	console.log(xml);

	return xml;
}