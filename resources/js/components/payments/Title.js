import React from 'react'

export default function Title({title, style}) {
    return (
        <h1 className={style}>
            {title}
        </h1>
    )
}
