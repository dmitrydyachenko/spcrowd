/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetListsXml(data, prefix) {
	if (data.length > 0) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const name = data[i].Name.trim();
			const type = data[i].Type;
			const lowerCaseType = type ? type.toLowerCase().replace(/\s+/g, '') : '';

			if (lowerCaseType !== 'system') {
				const _attr = { 
					Name: `${prefix || ''}${ToCamelCase(name)}`, 
					Type: type ? type.replace(/\s+/g, '') : 'GenericList'
				};

				const list = { _attr };

				list.ContentTypes = { 
					ContentType: { 
						_attr: { 
							Name: name
						}
					} 
				};

				formattedData.push(list);
			}
		}

		let xml = convert('List', formattedData);
		xml = `<Lists>${xml}</Lists>`;

		console.log(xml);

		return xml;
	}

	return null;
}