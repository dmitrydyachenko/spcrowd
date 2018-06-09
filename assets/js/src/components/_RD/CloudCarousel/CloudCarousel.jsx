/* External libraries */
import React from 'react';
import MediaQuery from 'react-responsive';
import styled, { keyframes } from 'styled-components';

/* CSS styles */
import { GetRandomInt } from '../../../utils/utils';
import Styles from './CloudCarousel.scss';

class CloudCarousel extends React.Component {
	static propTypes = {
		items: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		subItems: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			items: props.items,
			subItems: props.subItems
		};

		this.clientHeight = 500;
		this.breakPoints = [
			[1919, 1154], 
			[1365, 1154], 
			[1023, 954], 
			[780, 724], 
			[639, 584]
		];
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const self = this;
	}

	sortFunction(a, b) {
		return a[0] - b[0];
	}

	getCarouselContent(items, subItems, breakPoints) {
		const self = this;
		
		return (
			<div>
				{self.getCarouselMediaContent(items, subItems, breakPoints)}
			</div>
		);
	}

	getCarouselMediaContent(items, subItems, breakPoints, i) {
		const self = this;

		const width = breakPoints[(i || 0)][1];
		const length = width * items.length;
		
		return (
			<MediaQuery query={`(min-width:${breakPoints[(i || 0)][0]}px)`}>
				{
					matches =>
					(
						matches ? 
						(
							<div className={Styles.carousel_content} style={{ width: `${length}px` }}>
								{self.getCarouselItemsContent(items, subItems, width)}
							</div>
						) 
						: 
						(
							(i || 0) < breakPoints.length - 1 ? 
								self.getCarouselMediaContent(items, subItems, breakPoints, (i || 0) + 1) 
								: 
								(
									<div className={Styles.carousel_content} style={{ width: '100%' }}>
										{self.getCarouselItemsContent(items, subItems, 100, '%')}
									</div>
								)
						)
					)
				}
			</MediaQuery>
		);
	}

	getCarouselItemsContent(items, subItems, width, metric) {
		const self = this;

		return (
			items.map((item, i) => {
				const subItemsContent = subItems.map((subItem, j) => {
					const top = GetRandomInt(0, self.clientHeight - subItem.height);
					const left = GetRandomInt(width, width + subItem.weight);

					const style = { 
						top, 
						left, 
						width: subItem.width, 
						height: subItem.height 
					};

					const rightToLeft = keyframes`
						from {
							transform: translate(${left}px);
						}

						to {
							transform: translate(-${3 * left}px);
						}
					`;

					const Translate = styled.div`
						display: inline-block;
						position: relative;
						animation: ${rightToLeft} ${((subItem.weight) / left) * 100}s linear infinite;
					`;

					return (
						<Translate key={(2 * j) + 1}>
							<div className={Styles.item_column} style={style}>	
								<div className={Styles.weight}>
									{subItem.weight}
								</div>
							</div>
						</Translate>
					);
				});

				return (
					<div key={2 * i} className={Styles.carousel_item_wrapper}>
						{self.getCarouselItemContent(subItemsContent, width, metric)}
					</div>
				);
			})
		);
	}

	getCarouselItemContent(subItemsContent, width, metric) {
		return (
			<div className={Styles.carousel_item} style={{ width: `${width}${(metric || 'px')}` }}>
				<div className="ms-Grid">
					<div className={`${Styles.item_row} ms-Grid-row`} style={{ height: `${this.clientHeight}px` }}>
						{subItemsContent}
					</div>
				</div>
			</div>
		);
	}

	render() {
		const self = this;
		const items = self.state.items;
		const subItems = self.state.subItems;
		const show = items && items.length > 0 && subItems && subItems.length > 0;

		let mainContent = null;

		if (show) {
			mainContent = (
				<div className={Styles.carousel_container}>					
					{self.getCarouselContent(items, subItems, self.breakPoints)}
					<div className={Styles.carousel_navigation} />
				</div>
			);
		}

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					Cloud Carousel
				</p>
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.row} ms-Grid-row`}>
							<div className={`${Styles.column} ms-Grid-col ms-u-sm12`}>	
								{mainContent}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CloudCarousel;