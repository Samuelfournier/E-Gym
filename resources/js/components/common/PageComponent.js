import React from 'react'
import { Pagination } from "react-bootstrap";

export default function PageComponent({ pageNumbers, currentPage ,handleClickPage }) {

    return (
        <Pagination>
            {pageNumbers.map((number) => {
                return <Pagination.Item key={number} active={currentPage == number ? true : false} value={number} onClick={handleClickPage} >{number}</Pagination.Item>
            })}
        </Pagination>
    )
}
