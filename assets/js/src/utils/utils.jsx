import $ from 'jquery';
import Moment from 'moment';

export function GetAssetsPath(projectName) {
	return `${_spPageContextInfo.siteAbsoluteUrl}/Style%20Library/${projectName}/`;
}

export function GetEqNeqOrAndFilter(fields, values, comp, cond) {
	let filterString = '';

	for (let i = 0; i < fields.length; i++) {
		for (let j = 0; j < values.length; j++) {
			filterString += (`${fields[i]} ${comp || 'eq'} ${values[j] === 1 || values[j] === 0 ? values[j] : `'${values[j]}'`} ${cond || 'or'} `);
		}
	}

	return filterString.trim().replace(/ or$| and$/, '');
}

export function GetSubStringOfFilter(value, fields, cond) {
	let filterString = '';

	for (let i = 0; i < fields.length; i++) {
		const condition = cond || 'or';
		filterString += (`substringof('${value}', ${fields[i]}) ${condition} `);
	}

	return filterString.trim().replace(/ or$| and$/, '');
}

export function MergeObjects(obj1, obj2) {
	const obj3 = {};

	if (obj1) {
		Object.keys(obj1).forEach((key) => {
			obj3[key] = obj1[key];
		});
	}

	if (obj2) {
		Object.keys(obj2).forEach((key) => {
			obj3[key] = obj2[key];
		});
	}

	return obj3;
}

export function JoinQuery(query1, query2, cond) {
	return (query1 && query2 ? `(${query1}) ${cond} (${query2})` : (query1 || query2));
}

export function CompareByTitle(a, b) {
	return (a.title < b.title ? -1 : (a.title > b.title ? 1 : 0));
}

export function CompareByCreated(a, b) {
	const newA = Moment(a.Created);
	const newB = Moment(b.Created);
	const diff = newA.diff(newB);
	return diff < 0 ? 1 : diff > 0 ? -1 : 0;
}

export function CreateMarkup(htmlString) {
	return {
		__html: htmlString
	};
}

export function RedirectToPage(pageUrl) {
	window.location.href = pageUrl;
}

export function ListUserProfileProperties(results) {
	for (let i = 0; i < results.length; i++) {
		console.log(`Key: ${results[i].Key} Value: ${results[i].Value}`);
	}
}

export function DetectIE() {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf('MSIE ');

	if (msie > 0) {
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	const trident = ua.indexOf('Trident/');

	if (trident > 0) {
		const rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	const edge = ua.indexOf('Edge/');

	if (edge > 0) {
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	return false;
}

export function GetFileNameFromUrl(url) {
	const splittedUrl = url.split('/');
	const splittedUrlLength = splittedUrl.length;
	return splittedUrlLength > 0 ? splittedUrl[splittedUrlLength - 1] : '';
}

export function IfArrayContainsObject(array, property, value) {
	const index = -1;

	if (value) {
		for (let i = 0; i < array.length; i++) {
			if (array[i][property] === value) {
				return i;
			}
		}
	}

	return index;
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

export function GenerateGuid() {
	return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function EqualObjects(obj1, obj2, field) {
	return obj1 && obj2 ? JSON.stringify(obj1[field]) === JSON.stringify(obj2[field]) : (!obj1 && !obj2);
}

export function SelectSrcValue(imageString) {
	if (imageString) {
		const imgArray = imageString.split(' ');

		for (let i = 0; i < imgArray.length; i++) {
			if (imgArray[i].startsWith('src')) {
				const srcArray = imgArray[i].split('"');
				return srcArray.length > 0 ? srcArray[1] : '';    
			}
		} 
	}

	return '';
}

export function ArrayAdiff(a1, a2) {
	return a1.filter(x => a2.indexOf(x) < 0);
}

export function AjaxTransport() {
	$.ajaxTransport('+binary', (options, originalOptions, jqXHR) => {		    
		if (window.FormData && ((options.dataType && (options.dataType === 'binary')) || 
		(options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || 
		(window.Blob && options.data instanceof Blob))))) {
			return {
				send: (headers, callback) => {
					const xhr = new XMLHttpRequest();
					const _url = options.url;
					const type = options.type;
					const async = options.async || true;
					const dataType = options.responseType || 'blob';
					const _data = options.data || null;
					const username = options.username || null;
					const password = options.password || null;

					xhr.addEventListener('load', () => {
						const __data = {};
						__data[options.dataType] = xhr.response;
						callback(xhr.status, xhr.statusText, __data, xhr.getAllResponseHeaders());
					});

					xhr.open(type, _url, async, username, password);

					for (let i = 0; i < headers.length; i++) {
						xhr.setRequestHeader(i, headers[i]);
					}

					xhr.responseType = dataType;
					xhr.send(_data);
				},
				abort: () => {
					jqXHR.abort();
				}
			};
		}

		return null;
	});
}

export function GetRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function ToCamelCase(sentenceCase) {
	let out = '';

	sentenceCase.split(' ').forEach((e) => {
		const add = e.toLowerCase();
		out += (add[0].toUpperCase() + add.slice(1));
	});

	return out;
}

export function FormatXml(xml) {
	const reg = /(>)(<)(\/*)/g;

	let formatted = '';
	let pad = 0;

	xml = xml.toString().replace(reg, '$1\r\n$2$3');

	const nodes = xml.split('\r\n');

	for (let n = 0; n < nodes.length; n++) {
		const node = nodes[n];

		let indent = 0;

		if (node.match(/.+<\/\w[^>]*>$/)) {
			indent = 0;
		} else if (node.match(/^<\/\w/)) {
			if (pad !== 0) {
				pad -= 1;
			}
		} else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
			indent = 1;
		} else {
			indent = 0;
		}

		let padding = '';

		for (let i = 0; i < pad; i++) {
			padding += '  ';
		}

		formatted += `${padding}${node}\r\n`;
		pad += indent;
	}

	return formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
}