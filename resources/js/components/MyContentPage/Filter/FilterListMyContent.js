import React from 'react'
import { Accordion } from "react-bootstrap";
import FilterItems from './FilterItems'
import FilterProgress from './FilterProgress'

export default function FilterListMyContent({ items, handleClickFilter, search }) {

    return (
        <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Types</Accordion.Header>
                    <Accordion.Body>
                        <FilterItems items={items} handleClickFilter={handleClickFilter} search={search} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Progression</Accordion.Header>
                    <Accordion.Body>
                        <FilterProgress handleClickFilter={handleClickFilter} search={search} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </>
    )
}
