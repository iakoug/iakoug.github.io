import React, { Component } from 'react';
import Helmet from 'react-helmet';
import axios from 'axios';

import Layout from '../layout';
import SEO from '../components/SEO';
import config from '../../data/SiteConfig';
import api from '../../data/api';

export default class MessageBoard extends Component {
	state = {
		name: '',
		value: ''
	};

	submit = () => {
		const { name, value } = this.state;

		if (!name || !value) {
			return window.alert('Both [name] & [content] must be entered!');
		}

		return axios
			.post(api.comment, {
				name,
				value
			})
			.then(() => {
				window.alert('Comment success!');
				this.setState({
					name: '',
					value: ''
				});
			})
			.catch(err => window.alert(err));
	};

	handleChange = type => e => this.setState({ [type]: e.target.value });

	render() {
		return (
			<Layout>
				<Helmet title={`Message board – ${config.siteTitle}`} />
				<SEO />
				<div className="container message-board">
					<h2>Message board</h2>
					<div className="search-container search-container-name">
						<input
							className="search"
							type="text"
							name="searchTerm"
							value={this.state.name}
							placeholder="Type your name..."
							onChange={this.handleChange('name')}
						/>
					</div>
					<div className="search-container search-container-value">
						<textarea
							style={{ fontFamily: 'Arial' }}
							className="search"
							type="text"
							name="searchTerm"
							value={this.state.value}
							placeholder="Type here to writing something..."
							onChange={this.handleChange('value')}
						/>
					</div>
					<div className="submit-message">
						<button
							onClick={this.submit}
							type="button"
							className="ant-btn ant-btn-primary"
							ant-click-animating-without-extra-node="false"
						>
							<span>Comment</span>
						</button>
					</div>
				</div>
			</Layout>
		);
	}
}
