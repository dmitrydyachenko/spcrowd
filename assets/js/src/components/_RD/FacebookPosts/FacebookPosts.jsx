/* External libraries */
import $ from 'jquery';
import React from 'react';

/* CSS styles */
import Styles from './FacebookPosts.scss';

class FacebookPosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: ''
		};

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const self = this;

		window.fbAsyncInit = () => {
			FB.init({
				appId: '199539647218905',
				cookie: true,
				xfbml: true,
				version: 'v2.8'
			});

			FB.getLoginStatus((response) => {
				self.statusChangeCallback(response);
			});
		};

		(function (d, s, id) {
			const fjs = d.getElementsByTagName(s)[0];

			let js = '';

			if (d.getElementById(id)) {
				return;
			}

			js = d.createElement(s); 
			js.id = id;
			js.src = '//connect.facebook.net/en_US/sdk.js';

			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	handleClick(e) {
		e.preventDefault();
		FB.login(this.checkLoginState());
	}

	checkLoginState() {
		FB.getLoginStatus((response) => {
			this.statusChangeCallback(response);
		});
	}

	statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);

		if (response.status === 'connected') {
			this.testAPI();
		} else if (response.status === 'not_authorized') {
			self.setState({ status: 'Please log into this app.' });
		} else {
			self.setState({ status: 'Please log into Facebook.' });
		}
	}

	testAPI() {
		const self = this;

		console.log('Welcome!  Fetching your information.... ');

		FB.api('/me', (response) => {
			console.log(`Successful login for: ${response.name}`);
			self.setState({ status: `Thanks for logging in, ${response.name}!` });
		});
	}

	render() {
		const self = this;
		const show = true;

		let mainContent = null;

		if (show) {
			mainContent = (
				<div className={Styles.fbposts_container}>
					{self.state.status}	
				</div>
			);
		}

		return (
			<div className={Styles.container}>
				<p className="header">
					Facebook Posts
				</p>
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.row} ms-Grid-row`}>
							<div className={`${Styles.column} ms-Grid-col ms-u-sm12`}>	
								<a className={Styles.fbposts_login} href="/" onClick={self.handleClick}>
									Login
								</a>	
							</div>
						</div>
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

export default FacebookPosts;