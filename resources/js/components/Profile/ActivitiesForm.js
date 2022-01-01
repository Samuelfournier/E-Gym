import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ActivitiesData from './ActivitiesData'
export default function ActivitiesForm() {
    const [activitiesData, setActivitiesaData] = useState('')

    useEffect(() => {
        getAllActivities()
    }, [])

    const getAllActivities = async () => {
        const allActivities = await axios.get('/api/complete-profile')
        setActivitiesaData(allActivities.data.data)

    }

    return (
<>
        <ActivitiesData actviData={activitiesData} />

</>
    )

}

