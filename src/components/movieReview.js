import React from 'react';
import fetch from 'isomorphic-unfetch';

import ReviewCard from './reviewCard';

class MovieReview extends React.Component {

  state = {
    movieName: '',
    reviews: [],
    hasMore: false,
    offset: 0,
    text_asjad: '**'
    };

  handledosomething = (receivedText) => {
    this.setState({ text_asjad: receivedText });
  }

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

  compareArrays = (arr1, arr2) => {
    const A = arr1.map(x => x.display_title);
    const B = arr2.map(x => x.display_title);
    return B.filter(function (a) {
        return A.indexOf(a) === -1;
    });
  }

  componentDidMount = () => {
    this.fetchMoviesData();

    // Set interval of fetching for new content
    window.setInterval(() => {
      if (this.state.movieName === '') {
        const stateReviews = this.state.reviews;
        const newlyFetchedReviews = this.fetchMoviesData(true);
        let unrenderedReviews = this.compareArrays(stateReviews, newlyFetchedReviews);
        if (unrenderedReviews.length > 0) {
          // Some new review came up
          this.setState({
            reviews: [...newlyFetchedReviews, ...stateReviews]
          });
        }
      }
    }, 15 * 60 * 60 * 1000); // Every 15 minutes
  }

  fetchMoviesData = async (keepState) => {
    let apiUri = `https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=${process.env.REACT_APP_NYTAPIKey}&order=by-date`;
    const res = await fetch(apiUri);
    const data = await res.json();
    if (!keepState) {
      this.setState({
        reviews: data.results, 
        hasMore: data.has_more 
      });
    } else {
      return {
        reviews: data.results
      }
    }
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
              className="btn btn-primary" 
              type="button"
              onClick={this.handleSearch}>
                Search
            </button>
        </div>
      </div>

      <div className="row">
        {this.state.text_asjad}
        { reviews &&
          reviews.map(review => (
          <ReviewCard 
            review={review}
            dosomething={this.handledosomething} />
        ))}
      </div>
      
      {
        reviews.length === 0 &&
        <div className="text-center">Try searching another name, we have got plenty!</div>
      }

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