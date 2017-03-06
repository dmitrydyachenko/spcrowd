/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import Button from '../../Partials/Button/Button';
import { VIEWPROJECT, PROJECTSELECTIONSLIST } from '../../../utils/settings';

/* CSS styles */
import Styles from './RecentProjects.scss';

class RecentProjects extends React.Component {
	static propTypes = {
		castId: React.PropTypes.string.isRequired
	};

	constructor() {
		super();
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this.getItems(this.props.castId);
	}

	componentWillReceiveProps(nextProps) {        
		this.getItems(nextProps.castId);
	}

	getItems(id) {
		if (id) {
			const self = this;

			const settings = {
				select: 'Id, Title, CastId/Id, ProjectId/Id, ProjectId/Title, ProjectId/StatusText', 
				filter: `CastId/Id eq ${id} and ProjectId/StatusText eq 'Archived'`,
				expand: 'CastId, ProjectId',
				top: 4,
				orderBy: 'Created desc'
			};

			(new SPOC.SP.Site()).ListItems(PROJECTSELECTIONSLIST)
				.query(settings)
				.then(results => self.setState({ data: results }));
		}
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;

		let mainContent = null;

		if (show) {
			mainContent = data.map((item, i) => 
				<Button key={i}
						className={`ms-Grid-col ms-u-md6 ms-u-sm12 ${Styles.button}`}
						value={(item.ProjectId.Title && item.ProjectId.Title.length > 15 ? `${item.ProjectId.Title.substr(0, 10).trim()}...` : item.ProjectId.Title)} 
						href={`${_spPageContextInfo.webServerRelativeUrl}${VIEWPROJECT}?pid=${item.ProjectId.Id}`} />
			); 
		}

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Recent Projects</h1>
					</div>
					<div className={`${Styles.items} ms-Grid-row`} style={data.length === 1 ? { textAlign: 'center' } : null}>
						{mainContent}
					</div>
				</div>
			</div>
		);
	}
}

export default RecentProjects;
