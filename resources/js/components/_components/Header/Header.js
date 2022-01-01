import Navbar from '../navbar/Navbar'

const Header = ({ user }) => {
    return (
        <>
            {user !== null ? <Navbar firstname={user.firstname} lastname={user.lastname} pictureSource={user.pictureSource} role={user.role_id} profile_completed={user.profile_completed} id={user.id} /> :
                <Navbar key={1} firstname={null} lastname={null} pictureSource={null} role={null} />}
        </>
        //potentiellement div pour pub
    )
}

export default Header
