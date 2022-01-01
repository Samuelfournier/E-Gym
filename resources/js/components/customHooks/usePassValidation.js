import React, { useState, useEffect } from 'react'

export const usePassValidation = ({ password = "", password_confirmation = "" }) => {

    const [hasLength, setHasLength] = useState(null)
    const [hasUpperCase, setHasUpperCase] = useState(null)
    const [hasLowerCase, setHasLowerCase] = useState(null)
    const [hasNumber, setHasNumber] = useState(null)
    const [hasSpecial, setHasSpecial] = useState(null)
    const [match, setMatch] = useState(null)


    useEffect(() => {
        setHasLength(password.length >= 8 ? true : false);
        setHasUpperCase(password.toUpperCase() !== password);
        setHasLowerCase(password.toLowerCase() !== password);
        setHasNumber(/\d/.test(password));
        setHasSpecial(/[!,#,@,?,$,&,%]/.test(password));
        setMatch(password && password === password_confirmation);
    }, [password, password_confirmation]);


    return [hasLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial, match]
}
