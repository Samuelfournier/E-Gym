import React from 'react'
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";

export default function Tags({onKeyDown,onChange,input,tags,deleteTag}) {
    return (
        <>
            <Row>
                <Col lg={9}>
                    <InputGroup className="mb-3" className="v-center">
                        <FormControl
                            placeholder="Entrer des tags..."
                            aria-label="tags"
                            aria-describedby="tags"
                            onKeyDown={onKeyDown}
                            onChange={onChange}
                            value={input}
                            className="width-input-tags"
                        />
                    </InputGroup>
                </Col>
                <Col lg={3} className="v-center">
                    Max (5)
                </Col>
            </Row>
            <div >
                {tags.map((tag, idx) => (
                    <Col onClick={() => deleteTag(idx)}
                        key={idx} className="tag">{tag}
                        <button>x</button>
                    </Col>
                ))}
            </div>
        </>
    )
}
