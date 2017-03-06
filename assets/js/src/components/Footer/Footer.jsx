import React from 'react';
import SPOC from 'SPOCExt';
import { FOOTERLINKSLIST } from '../../utils/settings';
import Styles from './Footer.scss';

class Footer extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string
	};

	static defaultProps = {	
		listName: FOOTERLINKSLIST
	};	

	constructor() {
		super();
		this.state = {
			links: []
		};
	}

	componentDidMount() {
		const self = this;		
		const settings = {
			select: 'Title, URL',
			orderBy: 'ItemOrder asc'
		};

		(new SPOC.SP.Site()).ListItems(self.props.listName).query(settings).then((links) => {
			self.setState({ links });
		},
		(error) => {
			console.log(error);
		});
	}

	render() {
		const mainContent = this.state.links.map((link, i) =>
			(
				<li key={i}>
					<a href={link.URL ? link.URL.Url : '#'}>
						{link.Title}
					</a>
				</li>
			)
		);

		return (
			<div className={Styles.footer}>
				<ul className={Styles.links}>
					{mainContent}
				</ul>
			</div>
		);
	}
}

export default Footer;
