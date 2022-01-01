import React from 'react'
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export default class FilterItems extends React.Component {

    constructor(props) {
        super(props);
    }

    handleOnChange = (e) => {
        this.props.handleClickFilter(this.props.search);
    }


    // Empêche le component de se loader après le loading initial
    shouldComponentUpdate(nextProps) {

        if (nextProps.items != this.props.items) {
            return true;
        }
        return false;

    }

    render() {

        return this.props.items.map((item) => (
            <div key={uuidv4()}>
                <Form.Group controlId={item.name}>
                    <Form.Check
                        className="margin-left"
                        type="checkbox"
                        onChange={this.handleOnChange}
                        value={item.id}
                        label={item.name}
                    />
                </Form.Group>
            </div>
        ));

    }
}