import React, { useMemo } from "react";
import { Accordion } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import FilterFirstSport from "./FilterFirstSport";
import FilterPosition from "./FilterPosition";


class FilterListSport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            attributes: props.attributes
        }
    }

    handleOnChange = (e) => {
        // console.log(this.props.tags);
        this.props.handleClickFilter(e, this.props.search, this.props.tags);
    }

    // Empêche le component de se loader après le loading initial
    shouldComponentUpdate(nextProps) {

        if (nextProps.sports != this.props.sports) {
            return true;
        }
        return false;

    }

    render() {

        return (
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Sports</Accordion.Header>
                    <Accordion.Body>
                        {this.props.sports.map((sport) => {
                            var count = 1;
                            return sport.positions.map((position) => {
                                if (count == 1) {
                                    count++;
                                    return (
                                        <FilterFirstSport
                                            key={uuidv4()}
                                            sport={sport}
                                            position={position}
                                            handleClickFilter={this.handleOnChange}
                                            tags={this.props.tags}
                                        />
                                    );
                                } else {
                                    count++;
                                    return (
                                        <FilterPosition
                                            key={uuidv4()}
                                            sport={sport}
                                            position={position}
                                            handleClickFilter={this.handleOnChange}
                                        />
                                    );
                                }
                            });
                        })
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }
}

export default FilterListSport;
