/* External libraries */
import React from 'react';

/* Components */
import Button from '../../components/Partials/Button/Button';
import CastThumbnailTile from '../../components/Partials/CastThumbnailTile/CastThumbnailTile';
import { GetAssetsPath } from '../../utils/utils';
import { IMGPATH } from '../../utils/settings';

/* CSS styles */
import Styles from './ProfilePhoto.scss';

class ProfilePhoto extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object),
		buttonTitle: React.PropTypes.string,
		onButtonClick: React.PropTypes.func,
		buttonLink: React.PropTypes.string,
		userCanEdit: React.PropTypes.bool,
		externalCast: React.PropTypes.bool
	};

	constructor() {
		super();
		this.state = {	
			data: [],
			submitting: false
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	componentWillReceiveProps(nextProps) {     
		this.setState({ submitting: false }, () => {   
			this.getItems(nextProps.data);
		});
	}

	getItems(data) {
		this.setState({ data });
	}

	handleButtonClick() {
		this.setState({ submitting: true });
		this.props.onButtonClick(this.uploadInput);
	}

	render() {
		const data = this.state.data;
		const show = data && data.length > 0;

		let mainContent = null;

		if (show) {
			const buttonContent = this.props.buttonLink ? 
				(
					this.props.userCanEdit ? 
						<Button href={this.props.buttonLink} value={this.props.buttonTitle} className={`${Styles.edit_area}`} /> : null
				)
				: 
				(
					<div>
						<Button value={this.props.buttonTitle} className={`${Styles.edit_area}`} />
						<input className={Styles.upload_input} ref={(c) => { this.uploadInput = c; }} 
								type="file" onChange={this.handleButtonClick} />
					</div>
				);

			mainContent = this.state.submitting ? 
			(
				<div className="ms-Grid">
					<div className="ms-Grid-row">
						<div className="ms-Grid-col ms-u-sm12">
							<img src={`${GetAssetsPath() + IMGPATH}/loader.gif`} role="presentation" />
						</div>
					</div>
				</div>
			) 
			:
			(
				<div>
					<div className={Styles.photo}>
						<CastThumbnailTile data={data} noGridColumn />
					</div>
					<div className={Styles.settings}>
						<i className="fa fa-cog" aria-hidden="true" />
						{
							this.props.externalCast && this.props.externalCast === true ? <div>via DoveWomen.com</div> : null
						}
					</div>
					<div className={Styles.edit}>
						<div className="ms-Grid-col ms-u-sm12">
							{buttonContent}
						</div>
					</div>
				</div>
			);
		}
		
		return (
			<div className={Styles.container}>
				{mainContent}
			</div>
		);
	}
}

export default ProfilePhoto;
