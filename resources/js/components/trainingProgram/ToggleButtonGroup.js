import { React, useState } from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'

const ToggleButtonGroup = ({ radioButtonValue, setRadioButtonValue, exercice }) => {
    // const [checked, setChecked] = useState(false);

    const radios = [
        { name: 'Tempo', value: '1' },
        { name: 'Durée', value: '2' },
    ];

    return (
        <>
            <ButtonGroup>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}-${exercice.id}`}
                        type="radio"
                        size="sm"
                        variant={idx % 2 ? 'outline-primary' : 'outline-secondary'}
                        name="radio"
                        value={radio.value}
                        checked={radioButtonValue === radio.value}
                        onChange={(e) => setRadioButtonValue(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </>
    )
}

export default ToggleButtonGroup
