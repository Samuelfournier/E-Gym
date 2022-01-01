import { React } from "react";
import { Accordion } from "react-bootstrap";
import Filter from "./Filter";
import FilterPreference from "./FilterPreference";

const FilterList = ({ attributes, handleClickFilter, user, userPreference, handleClickPreference, tags, search }) => {


    return (
        <>
            {
                user != null &&
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Mes recommandations</Accordion.Header>
                        <Accordion.Body>
                            <FilterPreference
                                userPreferences={userPreference}
                                handleClickPreference={handleClickPreference}
                                attributes={attributes}
                                tags={tags}
                                search={search}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            }
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Types</Accordion.Header>
                    <Accordion.Body>
                        <Filter
                            attributes={attributes}
                            items={attributes.types}
                            handleClickFilter={handleClickFilter}
                            tags={tags}
                            search={search}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {user == null && <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Coût</Accordion.Header>
                    <Accordion.Body>
                        <Filter
                            attributes={attributes}
                            items={attributes.visibilities}
                            handleClickFilter={handleClickFilter}
                            tags={tags}
                            search={search}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>}

            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Categorie</Accordion.Header>
                    <Accordion.Body>
                        <Filter
                            attributes={attributes}
                            items={attributes.categories}
                            handleClickFilter={handleClickFilter}
                            tags={tags}
                            search={search}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export default FilterList;
