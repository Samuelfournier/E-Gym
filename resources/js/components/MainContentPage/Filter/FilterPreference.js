import React, { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

// const FilterPreference = ({ attributes, userPreferences, handleClickPreference, tags, search }) => {


//     const [userTags, setUserTags] = useState(tags);

//     const handleOnChange = (e) => {
//         console.log(userTags);
//         // handleClickPreference(e, search, tags);
//     }



//     return (
//         <>
//             {useMemo(() => {
//                 return (
//                     <div key={uuidv4()}>
//                         <Form.Group controlId="preference" >
//                             <Form.Check
//                                 className="margin-left"
//                                 type="checkbox"
//                                 onChange={handleOnChange}
//                                 label="Recommander pour moi"
//                             />
//                         </Form.Group>
//                     </div>
//                 )
//             }, [attributes, search])}
//         </>
//     );
// };


class FilterPreference extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            attributes: props.attributes
        }
    }

    handleOnChange = (e) => {
        // console.log(this.props.tags);
        this.props.handleClickPreference(e, this.props.search, this.props.tags);
    }

    // Empêche le component de se loader après le loading initial
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {


        return (<div key={uuidv4()}>
            <Form.Group controlId="preference" >
                <Form.Check
                    className="margin-left"
                    type="checkbox"
                    onChange={this.handleOnChange}
                    label="Recommander pour moi"
                />
            </Form.Group>
        </div>
        )
    }
}

export default FilterPreference;