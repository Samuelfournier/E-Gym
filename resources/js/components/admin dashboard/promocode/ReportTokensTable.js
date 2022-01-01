import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

// Bootstrap table
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search, CSVExport, } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import axios from "axios";

export default function ReportTokensTable({tokens, deleteToken}) {

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;

    // Add buttons actions in action col for each token.
    const actionColFormatter = (cell, row, rowIndex, formatExtraData) => {
        //console.log(cell, row, rowIndex, formatExtraData);

        // row == token
        return (
            <>
                {row.is_used === 'Non' ?
                    (
                        <Button size="sm" variant="danger" className="mx-1" onClick={(e) => { deleteToken(e, row.id) }}>Supprimer</Button>
                    ) : (
                        ''
                    )
                }
            </>
        );

    }


    // Button to export only unused tokens
    const ExportUnusedToken = (props) => {
        const handleClick = () => {
            // passing my custom data
            props.onExport(tokens.filter((token) => token.is_used === 'Non'));
        };
        return (
            <button className="btn btn-outline-primary" onClick={handleClick}>
                Exporté les codes inutilisées
            </button>
        );
    };

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Affiche {from} à {to} de {size} résultats
        </span>
    );

    const options = {
        showTotal: true,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [
            {
                text: "5",
                value: 5,
            },
            {
                text: "10",
                value: 10,
            },
            {
                text: "Tout",
                value: tokens.length,
            },
        ],
    };

    // Columns of the table
    const columns = [
        {
            dataField: "id",
            text: "ID",
            sort: true,
            csvExport: false,
            align: "center",
            style: {
                width:'auto',
            }
        },
        {
            dataField: "code",
            text: "Code",
            align: "center",
        },
        {
            dataField: "expiration_date",
            text: "Date d'expiration",
            sort: true,
            align: "center",
        },
        {
            dataField: "is_used",
            text: "Est utilisé?",
            csvExport: false,
            sort: true,
            align: "center",
        },
        {
            dataField: "created_at",
            text: "Générer le:",
            csvExport: false,
            sort: true,
            align: "center",
        },
        {
            // Contains buttons to delete
            dataField: "action",
            csvExport: false,
            text: "Actions",
            align: "center",
            formatter: actionColFormatter,
        },
    ];

    // Render
    return (
        <>
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">Rapport - Codes d'inscription</Card.Header>
                <Card.Body>
                    {/* Boostrap table */}
                    <ToolkitProvider
                        keyField="id"
                        data={tokens}
                        columns={columns}
                        search
                    >
                        {(props) => (
                            <div>
                                <Row className="justify-content-between mb-2">
                                    <span className="lead fs-3">
                                        Rechercher un code:
                                    </span>
                                    <Col className="mb-2">
                                        <SearchBar {...props.searchProps} placeholder="Rechercher"/>
                                    </Col>
                                    <Col className="mb-2">
                                        <span className="fa-pull-right">
                                            <ExportCSVButton {...props.csvProps} className="btn btn-outline-primary mx-2">Exporté tout</ExportCSVButton>
                                            <ExportUnusedToken {...props.csvProps}  />
                                        </span>
                                    </Col>
                                </Row>

                                <BootstrapTable
                                    {...props.baseProps}
                                    pagination={paginationFactory(options)}
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
