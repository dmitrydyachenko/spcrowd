/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetContentTypesXml(data, fields, prefix, group) {
	if (data.length > 0) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const name = data[i].Name.trim();
			const type = data[i]['Parent Type'];

			const _attr = { 
				Name: `${prefix || ''}${ToCamelCase(name)}`, 
				ParentContentType: type ? type.replace(/\s+/g, '') : 'Item'
			};

			const contentType = { _attr };

			if (fields.length > 0) {
				const fieldsObject = [];

				for (let j = 0; j < fields.length; j++) {
					const value = fields[j][name];

					if (value) {
						fieldsObject.push({ 
							_attr: { 
								Name: fields[j]['Site Columns']
							}
						});
					}
				}

				if (fieldsObject.length > 0) {
					contentType.Fields = { Field: fieldsObject };
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