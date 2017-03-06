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
import Styles from './AddCastBio.scss';

class AddCastBio extends React.Component {
	constructor() {
		super();
		this.state = {	
			submitting: false,
			submittingMessage: '',
			userCanAdd: false
		};
		this.settings = {};
		this.getYearOfBirthErrorMessage = this.getYearOfBirthErrorMessage.bind(this);
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleDatePickerSelect = this.handleDatePickerSelect.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.handleEditorStateChange = this.handleEditorStateChange.bind(this);
		this.site = new SPOC.SP.Site();
		this.castGuid = GenerateGuid();
		this.validForm = false;
	}

	componentDidMount() {
		this.checkAddPermissions();
	}

	checkAddPermissions() { 
		const self = this;

		let userCanAdd = false;
		let submittingMessage = '';

		if (_spPageContextInfo.isSiteAdmin) {
			userCanAdd = true; 
		} else {
			const permissions = new SP.BasePermissions();
			permissions.fromJson(_spPageContextInfo.webPermMasks);
			userCanAdd = permissions.has(SP.PermissionKind.addListItems); 
		}

		if (!userCanAdd) {
			submittingMessage = 'You don\'t have permissions to add a cast.';
		}

		self.setState({ userCanAdd, submittingMessage }); 
	} 

	getYearOfBirthErrorMessage(value) {
		return !value || /^[12][0-9]{3}$/.test(value) ? '' : 'Incorrect year format';
	}

	setSettingsValue(value, field) {
		this.settings[field] = value;
		
		if (!value) {
			delete this.settings[field];
		}
	}

