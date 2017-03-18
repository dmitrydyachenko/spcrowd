// Link.react-test.js
import React from 'react';
import Renderer from 'react-test-renderer';
import PagesList from '../js/src/components/PagesList/PagesList';
import { GenerateGuid } from '../js/src/utils/utils';
import { PAGESLIST } from '../js/src/utils/settings';

test('PagesList', () => {
	const data = [
		{ Title: "Page 1" },
		{ Title: "Page 2" }
	];

	const component = Renderer.create(
		<PagesList data={data} guid={GenerateGuid()} fontsize={"64"} />
	);

	expect(component.toJSON()).toMatchSnapshot();
});
