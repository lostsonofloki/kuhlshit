import { Link } from 'react-router-dom'
import './SpotCheckPage.css'

function SpotCheckPage() {
  return (
    <div className="spotcheck-page">
      <h1 className="spotcheck-title">
        YOU FOUND LOUIE. 🤫
      </h1>
      <p className="spotcheck-desc">
        Wait... I thought dalmatians didn&apos;t exist? You&apos;ve stumbled upon a glitch in the matrix.
      </p>
      <Link
        to="/"
        className="spotcheck-back"
      >
        Back to Reality
      </Link>
    </div>
  )
}

export default SpotCheckPage