	addCast(settings) {
		const self = this;

		console.log(settings);

		self.site.ListItems(Settings.CASTLIST).create(settings).then(() => { 
			self.setState({ submittingMessage: 'Redirecting to a project page...' });

			const noRedirect = SPOC.Utils.Url.getQueryString('r');   

			if (!noRedirect) {           
				self.site.ListItems(Settings.CASTLIST)
							.query({
								select: 'Id',
								filter: `CastGuid eq '${self.castGuid}'`
							})
							.then((results) => {
								if (results && results.length > 0) {
									RedirectToPage(`${self.site.url}${Settings.VIEWCASTBIOPAGE}?cid=${results[0].Id}`);	
								}
							}, (error) => {  
								self.setState({ submitting: false, submittingMessage: JSON.parse(error.response).error.message.value });
							});
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

		if (this.validForm) { 
			this.setState({ submitting: true, submittingMessage: 'Creating a cast...' }, () => {
				this.setSettingsValue(this.castGuid, 'CastGuid');
				this.addCast(this.settings);
			});
		} else {
			$('#s4-workspace').animate({ scrollTop: 0 }, 1000);  
		}
	}

	render() {
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
		) : <Button className={Styles.button} value="Save" onClick={this.handleSaveClick} />;

		const mainContent = this.state.userCanAdd ? 
		(
			<div>				
				<div className={`${Styles.photo} ms-Grid-row`}>
					<div className="container">
						<div className="ms-Grid-col ms-u-sm3" />
						<div className="ms-Grid-col ms-u-sm6">
							<ProfilePhotoUpload listName={Settings.CASTIMAGES}
												onUploadChange={this.handleUploadChange} />
						</div>
						<div className="ms-Grid-col ms-u-sm3" />
					</div>
				</div>
				<div className={`${Styles.info} ms-Grid-row container`}>
					<div className="ms-Grid-col" />
					<div className="ms-Grid-col ms-u-md5 ms-u-sm12">
						<FormTextField ref={(c) => { this.castName = c; }} label="Name" field="CastName" onChange={this.handleTextboxChange} required />
						<FormTextField label="Year of Birth" field="YearOfBirth" onGetErrorMessage={this.getYearOfBirthErrorMessage} onChange={this.handleTextboxChange} />
						<FormTextField label="Occupation" field="CastOccupation" onChange={this.handleTextboxChange} />
						<FormTextField label="Location of Residence" field="LocationOfResidence" onChange={this.handleTextboxChange} />
						<FormTextField label="Casting Agency Contact" field="CastingAgencyContact" onChange={this.handleTextboxChange} />
						<FormDatePicker label="Date of Cast" field="DateOfCast" onSelectDate={this.handleDatePickerSelect} />
						<FormDropDownField label="Cast Types" field="CastTypes" onChanged={this.handleDropDownChange} />
						<FormTextField label="Suitability for video and photo" field="SuitabilityVideoPhoto" onChange={this.handleTextboxChange} />
						<FormDropDownField label="Citizenship" field="CastCitizenship" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="First Language" field="FirstLanguage" onChanged={this.handleDropDownChange} />
						<FormTextField label="Passport" field="CastPassport" onChange={this.handleTextboxChange} />
					</div>
					<div className="ms-Grid-col ms-u-md5 ms-u-sm12">
						<FormDropDownField label="Age Group" field="AgeGroup" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Location" field="CastLocation" onChanged={this.handleDropDownChange} />
						<FormTextField label="Height" field="HeightCm" onChange={this.handleTextboxChange} />
						<FormDropDownField label="Hair Type" field="HairType" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Hair Colour" field="HairColour" sourceList="Hair Colour" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Hair Length" field="HairLength" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Skin Tone" field="SkinTone" sourceList="Skin Tone" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Skin Condition" field="SkinCondition" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Deo Underarm Condition" field="DeoUnderarmCondition" onChanged={this.handleDropDownChange} />
						<FormDropDownField label="Children" field="Children" onChanged={this.handleDropDownChange} />
					</div>
					<div className="ms-Grid-col" />
				</div>
				<div className={`${Styles.additional_info} ms-Grid-row container`}>
					<AdditionalInfoUpload listName={Settings.CASTADDITIONALINFO} 
											onUploadChange={this.handleUploadChange} />
				</div>
				<div className={`${Styles.notes} ms-Grid-row container`}>
					<div className="ms-Grid-col ms-u-md2" />
					<div className="ms-Grid-col ms-u-md8 ms-u-sm12">
						<TextEditor title="Agency Notes" field="AgencyNotes"
									onEditorStateChange={this.handleEditorStateChange} />
					</div>
					<div className="ms-Grid-col ms-u-md2" />
				</div>
				<div className={`${Styles.story} ms-Grid-row container`}>
					<div className="ms-Grid-col ms-u-md2" />
					<div className="ms-Grid-col ms-u-md8 ms-u-sm12">
						<TextEditor title="Beauty Story" field="BeautyStories"
									onEditorStateChange={this.handleEditorStateChange} />
					</div>
					<div className="ms-Grid-col ms-u-md2" />
				</div>
				<div className={`${Styles.photo_video} ms-Grid-row container`}>
					<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
						<PhotosUpload listName={Settings.CASTIMAGES} 
										onUploadChange={this.handleUploadChange} />
					</div>
					<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
						<VideoUpload listName={Settings.CASTVIDEOS} 
										onUploadChange={this.handleUploadChange} />
					</div>
				</div>
				<div className={`${Styles.portfolio} ms-Grid-row container`}>
					<div className="ms-Grid-col ms-u-md3" />
					<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
						<PortfolioUpload listName={Settings.CASTPORTFOLIOS} 
											onUploadChange={this.handleUploadChange} />
					</div>
					<div className="ms-Grid-col ms-u-md3" />
				</div>
			</div>
		) : null;

		return (
			<div className={Styles.container}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								Add Cast Bio
							</div>
						</div>
					</div>
					{
						!this.state.userCanAdd ? <div className={`${Styles.photo} ms-Grid-row`} /> : null
					}
					{mainContent}
					<div className={`${Styles.save} ms-Grid-row container`} style={!this.state.userCanAdd ? { paddingTop: 0 } : {}}>
						<div className="ms-Grid-col ms-u-sm12">
							{saveButtonContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddCastBio;
