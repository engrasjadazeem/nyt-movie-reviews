import React, { Component } from 'react';

class ReviewCard extends Component {
  state = {
    review: this.props.review
  };
  
  render() {
    const { review } = this.props;
    return (
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
    );
  }
}

export default ReviewCard;