import React from 'react'
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";


export default class FilterProgress extends React.Component {

    constructor(props) {
        super(props);
    }

    handleOnChange = (e) => {
        this.props.handleClickFilter(this.props.search);
    }


    // Empêche le component de se loader après le loading initial
    shouldComponentUpdate(nextProps) {
        return false;
    }

    render() {

        const ProgressState = [{
            id: 1,
            name: 'Terminé',
            value: 'Completed'
        },
        {
            id: 2,
            name: 'En cours',
            value: 'In progress'
        },
        {
            id: 3,
            name: 'Non commencé',
            value: 'Not started'
        }
        ]

        return ProgressState.map((item) => (
            <div key={uuidv4()}>
                <Form.Group controlId={item.value}>
                    <Form.Check
                        className="margin-left"
                        type="checkbox"
                        onChange={this.handleOnChange}
                        value={item.value}
                        label={item.name}
                    />
                </Form.Group>
            </div>
        ));

    }
}