/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetContentTypesXml(data, fields, prefix, group) {
	if (data.length > 0) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const name = data[i].Name;
			const type = data[i]['Parent Type'];

			const _attr = { 
				Name: `${prefix || ''}${ToCamelCase(name)}`, 
				ParentContentType: type ? type.replace(/\s+/g, '') : 'Item'
			};

			const contentType = { _attr };

			if () {
				contentType.Fields = { 
					Field: { 
						_attr: { 
							Name: 'Field Name'
						}
					}  
				}
			}

			formattedData.push(contentType);
		}

		let xml = convert('ContentType', formattedData);
		xml = `<ContentTypes Group="${group}">${xml}</ContentTypes>`;

		console.log(xml);

		return xml;
	}

	return null;
}