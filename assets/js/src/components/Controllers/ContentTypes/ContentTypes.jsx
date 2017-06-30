import Data2xml from 'data2xml';
import { ToCamelCase } from '../../../utils/utils';

export function GetContentTypesXml(data, fields, prefix, group, useContentTypePrefix) {
	if (data.length > 0) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const name = data[i].Name.trim();
			const type = data[i]['Parent Type'];
											
			const contentType = { 
				_attr: { 
					Name: `${useContentTypePrefix ? (prefix || '') : ''}${name}`, 
					ParentContentType: type ? type : 'Item'
				}
			};

			if (fields.length > 0) {
				const fieldsObject = [];

				for (let j = 0; j < fields.length; j++) {
					const value = fields[j][name];

					if (value) {
						let fieldName = fields[j]['Site Columns'].trim();

						switch (fieldName.toLowerCase().replace(/\s+/g, '')) {
							case 'title':
								fieldName = '';
								break;
							default:
								fieldName = `${prefix || ''}${ToCamelCase(fieldName, true)}`;
								break;
						}

						if (fieldName) {
							const attr = { 
								_attr: { 
									Name: fieldName
								}
							};

							if (value.toLowerCase() === 'r') {
								attr._attr.Required = 'True';
							}

							fieldsObject.push(attr);
						}
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