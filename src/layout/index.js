import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ThemeContext from '../context/ThemeContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import config from '../../data/SiteConfig';
import favicon from '../images/favicon.png';
import '../styles/main.scss';

export default class MainLayout extends Component {
	static contextType = ThemeContext;

	componentDidMount() {
		// > ios10 缩放
		document.addEventListener('gesturestart', event => {
			event.preventDefault();
		});
	}

	render() {
		const { dark, notFound } = this.context;
		const { children } = this.props;
		let themeClass = '';

		if (dark && !notFound) {
			themeClass = 'dark';
		} else if (notFound) {
			themeClass = 'not-found';
		}

		return (
			<>
				<Helmet
					bodyAttributes={{
						class: `theme ${themeClass}`
					}}
				>
					<meta name="description" content={config.siteDescription} />

					<meta
						name="viewport"
						content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0"
					/>

					<link rel="shortcut icon" type="image/png" href={favicon} />
				</Helmet>
				<Navigation menuLinks={config.menuLinks} />
				<main id="main-content">{children}</main>
				<Footer />
			</>
		);
	}
}
