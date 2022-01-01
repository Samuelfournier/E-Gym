import React, { useState, useEffect } from 'react';
import { Col, Row, Dropdown, Form } from 'react-bootstrap'

const state = {
    countries: [],
    provinces: [],
    selectedCountry: '',
    selectedProvince: ''
}


const Country = props => {
    const [states, setstates] = useState(state)
    const [countries, setCountries] = useState(props.countries);
    const [selectedCountry, setSelectedCountry] = useState("Canada")
    const [selectedProvince, setSelectedProvince] = useState("")

    useEffect(() => {
        setCountries(props.countries)
    }, [props.countries])

    const changeCountry = e => {
        setSelectedCountry({ ...selectedCountry, [e.target.name]: e.target.value })

    }
    const changeProvince = e => {
        setSelectedProvince({ ...selectedProvince, [e.target.name]: e.target.value })
    }
    //Place les noms de pays dans le select
    const listCountries = countries && Object.keys(countries).map((pays, i) =>
        <option key={i.toString()} name={countries[pays].name} value={countries[pays].name} >{countries[pays].name}</option>)

    //Place les noms de provinces dans le select selon le pays sélectionné
    const listProvinces = countries && Object.keys(countries).map((pays) =>
        Object.keys(countries[pays].provinces).map((province, i) => {
            if (selectedCountry.pays === countries[pays].name ||selectedCountry === countries[pays].name) {

                return (
                    <option
                        key={i.toString()}
                        value={province}
                        name={countries[pays].provinces[province].name}
                    >
                        {countries[pays].provinces[province].name}
                    </option>
                )
            }
        })
    )
    //Render
    return (
        <Row>
            <Col >
                <Form.Group as={Col} controlId="countries" className="mb-2">
                    <Form.Label className="lead fs-3">Pays</Form.Label>
                    <Form.Select
                        name='pays'
                        onClick={changeCountry}
                    >
                        {listCountries}

                    </Form.Select>
                </Form.Group>
            </Col>
            <Col >
                <Form.Group as={Col} controlId="provinces" className="mb-2">
                    <Form.Label className="lead fs-3">Province</Form.Label>
                    <Form.Select
                        required
                        name='provinces'
                        onChange={changeProvince}
                    >
                        {listProvinces}
                    </Form.Select>

                </Form.Group>
            </Col>
        </Row >

    );
};

export default Country;
