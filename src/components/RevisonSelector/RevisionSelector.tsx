import EditArticle from "../EditArticle/EditArticle";
import React, {useEffect, useState} from "react";
import {Tab, Tabs,} from "@mui/material";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {Title} from "../../stylesheets/Fonts";
import {useQuery} from "@apollo/client";
import {GetLawRevisionsDocument, GetLawRevisionsQuery,} from "../../graphql/api-schema";
import moment from 'moment-timezone';

const RevisionSelector: React.FC = () => {
    // Get id from the router
    const {id} = useParams();
    const [lawId, setLawId] = useState<string | undefined>();
    useEffect(() => {
        setLawId(id);
    }, [id]);
    // Query to get data
    const {
        data: queryResult,
        loading: revisionLoading,
        error: revisionError,
        refetch: lawRefetch
    } = useQuery<GetLawRevisionsQuery>(GetLawRevisionsDocument, {
        variables: {
            id: lawId
        }
    });

    useEffect(() => {
        if (revisionLoading) {
            return
        }
        if (queryResult) {
            setValue(queryResult.lawRevisions.law.revision)
        }
    }, [revisionLoading, queryResult]);


    const [value, setValue] = React.useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // Refetch new revision
    const [state, setState] = useState<boolean>(false);

    if (state) {
        lawRefetch({
            variables: {
                id: lawId,
            }
        })
        setState(false)
    }

    return (
        <Box>
            <>
                <h1 style={Title}>Versiebeheer</h1>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                    sx={{
                        '& .MuiTabs-scrollButtons.Mui-disabled': {
                            opacity: 0.3
                        }
                    }}
                >
                    {
                        queryResult?.lawRevisions.revisions.map((value) =>
                            <Tab key={value.revision}
                                 label={moment.utc(value.createdAt).local().toDate().toLocaleString()}
                                 value={value.revision}/>
                        )
                    }
                </Tabs>
            </>
            <EditArticle revision={value} stateChanger={setState}/>
        </Box>
    )
};
export default RevisionSelector;
