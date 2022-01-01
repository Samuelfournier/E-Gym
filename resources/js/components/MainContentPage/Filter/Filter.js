import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

// const Filter = ({ attributes, items, handleClickFilter, tags, search }) => {

//     const handleOnChange = (e) => {
//         handleClickFilter(e, search, tags);
//     }

//     return (
//         <>
//             {useMemo(() => {
//                 return items.map((item) => (
//                     <div key={uuidv4()}>
//                         <Form.Group controlId={item.name}>
//                             <Form.Check
//                                 className="margin-left"
//                                 type="checkbox"
//                                 onChange={handleOnChange}
//                                 value={item.id}
//                                 label={item.name}
//                             />
//                         </Form.Group>
//                     </div>
//                 ));
//             }, [attributes, tags, search])}
//         </>
//     );
// };


class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            attributes: props.attributes
        }
    }

    handleOnChange = (e) => {
        this.props.handleClickFilter(e, this.props.search, this.props.tags);
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

export default Filter;
