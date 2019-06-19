import React from 'react';
import fetch from 'isomorphic-unfetch';
import config from '../config/development';

class MovieReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: '',
      reviews: []
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this);
  }

  handleSearch() {
    console.log(this.state.movieName);
  }

  handleSearchBoxChange(event) {
    this.setState({ movieName: event.target.value});
  }

  componentWillMount() {
    this.fetchMoviesData();
  }

  async fetchMoviesData() {
    const res = await fetch(`https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=${config.NYTAPIKey}`);
    const data = await res.json();

    console.log(`Reviews data fetched, Count: ${data.num_results}`);
    console.log(data);
    // return {
    //   reviews: data.results
    // }
    this.setState({ reviews: data.results });
  }

  render() {
    return (
      <div>
        {this.state.movieName}
        <div className="input-group mb-3">
          <input 
            type="text"
            value={this.state.movieName}
            onChange={this.handleSearchBoxChange}
            name="searchBox" 
            className="form-control" 
            placeholder="Search for a movie..." 
            aria-label="Search" 
            aria-describedby="basic-addon2" />
          <div className="input-group-append">
            <button 
              className="btn btn-secondary" 
              type="button"
              onClick={this.handleSearch}>
                Search
            </button>
        </div>
      </div>

      <div className="row">
        {this.state.reviews.map(review => (
        <div className="col-lg-4 col-md-6 col-sm-12 float-left d-flex mb-3">
          <div className="card" key={review.link.url} >
            <img className="card-img-top" src={review.multimedia.src} alt="Card cap" />
            <div className="card-body">
              <h5 className="card-title">{review.display_title}</h5>
              <p className="card-text">
                <span className="text-small">{review.summary_short}</span>
              </p>
              <a href={review.link.url} target="_blank" className="btn btn-sm btn-primary">Read more...</a>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
    );
  }
}

export default MovieReview;