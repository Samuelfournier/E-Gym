import React, { useState, useEffect } from 'react'
import { Form,Button, Container } from 'react-bootstrap'

let cat = {
    name: "Ajouter un nom",
    description: "Ajouter une description",
    button: "Ajouter"
}
let val = {
    name: "",
    description: ""
}
export default function AddCategoryForm({ handleSubmit, formRef, err, ...props }) {
    const [category, setCategory] = useState(cat);
    const [inputs, setValue] = useState(val);
    const id = props.id
    if (id) {
        useEffect(() => {
            getData();
        }, [])

        const getData = async () => {
            let catData = await axios.get('/api/get-category/' + id)
            console.log(catData.data.description)
            setCategory({
                ...category,
                name: catData.data.name,
                description: catData.data.description,
                button: "Modifier"
            })
            setValue({
                ...inputs,
                name: catData.data.name,
                description: catData.data.description,
            })
        }
    }
    const onChangeName = (e) => {
        setValue({ ...inputs, name: e.target.value })
    }
    const onChangeDescription = (e) => {
        setValue({ ...inputs, description: e.target.value })
    }
    useEffect(() => {
        setCategory(cat),
            setValue(val)
    }, [])

    return (
        <>
            <Container fluid >
            <Form id="category-form" ref={formRef} onSubmit={handleSubmit} >
                <span>{err}</span>
                <Form.Group className="mb-3">
                    <Form.Control
                        //className="cat-input"
                        name="category-id"
                        type="hidden"
                        value={id}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label >Nom</Form.Label>
                    <Form.Control
                        //className="cat-input"
                        type="text"
                        name="category-titre"
                        placeholder={category.name}
                        value={inputs.name}
                        onChange={onChangeName}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label >Description</Form.Label>
                    <Form.Control
                       // className="cat-input"
                        type="text" name="category-description"
                        placeholder={category.description}
                        value={inputs.description}
                        onChange={onChangeDescription}
                        required
                    />
                </Form.Group>
                <hr />

                <Button type="submit" variant="primary" className="w-100">
                    {category.button}
                </Button>
            </Form>
            </Container>
        </>
    )
}

