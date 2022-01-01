import React from 'react'
import { ProgressBar } from "react-bootstrap";

export default function ProgressBarPlan ({ progress, progressNumber }) {

    return (
        <>
            {
                progress == 'Completed'
                ?
                    <ProgressBar animated variant={"success"} now={progressNumber} />
                :
                    <ProgressBar key={3}>
                        <ProgressBar striped variant="primary" now={progressNumber} label={progressNumber + " %"} key={1} />
                        <ProgressBar variant="light" now={100 - progressNumber} key={2} />
                  </ProgressBar>
            }
            <hr />
        </>
    )

}