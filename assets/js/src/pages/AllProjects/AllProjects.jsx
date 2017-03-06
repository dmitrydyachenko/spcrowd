/* External libraries */
import React from 'react';

/* Components */
import CurrentProjects from '../../components/Projects/CurrentProjects/CurrentProjects';

/* CSS styles */
import Styles from './AllProjects.scss';

class AllProjects extends React.Component {
	render() {
		return (
			<div className={Styles.container}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								All Projects
							</div>
						</div>
					</div>
					<div className={`${Styles.topcurve} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12" />
					</div>
					<div className={`${Styles.projects_container} ms-Grid-row`}>
						<CurrentProjects archivedProjects />
					</div>
				</div>
			</div>
		);
	}
}

export default AllProjects;