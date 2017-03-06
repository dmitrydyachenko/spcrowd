/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import Moment from 'moment';

/* Components */
import ProfilePhotoUpload from '../../components/ProfilePhotoUpload/ProfilePhotoUpload';
import PhotosUpload from '../../components/PhotosUpload/PhotosUpload';
import PortfolioUpload from '../../components/PortfolioUpload/PortfolioUpload';
import AdditionalInfoUpload from '../../components/AdditionalInfoUpload/AdditionalInfoUpload';
import VideoUpload from '../../components/VideoUpload/VideoUpload';
import FormTextField from '../../components/Partials/FormFields/FormTextField/FormTextField';
import FormDropDownField from '../../components/Partials/FormFields/FormDropDownField/FormDropDownField';
import FormDatePicker from '../../components/Partials/FormFields/FormDatePicker/FormDatePicker';
import Button from '../../components/Partials/Button/Button';
import TextEditor from '../../components/Partials/TextEditor/TextEditor';
import * as Settings from '../../utils/settings';
import { RedirectToPage, GenerateGuid, GetAssetsPath } from '../../utils/utils';

/* CSS styles */
import Styles from './EditCastBio.scss';

class EditCastBio extends React.Component {
	static propTypes = {
		id: React.PropTypes.string,
		select: React.PropTypes.string
	};

	static defaultProps = {	
		id: SPOC.Utils.Url.getQueryString('cid'),
		select: 'Id, CastName, ProfilePhoto, YearOfBirth, CastOccupation, LocationOfResidence, ' + 
				'CastingAgencyContact, DateOfCast, CastTypes, SuitabilityVideoPhoto, ' + 
				'CastCitizenship, FirstLanguage, CastPassport, AdditionalInfo, ' +
				'AgeGroup, CastLocation, HeightCm, HairType, HairColour/Title, ' +
				'HairLength, SkinTone/Title, SkinCondition, DeoUnderarmCondition, Children, ' + 
				'PortfolioItemOne, PortfolioItemTwo, PortfolioItemThree, PortfolioItemFour, PortfolioItemFive, ' +
				'PhotoOne, PhotoTwo, PhotoThree, PhotoFour, PhotoFive, BeautyStories, AgencyNotes, EmbedVideo'
	};

