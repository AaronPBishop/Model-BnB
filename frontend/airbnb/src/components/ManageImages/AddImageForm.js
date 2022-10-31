import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { sendSpotImgData, feedImgFormData } from '../../store/spots.js';
import { addTempReviewImg, addMoreReviewImages } from '../../store/reviews.js';

const AddImageForm = ({ type, spotId, reviewId }) => {
    const dispatch = useDispatch();

    const [url, setUrl] = useState('');
    const [previewImage, setPreviewImage] = useState(false);
    const [clicked, setClicked] = useState(false);

    return (
        <div id={type !== 'createSpot' ? 'form-container' : 'new-spot-form-container'}>

            <form id={type !== 'createSpot' ? 'image-form' : 'new-spot-image-form'}>

                <label className='image-form-holders'>
                    <input
                    id={type !== 'createSpot' && type !== 'createReview' ? 'photos-input' : 'new-spot-photos-input'}
                    type='text'
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder='image URL'
                    ></input>
                </label>
                
                {
                    type !== 'createSpot' && type !== 'createReview' && 
                    <div className='image-form-holders'>

                    <p>Is this a preview image?</p>

                    <label className='preview-radio'>
                        Yes
                        <input
                            type="radio"
                            value={true}
                            name="previewImage"
                            onChange={() => setPreviewImage(true)}
                            checked={previewImage === true}/>
                    </label>

                    <label className='preview-radio'>
                        No
                        <input
                            type="radio"
                            value={false}
                            name="previewImage"
                            onChange={() => setPreviewImage(false)}
                            checked={previewImage === false}/>
                    </label>

                    </div>
                }

                <button id={type !== 'createSpot' ? 'add-image' : 'new-spot-add-image'} onClick={e => {
                    e.preventDefault();
                    setClicked(true);

                    if (type === 'createSpot') dispatch(feedImgFormData(url));

                    if (type === 'createReview') dispatch(addTempReviewImg(url, previewImage));

                    if (type === 'editSpot') dispatch(sendSpotImgData(spotId.spotId, {url, previewImage}));

                    if (type === 'editReview') dispatch(addMoreReviewImages(url, previewImage, reviewId));
                }}>
                    {type !== 'editSpot' && type !== 'editReview' && clicked === true ? <p><i>Added</i></p> : <p>Add</p>}
                </button>

            </form>

        </div>
    )
};

export default AddImageForm;