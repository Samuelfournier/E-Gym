import React from 'react'
import { Alert} from "react-bootstrap";

export default function BannerEmptyContent({ show, text }) {
    return (
        show && <Alert variant='danger' className='text-center' style={{ width: "50%"}}>
                {text}
            </Alert>
    )
}
