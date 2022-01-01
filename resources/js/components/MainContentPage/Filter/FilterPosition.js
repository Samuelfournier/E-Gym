import { React } from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const FilterPosition = ({ sport, position, handleClickFilter }) => {
    return (
        <div key={uuidv4()}>
            <Form.Group controlId={sport.name + "_" + position.name}>
                <Form.Check
                    className="margin-left-double"
                    type="checkbox"
                    onChange={handleClickFilter}
                    value={position.id}
                    label={position.name}
                />
            </Form.Group>
        </div>
    );
};
export default FilterPosition;