	constructor() {
		super();
		this.state = {
			data: [],
			submitting: false,
			submittingMessage: ''
		};
		this.settings = {};
		this.getYearOfBirsthErrorMessage = this.getYearOfBirsthErrorMessage.bind(this);
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleDatePickerSelect = this.handleDatePickerSelect.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.handleEditorStateChange = this.handleEditorStateChange.bind(this);
		this.site = new SPOC.SP.Site();
		this.castGuid = '';
		this.validForm = false;
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

			this.site.ListItems(Settings.CASTLIST)
					.query(settings)
					.then(data => self.setState({ data }));
		}
	}

	getYearOfBirsthErrorMessage(value) {
		return !value || /^[12][0-9]{3}$/.test(value) ? '' : 'Incorrect year format';
	}

	setSettingsValue(value, field) {
		this.settings[field] = value;
		
		if (!value) {
			delete this.settings[field];
		}
	}

	updateCast(settings) {
		const self = this;

		console.log(settings);

		self.site.ListItems(Settings.CASTLIST).update(self.props.id, settings).then(() => { 
			const noRedirect = SPOC.Utils.Url.getQueryString('r');   

			if (!noRedirect) {           
				RedirectToPage(`${self.site.url}${Settings.VIEWCASTBIOPAGE}?cid=${self.props.id}`);	
			}
		});
	}

	handleEditorStateChange(value, field) {
		this.setSettingsValue(value, field);
	}

	handleUploadChange(file, isTextField) {
		const value = isTextField ? file.value : {
			__metadata: { 
				type: 'SP.FieldUrlValue'
			},
			Url: file ? file.path : '', 
			Description: file ? file.name : ''
		};

		this.setSettingsValue(value, file.field);
	}

	handleDropDownChange(value, field, fieldType) {
		let finalValue = '';
		let finalField = '';

		if (fieldType === 'MultiChoice') {
			finalValue = {
				__metadata: {
					type: 'Collection(Edm.String)'
				},
				results: [value.text]
			};
		} else if (fieldType === 'Choice') {
			finalValue = value.text;
		} else if (fieldType === 'Boolean') {
			finalValue = (value.text === 'Yes');
		} else if (fieldType === 'Lookup') {
			finalField = `${field}Id`;
			finalValue = value.Id;
		}

		this.setSettingsValue(finalValue, finalField || field);

		console.log(this.settings);
	}

	handleTextboxChange(value, field) {
		if (field === 'CastName') {
			this.setSettingsValue(value, 'Title');
		}

		this.setSettingsValue(value, field);
	}

	handleDatePickerSelect(value, field) {
		const selectedDate = Moment(value).toISOString();
		this.setSettingsValue(selectedDate, field);
	}

	handleSaveClick() {
		this.validForm = this.castName.validate();

		console.log(this.settings);

		if (this.validForm) { 
			this.updateCast(this.settings);
			// this.setState({ submitting: true, submittingMessage: 'Updating a cast...' }, () => {
			// 	this.updateCast(this.settings);
			// });
		} else {
			$('#s4-workspace').animate({ scrollTop: 0 }, 1000);  
		}
	}

	render() {
		const data = this.state.data;
		const show = data && data.length > 0;

		const saveButtonContent = this.state.submitting || this.state.submittingMessage ? 
		(
			<div className="ms-Grid-row">
				{
					this.state.submitting ? 
					(
						<div className="ms-Grid-col ms-u-sm12">
							<img src={`${GetAssetsPath() + Settings.IMGPATH}/loader.gif`} role="presentation" />
						</div>
					) : null
				}
				{
					this.state.submittingMessage ?
					(
						<div className={`${Styles.submitting_message} ms-Grid-col ms-u-sm12`}>
							{this.state.submittingMessage}
						</div>
					) : null
				}
			</div>
		) : <Button className={`${Styles.button}`} value={'Save'} onClick={this.handleSaveClick} />;

		let mainContent = null;

		if (show) {
			const item = data[0];

			mainContent = (
				<div>
					<div className={`${Styles.photo} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm6">
								<ProfilePhotoUpload listName={Settings.CASTIMAGES} data={data}
													profilePhotoButtonTitle="Change profile photo"
													onUploadChange={this.handleUploadChange} />
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
					</div>
					<div className={`${Styles.info} ms-Grid-row container`}>
						<div className="ms-Grid-col" />
						<div className="ms-Grid-col ms-u-md5 ms-u-sm12">
							<FormTextField ref={(c) => { this.castName = c; }} item={item} label="Name" field="CastName" onChange={this.handleTextboxChange} required />
							<FormTextField item={item} label="Year of Birth" field="YearOfBirth" onGetErrorMessage={this.getYearOfBirsthErrorMessage} onChange={this.handleTextboxChange} />
							<FormTextField item={item} label="Occupation" field="CastOccupation" onChange={this.handleTextboxChange} />
							<FormTextField item={item} label="Location of Residence" field="LocationOfResidence" onChange={this.handleTextboxChange} />
							<FormTextField item={item} label="Casting Agency Contact" field="CastingAgencyContact" onChange={this.handleTextboxChange} />
							<FormDatePicker item={item} label="Date of Cast" field="DateOfCast" onSelectDate={this.handleDatePickerSelect} />
							<FormDropDownField item={item} label="Cast Types" field="CastTypes" onChanged={this.handleDropDownChange} />	
							<FormTextField item={item} label="Suitability for video and photo" field="SuitabilityVideoPhoto" onChange={this.handleTextboxChange} />
							<FormDropDownField item={item} label="Citizenship" field="CastCitizenship" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="First Language" field="FirstLanguage" onChanged={this.handleDropDownChange} />
							<FormTextField item={item} label="Passport" field="CastPassport" onChange={this.handleTextboxChange} />
						</div>
						<div className="ms-Grid-col ms-u-md5 ms-u-sm12">
							<FormDropDownField item={item} label="Age Group" field="AgeGroup" onChanged={this.handleDropDownChange} />						
							<FormDropDownField item={item} label="Location" field="CastLocation" onChanged={this.handleDropDownChange} />
							<FormTextField item={item} label="Height" field="HeightCm" onChange={this.handleTextboxChange} />
							<FormDropDownField item={item} label="Hair Type" field="HairType" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="Hair Colour" field="HairColour" sourceList="Hair Colour" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="Hair Length" field="HairLength" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="Skin Tone" field="SkinTone" sourceList="Skin Tone" onChanged={this.handleDropDownChange} />						
							<FormDropDownField item={item} label="Skin Condition" field="SkinCondition" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="Deo Underarm Condition" field="DeoUnderarmCondition" onChanged={this.handleDropDownChange} />
							<FormDropDownField item={item} label="Children" field="Children" onChanged={this.handleDropDownChange} />
						</div>
						<div className="ms-Grid-col" />
					</div>
					<div className={`${Styles.additional_info} ms-Grid-row container`}>
						<AdditionalInfoUpload listName={Settings.CASTADDITIONALINFO} item={item}
												onUploadChange={this.handleUploadChange} />
					</div>
					<div className={`${Styles.notes} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-md2" />
						<div className="ms-Grid-col ms-u-md8 ms-u-sm12">
							<TextEditor title="Agency Notes" field="AgencyNotes" 
										content={show ? this.state.data[0].AgencyNotes : null}
										onEditorStateChange={this.handleEditorStateChange} />
						</div>
						<div className="ms-Grid-col ms-u-md2" />
					</div>
					<div className={`${Styles.story} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-md2" />
						<div className="ms-Grid-col ms-u-md8 ms-u-sm12">
							<TextEditor title="Beauty Story" field="BeautyStories"
										content={show ? this.state.data[0].BeautyStories : null}
										onEditorStateChange={this.handleEditorStateChange} />
						</div>
						<div className="ms-Grid-col ms-u-md2" />
					</div>
					<div className={`${Styles.photo_video} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
							<PhotosUpload listName={Settings.CASTIMAGES} item={item}
											onUploadChange={this.handleUploadChange} />
						</div>
						<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
							<VideoUpload listName={Settings.CASTVIDEOS} item={item}
											onUploadChange={this.handleUploadChange} />
						</div>
					</div>
					<div className={`${Styles.portfolio} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-md3" />
						<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
							<PortfolioUpload listName={Settings.CASTPORTFOLIOS} item={item}
												onUploadChange={this.handleUploadChange} />
						</div>
						<div className="ms-Grid-col ms-u-md3" />
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
								Edit Cast Bio
							</div>
						</div>
					</div>
					{mainContent}
					<div className={`${Styles.save} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-sm12">
							{saveButtonContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EditCastBio;
