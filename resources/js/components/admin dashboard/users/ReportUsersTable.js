import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

// Bootstrap table
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search, CSVExport, } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

export default function ReportUsersTable({ users }) {

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;
    let history = useHistory();


    // Formatters
    const actionColFormatter = (cell, row, rowIndex, formatExtraData) => {
        console.log(row);

        // row == token
        return (
            <>
                <Button
                    size="sm"
                    variant="primary"
                    className="mx-1"
                    onClick={(e) => {
                        history.push('/modifier-profil/' + row.id);
                    }}
                >
                    Modifier
                </Button>

            </>
        );
    };

    // Columns of the table
    const columns = [
        {
            dataField: "id",
            text: "ID",
            sort: true,
            csvExport: false,
            align: "center",
            headerStyle: (colum, colIndex) => {
                return { width: "3.5rem", textAlign: "center" };
            },
        },
        {
            dataField: "lastname",
            text: "Nom",
            csvExport: true,
            sort: true,
            align: "center",
        },
        {
            dataField: "firstname",
            text: "Prénom",
            csvExport: true,
            sort: true,
            align: "center",
        },
        {
            dataField: "email",
            text: "Courriel",
            csvExport: true,
            sort: true,
            align: "center",
        },
        {
            dataField: "role_id",
            text: "Rôle",
            csvExport: true,
            sort: true,
            align: "center",
        },
        {
            dataField: "user_status_id",
            text: "Status",
            csvExport: true,
            sort: true,
            align: "center",
        },
        {
            dataField: "created_at",
            text: "Date de création",
            csvExport: false,
            sort: true,
            align: "center",
        },
        {
            // Contains buttons to modify
            dataField: "action",
            csvExport: false,
            text: "Actions",
            align: "center",

            formatter: actionColFormatter,
        },
    ];

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
             Affiche {from} à {to} de {size} résultats
        </span>
    );

    const options = {
        showTotal: true,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [{
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: 'Tout', value: users.length
            }],
    };



    // Render
    return (
        <>
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">Rapport - Utilisateurs</Card.Header>
                <Card.Body>
                    {/* Boostrap table */}
                    <ToolkitProvider
                        keyField="id"
                        data={users}
                        columns={columns}
                        search
                    >
                        {(props) => (
                            <div>
                                <Row className="justify-content-between mb-2">
                                    <span className="lead fs-3">
                                        Rechercher un utilisateur:
                                    </span>
                                    <Col lg="4" md="5" sm="6" className="mb-2">
                                        <SearchBar
                                            {...props.searchProps}
                                            placeholder="Rechercher"
                                        />
                                    </Col>
                                    <Col lg="3" md="5" sm="6" className="mb-2">
                                        <ExportCSVButton
                                            {...props.csvProps}
                                            className="btn btn-outline-primary w-100 mb-2"
                                        >
                                            Exporté tout
                                        </ExportCSVButton>
                                    </Col>
                                </Row>

                                <BootstrapTable
                                    {...props.baseProps} pagination={ paginationFactory(options) }
                                    bootstrap4
                                    hover
                                    sort={{ dataField: "id", order: "asc" }}
                                    headerClasses="bg-secondary text-white text-center"
                                />
                            </div>
                        )}
                    </ToolkitProvider>
                </Card.Body>
            </Card>
        </>
    );
}
