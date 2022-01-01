import React from 'react'
import { Link } from 'react-router-dom'
import '../Footer/footer.css'

const Footer = () => {
    return (
      <footer className="footer py-4">
        <p className="footer-text">&copy; 2021 Copyright: <Link className="copyright-link" to="/">e-gym.com</Link></p>
      </footer>
    )
}

export default Footer
