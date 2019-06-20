import React from 'react';
import fetch from 'isomorphic-unfetch';

class MovieReview extends React.Component {

  state = {
    movieName: '',
    reviews: [],
    hasMore: false,
    offset: 0,
    };

  handleSearch = async () => {
    const res = await fetch(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${this.state.movieName}&api-key=${process.env.REACT_APP_NYTAPIKey}`);
    const data = await res.json();
    this.setState({ reviews: data.results, hasMore: data.has_more });
  }

  handleSearchBoxChange = (event) => {
    this.setState({ movieName: event.target.value});
    // If nothing in search box revert to previous
    if (event.target.value === '') {
      this.fetchMoviesData();
    }
  }

  componentDidMount = () => {
    this.fetchMoviesData();
  }

  fetchMoviesData = async () => {
    let apiUri = `https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=${process.env.REACT_APP_NYTAPIKey}&order=by-date`;
    const res = await fetch(apiUri);
    const data = await res.json();
    this.setState({
      reviews: data.results, 
      hasMore: data.has_more 
    });
  }

  loadMoreReviews = async () => {
    let apiUri = `https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=${process.env.REACT_APP_NYTAPIKey}&order=by-date`;
    const nextOffset = parseInt(this.state.offset+20);
    apiUri += `&offset=${nextOffset}`;

    const res = await fetch(apiUri);
    const data = await res.json();

    const reviews = this.state.reviews.concat(data.results);

    this.setState({
      reviews: reviews, 
      hasMore: data.has_more,
      offset: nextOffset
    });

    // TODO: Load more in contrast to filter queries
  }

  render() {
    const { reviews } = this.state;
    return (
      <div>
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
        { reviews &&
          reviews.map(review => (
        <div className="col-lg-4 col-md-6 col-sm-12 float-left d-flex mb-3" key={review.display_title}>
          <div className="card">
            {(review.multimedia && review.multimedia.src) ?
            (<img className="card-img-top" src={review.multimedia.src} alt="Card cap" />) :
            (<img className="card-img-top" src="https://i2.wp.com/candidcover.net/wp-content/uploads/2017/05/nyc1-2.png?zoom=2&resize=286%2C180&ssl=1" alt="Card cap"/>)
            }
            <div className="card-body">
              <h5 className="card-title">{review.display_title}</h5>
              <p className="card-text">
                {(review.summary_short) ?
                (<span className="text-small">{review.summary_short}</span>) :
                (<span className="text-small">No summary found for this review, Please click Read More to see the details</span>)}
              </p>
              <a href={review.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Read more...</a>
            </div>
          </div>
        </div>
        ))}
      </div>

      { this.state.hasMore &&
      <div className="row">
        <div className="col text-center">
          <button onClick={this.loadMoreReviews} variant="secondary" className="btn-lg mt-4 mb-4">Load more...</button>
        </div>
      </div>
      }
    </div>
    );
  }
}

export default MovieReview;