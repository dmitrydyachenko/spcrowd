/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';
import Gallery from 'react-photo-gallery';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import { GetFileNameFromUrl } from '../../utils/utils';
import { CASTIMAGES } from '../../utils/settings';

/* CSS styles */
import Styles from './CastPhotos.scss';

class CastPhotos extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object)
	};

	constructor() {
		super();
		this.state = {
			data: [],
			photos: [],
			photosRowLimit: {
				mobile: 0,
				desktop: 0
			}
		};
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	getItems(data) {
		const self = this;

		self.setState({ data }, () => {
			self.setCastPhotos(self.state.data);
		});
	}

	setCastPhotos(data) {
		if (data && data.length > 0) {
			this.getPhotosMetadata(data[0].PhotoOne);
			this.getPhotosMetadata(data[0].PhotoTwo);
			this.getPhotosMetadata(data[0].PhotoThree);	
			this.getPhotosMetadata(data[0].PhotoFour);
			this.getPhotosMetadata(data[0].PhotoFive);
		}
	}

	getPhotosMetadata(item) {
		const self = this;

		if (item && item.Url) {
			const caml = new CamlBuilder()
                        .View(['FileRef', 'LinkFilename', 'ImageHeight', 'ImageWidth'])
                        .Query()
                        .Where()
                        .ComputedField('LinkFilename')
                        .EqualTo(decodeURI(GetFileNameFromUrl(item.Url)))
                        .ToString();

			(new SPOC.SP.Site()).ListItems(CASTIMAGES)
								.queryCSOM(caml)
								.then((results) => {
									if (results && results.length > 0) {
										let photos = self.state.photos;

										const width = results[0].ImageWidth / 2;
										const height = results[0].ImageHeight / 2;
										const aspectRatio = width / height;

										photos.push({ 
											src: results[0].FileRef, 
											width,
											height, 
											aspectRatio: Math.round(aspectRatio * 100) / 100,
											lightboxImage: {
												src: results[0].FileRef
											}
										});

										photos = photos.sort(self.compareAspectRatio);

										const photosCount = photos.length;
										const photosRowLimit = self.state.photosRowLimit;

										if (photosCount < 4) {
											photosRowLimit.mobile = photosCount;
											photosRowLimit.desktop = photosCount;
										} else if (photosCount === 4) {
											photosRowLimit.mobile = 2;
											photosRowLimit.desktop = 2;
										} else if (photosCount === 5) {
											photosRowLimit.mobile = 3;
											photosRowLimit.desktop = 3;
										} 

										self.setState({ photos, photosRowLimit });
									}
								});
		}
	}

	compareAspectRatio(a, b) {
		return (a.aspectRatio < b.aspectRatio ? -1 : (a.aspectRatio > b.aspectRatio ? 1 : 0));
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;

		let mainContent = null;

		if (show) {
			mainContent = show ? (
				<Gallery photos={self.state.photos} 
							disableLightbox={false} 
							custom={self.state.photosRowLimit} />
			) : null;
		}

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Photos</h1>
					</div>
					<div className={`${Styles.photos} ms-Grid-row`}>
						{mainContent}
					</div>
				</div>
			</div>
		);
	}
}

export default CastPhotos;
