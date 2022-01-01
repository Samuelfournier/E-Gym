import React from 'react'
import { Row, InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Search({ HandleSearch }) {
    return (
        <Row>
            <InputGroup className="mb-3" className="v-center style-search-bar">
                <InputGroup.Text>
                    <span>
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                </InputGroup.Text>
                <FormControl
                    placeholder="Commencer à taper pour rechercher..."
                    onChange={HandleSearch}
                    type="search"
                />
            </InputGroup>
        </Row>
    )
}

