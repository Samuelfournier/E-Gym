import React from 'react'
import { useParams } from 'react-router-dom';

export default function TestRedirectPlan() {

    const { id } = useParams();

    return (
        <div>
            this is the id of the plan : {id}
        </div>
    )
}


