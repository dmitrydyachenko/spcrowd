import Data2xml from 'data2xml';

export function GetListsXml(data, prefix, useListPrefix, useContentTypePrefix) {
	if (data.length > 0) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const name = data[i].Name.trim();
			const type = data[i].Type;

			const list = {
				_attr: { 
					Name: `${useListPrefix ? (prefix || '') : ''}${name}`, 
					Template: type ? type.replace(/\s+/g, '') : 'GenericList'
				},
				ContentTypes: { 
					ContentType: { 
						_attr: { 
							Name: `${useContentTypePrefix ? (prefix || '') : ''}${name}` 
						}
					} 
				}
			};

			formattedData.push(list);
		}

		let xml = convert('List', formattedData);
		xml = `<Lists>${xml}</Lists>`;

		console.log(xml);

		return xml;
	}

	return null;
}