import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './common.css';


/**
 * publication_id -> id
 * userPublications -> array containing all id of userPublications with deleted_at == null
 * setUserLike -> change state userPublications (toggle an id when clicking on the heart.)
 * isLiked -> bool if true->heart is full, false ->heart is outlined.
 */
export default function LikeButton({ publication_id, userPublications, setUserLike, isLiked }) {


    // Toggle the like button
    const toggleLike = (e) => {
        e.stopPropagation(); // so it doesnt redirect

        // Change in backend the userPublication deleted_at value.
        axios.post("/api/toggle-like/" + publication_id).then(response => {

            if (response.data.liked === true) {
                setUserLike([...userPublications, publication_id]); //ADD

            } else {
                setUserLike(
                    userPublications.filter((id) => id !== publication_id)
                ); // DELETE
            }
        }).catch((error) => {
                console.log(error.response);
            });

    };

    // Render button
    return (
        <>
            <button type="button" className="like_button">
                <FontAwesomeIcon
                    className="item-icon red"
                    icon= { isLiked == true ? ["fas", "heart"] : ["far", "heart"] }
                    onClick={toggleLike}
                    fontVariant={'red'}
                    size="2x"
                />
            </button>
        </>
    );
}
