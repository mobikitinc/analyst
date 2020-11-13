import React, { Component } from 'react';
import AnalystBox from 'analystbox';
import './App.css';
import cities from './data/cities.json';
import latitudelongitudes from './data/latitudelongitudes.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 39.9612,
      longitude: -82.9988,
    };

    this.cities = cities;
    this.latitudelongitudes = latitudelongitudes;
  }

  renderDarkSky = () => {
    const today = new Date();

    let url = 'https://maps.darksky.net/@';
    url += 'temperature';
    url += `,${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 1}`;
    url += ',2';
    url += `,${this.state.latitude}`;
    url += `,${this.state.longitude}`;
    url += ',11';

    return (
      <iframe
        src={url}
        title="map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
      />
    );
  };

  render() {
    return (
      <div className="container">
        <div className="searchContainer">
          <div className="search">
            <AnalystBox
              questions={this.cities.map((city) => `show me ${city}`)}
              onQuestionSelect={({ questionIndex }) => {
                const [latitude, longitude] = this.latitudelongitudes[questionIndex];
                this.setState({ latitude, longitude });
              }}
              keywords={this.cities}
              searchOptions={{
                maxResults: 6,
                engines: {
                  triePrefixSearch: { shouldCache: false },
                  linearSubstringSearch: {},
                },
              }}
            />
          </div>
        </div>

        <div className="mapContainer">{this.renderDarkSky()}</div>
      </div>
    );
  }
}

export default App;
