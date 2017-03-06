import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import { HEADERLINKSLIST, IMGPATH } from '../../utils/settings';
import { GetAssetsPath } from '../../utils/utils';
import Styles from './Header.scss';

class Header extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string
	};

	static defaultProps = {	
		listName: HEADERLINKSLIST
	};	

	constructor() {
		super();
		this.state = {
			links: [],
			homePageUrl: ''
		};
	}

	componentDidMount() {
		const self = this;		
		const settings = {
			select: 'Title, URL',
			orderBy: 'ItemOrder asc'
		};

		this.getHomePageUrl();

		(new SPOC.SP.Site()).ListItems(self.props.listName).query(settings).then((links) => {
			self.setState({ links });
		},
		(error) => {
			console.log(error);
		});
	}

	getHomePageUrl() {
		const self = this;

		$.ajax({
			url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/rootfolder?$select=welcomepage`,
			type: 'GET',
			headers: { accept: 'application/json;odata=verbose' },
			success: (data) => {
				const homePageUrl = data && data.d ? `${_spPageContextInfo.siteAbsoluteUrl}/${data.d.WelcomePage}` : null;

				if (homePageUrl) {	
					self.setState({ homePageUrl });
				}
			}
		});
	}

	render() {
		const links = this.state.links;

		const halfway = parseInt((links.length - 1) / 2, 10) + 1;

		const leftLinks = links.slice(0, halfway).map((link, i) =>
			(
				<li key={i}>
					<a href={link.URL ? link.URL.Url : '#'}>
						{link.Title}
					</a>
				</li>
			)
		);

		const rightLinks = links.slice(halfway).map((link, i) =>
			(
				<li key={i}>
					<a href={link.URL ? link.URL.Url : '#'}>
						{link.Title}
					</a>
				</li>
			)
		);

		const homePageUrl = this.state.homePageUrl;

		return (
			<div className={Styles.header}>
				<div className={Styles.links}>
					<div className={Styles.left}>
						<ul>
							{leftLinks}
						</ul>
					</div>
					<div className={Styles.center}>
						<a href={homePageUrl}>
							<img className="dove-logo" alt="Dove logo" src={`${GetAssetsPath() + IMGPATH}/Dove.png`} />
						</a>
					</div>
					<div className={Styles.right}>
						<ul>
							{rightLinks}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
