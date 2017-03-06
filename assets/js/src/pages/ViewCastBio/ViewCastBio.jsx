/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';
import Moment from 'moment';

/* Components */
import Portfolio from '../../components/Portfolio/Portfolio';
import CastPhotos from '../../components/CastPhotos/CastPhotos';
import CastVideo from '../../components/CastVideo/CastVideo';
import CastStoryNotes from '../../components/CastStoryNotes/CastStoryNotes';
import RecentProjects from '../../components/Projects/RecentProjects/RecentProjects';
import CastProjects from '../../components/Projects/CastProjects/CastProjects';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import { CASTLIST, EDITCASTBIOPAGE } from '../../utils/settings';

/* CSS styles */
import Styles from './ViewCastBio.scss';

class ViewCastBio extends React.Component {
	static propTypes = {
		id: React.PropTypes.string,
		listName: React.PropTypes.string, 
		select: React.PropTypes.string
	};

	static defaultProps = {	
		id: SPOC.Utils.Url.getQueryString('cid'),
		listName: CASTLIST, 
		select: 'Id, CastName, ProfilePhoto, YearOfBirth, CastOccupation, LocationOfResidence, ' + 
				'CastingAgencyContact, DateOfCast, CastTypes, SuitabilityVideoPhoto, ' + 
				'CastCitizenship, FirstLanguage, CastPassport, AdditionalInfo, ' +
				'AgeGroup, CastLocation, HeightCm, HairType, HairColour/Title, ' +
				'HairLength, SkinTone/Title, SkinCondition, DeoUnderarmCondition, Children, ' + 
				'PortfolioItemOne, PortfolioItemTwo, PortfolioItemThree, PortfolioItemFour, PortfolioItemFive, ' +
				'PhotoOne, PhotoTwo, PhotoThree, PhotoFour, PhotoFive, BeautyStories, AgencyNotes, EmbedVideo, ExternalCast'
	};

	constructor() {
		super();
		this.state = {
			data: [],
			message: 'Loading...',
			userCanEdit: false
		};
	}

	componentDidMount() {
		this.getItems(this.props.id);
	}

	getItems(id) {
		if (id) {
			const self = this;
			const settings = {
				select: self.props.select,
				filter: `Id eq ${id}`,
				expand: 'HairColour, SkinTone'
			};

			(new SPOC.SP.Site()).ListItems(self.props.listName)
								.query(settings)
								.then((data) => { 
									self.setState({ data }, () => {
										const results = self.state.data;

										if (results && results.length > 0) {
											self.checkEditPermissions();
										} else {
											self.setState({ message: 'You don\'t have permissions to view this cast or it has been deleted.' });
										}
									});
								});
		}
	}

	checkEditPermissions() { 
		const self = this;

		let userCanEdit = false;

		if (_spPageContextInfo.isSiteAdmin) {
			userCanEdit = true; 
		} else {
			const permissions = new SP.BasePermissions();
			permissions.fromJson(_spPageContextInfo.webPermMasks);
			userCanEdit = permissions.has(SP.PermissionKind.editListItems); 
		}

		self.setState({ userCanEdit }); 
	}  

