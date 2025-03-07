import { useState, useEffect, useContext } from 'react';
import UseModal from '../general/UseModal';
import BasicInfo from '../../pages/settings/components/BasicInfo.jsx';
import { ResourceContext } from '../../../context/ResourceContext';
import NewForm from './NewForm'
const FirstUpdateForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const [checker, setChecker] = useState(false);
    const header = "Update Your Profile"
    const { setGetCandidate, getCandidate, checker, setChecker, } = useContext(ResourceContext)

    useEffect(() => {
        setGetCandidate((prev) => {
            return {
                ...prev, isDataNeeded: true
            }
        })
        // console.log(getCandidate.data)
    }, [])
    

    return (
        <>
            {/* <button
                onClick={() => setIsOpen(true)}
                className="p-2 px-3 border-2 flex  border-green-700 font-medium hover:bg-green-100 text-green-700 items-center">
                Edit Profile
            </button> */}
            <UseModal header={header} setIsOpen={setChecker} isOpen={checker} >
                <p>Please complete your Registrration</p>
                <BasicInfo setIsOpen={setIsOpen}/>
            </UseModal>
        </>
    )
}

export default FirstUpdateForm