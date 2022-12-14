import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSpotReview, editSpotReview, createReviewImage, submittedReview } from '../../store/reviews.js';
import AddImageForm from '../ManageImages/AddImageForm.js';

import './styles.css';

const CreateReview = ({ spotId, reviewId, type }) => {
    const dispatch = useDispatch();

    const [clicked, setClicked] = useState(false);
    const [clickedAddImg, setClickedAddImg] = useState(false);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [errors, setErrors] = useState([]);
    const [invalid, setInvalid] = useState(false);

    const session = useSelector(state => state.session);
    const reviews = useSelector(state => state.reviews);
    const isSubmitted = reviews.submitted;

    useEffect(() => {
      if (type === 'edit' && reviews && reviews[reviews.editMode.reviewId].review) {
        setReview(`${reviews[reviews.editMode.reviewId].review}`);
        setRating(reviews[reviews.editMode.reviewId].stars)
      };
    }, []);

    let hasReviewed;
    if (session && session.user && reviews) for (let key in reviews) if (reviews[key].User && reviews[key].User.id) reviews[key].User.id === session.user.id ? hasReviewed = true : hasReviewed = false;

    useEffect(() => {
      setInvalid(false);

      const errorsArr = [];

      if (review.length < 2 || review.length > 1000) errorsArr.push('Review must be between 2 and 1000 characters in length');
      if (!rating) errorsArr.push('Review must include a rating');

      setErrors(errorsArr);
    }, [review, rating]);

    const handleSubmit = async e => {
      e.preventDefault();

      if (errors.length > 0) {
        setInvalid(true);
        return;
      };

      if (type === 'edit') {
        const newReview = await dispatch(editSpotReview({review, stars: rating}, reviewId));

        if (newReview) {
          const newReviewImages = reviews.CurrentReviewImgs;

          if (newReviewImages) dispatch(createReviewImage(newReviewImages.url, newReviewImages.preview, reviewId));
          dispatch(submittedReview(true));

          return;
        };

        dispatch(submittedReview(true));
        return;
      };
      
      if (type !== 'edit') {
        const newReview = await dispatch(createSpotReview({review, stars: rating}, spotId));

        if (newReview) {
          const newReviewImages = reviews.CurrentReviewImgs;

          if (newReviewImages) dispatch(createReviewImage(newReviewImages.url, newReviewImages.preview, newReview.id));
          dispatch(submittedReview(true));
          
          return;
        };

        dispatch(submittedReview(true));
        return;
      };
    };

    useEffect(() => {
      setClicked(false);
    }, [isSubmitted])

    return (
        <div id={clicked ? 'move-create-review-container' : 'create-review-container'}>
            {
              type !== 'edit' && 
              <button 
                id={clicked ? 'hide-create-review-button' : 'create-review-button'} 
                onClick={() => setClicked(true)}
                style={{visibility: hasReviewed === true && 'hidden' || !session.user && 'hidden', cursor: 'pointer'}}
                disabled={hasReviewed === true || !session.user}>
                  Add a Review
                </button>}

            <div id={type === 'edit' ? 'edit-review-form' : clicked ? 'review-form' : 'review-form-hidden'}>

              {
                invalid === true && 
                <div 
                style={{
                  position: 'relative',
                  bottom: '8vh',
                  right: '7vw',
                  textAlign: 'center',
                  lineHeight: '25px',
                  fontWeight: 'bold'
                }}>
                  {errors.map((err, i) => <li style={{listStyle: 'none'}} key={i}>{err}</li>)}
                </div>
              }

               <form>
                    <label>
                        <textarea
                        id='review-textarea'
                        style={{boxShadow: '0px 1px 10px -5px rgb(65, 65, 65)'}}
                        type='textarea'
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        placeholder='Review'>
                        </textarea>
                    </label>

                    <div className="star-rating">
                        {[...Array(5)].map((star, index) => {
                          index += 1;
                          return (
                            <button
                              id='stars-button'
                              type="button"
                              key={index}
                              className={index <= (hover || rating) ? "on" : "off"}
                              onClick={() => setRating(index)}
                              onMouseEnter={() => setHover(index)}
                              onMouseLeave={() => setHover(rating)}
                            >
                              <span className="stars">&#9733;</span>
                            </button>
                          );
                        })}
                        <p><b>{rating}</b></p>
                    </div>

                    {
                      clickedAddImg &&
                      <div id='review-add-img-form' style={{}}>
                          <AddImageForm type='createReview' spotId={spotId} />
                      </div>
                    }

                    <div 
                      style={{
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        position: 'relative',
                        bottom: '7vh',
                        marginLeft: '10vw'
                      }}>

                        <button 
                          id='review-add-img-button' 
                          onClick={e => {setClickedAddImg(true); e.preventDefault()}}
                          style={{visibility: type === 'edit' && 'hidden'}}>
                          Add Image
                        </button>

                        <button 
                          id={type !== 'edit' ? 'submit-review' : 'submit-edit'} 
                          type='submit' 
                          onClick={handleSubmit}>
                          {
                            type !== 'edit' ? <p style={{position: 'relative', bottom: '1.1vh'}}>Submit Review</p> 
                            : <p style={{position: 'relative', bottom: '1.1vh'}}>Confirm Changes</p>
                          }
                        </button>
                    </div>
               </form>
            </div>
        </div>
    );
};

export default CreateReview;