	getFieldBlock(label, field, value, className) {
		let fieldValue = null;

		if (value) {
			if (field) {
				if (this.state.data[0][field] && this.state.data[0][field][value]) {
					fieldValue = this.state.data[0][field][value];
				} else {
					fieldValue = '';
				} 
			} else {
				fieldValue = value;
			} 
		} else if (field && this.state.data[0][field]) {
			fieldValue = this.state.data[0][field];
		} 

		return (	
			<div className={`${Styles.info_block} ${className} ms-Grid-row`}>
				<div className={`${Styles.info_label} ms-Grid-col ms-u-lg6`}>
					{label}:
				</div>
				<div className={`${Styles.info_value} ms-Grid-col ms-u-lg6`}>
					{fieldValue}
				</div>
			</div>
		);
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;

		let content = null;

		let mainContent = (
			<span className={Styles.empty}>
				<h1>{self.state.message}</h1>
			</span>
		);

		if (show) {
			const item = data[0];

			let additionalInfo = null;

			if (item.AdditionalInfo && item.AdditionalInfo.Url) {
				additionalInfo = ( 
					<a href={item.AdditionalInfo.Url}>
						{item.AdditionalInfo.Description}
					</a>
				);
			}

			let firstLanguage = '';

			if (item.FirstLanguage && item.FirstLanguage.results) {
				for (let i = 0; i < item.FirstLanguage.results.length; i++) {
					firstLanguage = `${firstLanguage + item.FirstLanguage.results[i]}; `;
				}

				firstLanguage = firstLanguage.trim().replace(/;$/, '');
			}

			const dateOfCast = item.DateOfCast ? Moment(item.DateOfCast).format('DD/MM/YY') : '';

			content = (
				<div>
					<div className={`${Styles.info_container} ${Styles.nopadding} ms-Grid-col ms-u-lg4 ms-u-sm12`}>
						{self.getFieldBlock('Name', 'CastName')}
						{self.getFieldBlock('Year of Birth', 'YearOfBirth')}
						{self.getFieldBlock('Occupation', 'CastOccupation')}
						{self.getFieldBlock('Location of Residence', 'LocationOfResidence')}
						{self.getFieldBlock('Casting Agency Contact', 'CastingAgencyContact')}
						{self.getFieldBlock('Date of Cast', null, dateOfCast)}
						{self.getFieldBlock('Cast Types', 'CastTypes')}
						{self.getFieldBlock('Suitability for video and photo', 'SuitabilityVideoPhoto')}
						{self.getFieldBlock('Citizenship', 'CastCitizenship')}
						{self.getFieldBlock('Passport', 'CastPassport')}
						{self.getFieldBlock('First Language', null, firstLanguage)}
						{self.getFieldBlock('Additional info', null, additionalInfo, Styles.additional_info)}
					</div>
					<div className={`${Styles.info_container} ms-Grid-col ms-u-lg4 ms-u-sm12`}>
						{self.getFieldBlock('Age Group', 'AgeGroup')}
						{self.getFieldBlock('Location', 'CastLocation')}
						{self.getFieldBlock('Height', 'HeightCm')}
						{self.getFieldBlock('Hair Type', 'HairType')}
						{self.getFieldBlock('Hair Colour', 'HairColour', 'Title')}
						{self.getFieldBlock('Hair Length', 'HairLength')}
						{self.getFieldBlock('Skin Tone', 'SkinTone', 'Title')}
						{self.getFieldBlock('Skin Condition', 'SkinCondition')}
						{self.getFieldBlock('Deo Underarm Condition', 'DeoUnderarmCondition')}
						{self.getFieldBlock('Children', null, (item.Children ? 'Yes' : 'No'))}
					</div>
				</div>
			);

			mainContent = (
				<div>
					<div className={`${Styles.photo_edit_info} ms-Grid-row`}>
						<div className="container">		
							<div className="ms-Grid-col ms-u-lg4 ms-u-sm12">					
								<ProfilePhoto buttonLink={`${_spPageContextInfo.webServerRelativeUrl}${EDITCASTBIOPAGE}?cid=${this.props.id}`}
												data={data} buttonTitle="Edit cast bio" userCanEdit={this.state.userCanEdit} externalCast={item.ExternalCast} />
							</div>
							{content}
						</div>
					</div>
					<div className={`${Styles.photo_video_content} ms-Grid-row container`}>
						<div className={`${Styles.photo_content} ms-Grid-col ms-u-xl6 ms-u-lg12 ms-u-sm12`}>
							<CastPhotos data={self.state.data} />
						</div>
						<div className={`${Styles.video_content} ms-Grid-col ms-u-xl6 ms-u-lg12 ms-u-sm12`}>
							<CastVideo data={self.state.data} />
						</div>
					</div>
					<div className={`${Styles.notes_story} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-sm2" />
						<div className="ms-Grid-col ms-u-sm8">
							<CastStoryNotes data={self.state.data} />
						</div>
						<div className="ms-Grid-col ms-u-sm2" />
					</div>
					<div className={`${Styles.topcurve} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12" />
					</div>
					<div className={`${Styles.portfolio_recent_projects} ms-Grid-row`}>
						<div className={`${Styles.area} container`}>
							<div className="ms-Grid-col ms-u-xl4 ms-u-md4 ms-u-sm12">
								<Portfolio data={self.state.data} />
							</div>
							<div className="ms-Grid-col ms-u-xl4 ms-u-md4 ms-u-sm12" />
							<div className="ms-Grid-col ms-u-xl4 ms-u-md4 ms-u-sm12" >
								<RecentProjects castId={self.props.id} />
							</div>
						</div>
					</div>
					<div className={`${Styles.projects} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12">
							<CastProjects castId={self.props.id} castName={item.CastName} />
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								Cast Bio
							</div>
						</div>
					</div>
					{mainContent}
				</div>
			</div>
		);
	}
}

export default ViewCastBio;