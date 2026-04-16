import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MySpaceRetroView.css'

const MOODS = ['Artistic', 'Hyped', 'Sleep-deprived', 'Tour-brain', 'Lo-fi', 'DIY legend']

const BIG3_ERRORS = [
  {
    id: 'missing-plugin',
    title: 'The "Missing Plugin" (The absolute classic)',
    text: 'Plugin missing or out of date. Adobe Flash Player 8 required.',
    isBuffering: false,
  },
  {
    id: 'actionscript-crash',
    title: 'The "ActionScript Crash" (The nerdy one)',
    text: 'ActionScript Error: null is not an object at SoundMixer.play()',
    isBuffering: false,
  },
  {
    id: 'dialup-buffer',
    title: 'The "Dial-Up Death Buffer" (The infuriating one)',
    text: '[ Buffering track... 14kbps ]',
    isBuffering: true,
  },
]

function getRandomInt(min, max) {
  const mn = Math.ceil(min)
  const mx = Math.floor(max)
  return Math.floor(Math.random() * (mx - mn + 1)) + mn
}

function shuffleArray(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export default function MySpaceRetroView({ artists = [] }) {
  const navigate = useNavigate()
  const Maps = navigate

  const [profileOwner, setProfileOwner] = useState(null)
  const [top8Friends, setTop8Friends] = useState([])
  const [mood, setMood] = useState('')
  const [friendCount, setFriendCount] = useState(0)
  const [errorIndex, setErrorIndex] = useState(0)

  useEffect(() => {
    if (!artists || artists.length === 0) {
      setProfileOwner(null)
      setTop8Friends([])
      setMood(MOODS[getRandomInt(0, MOODS.length - 1)])
      setFriendCount(getRandomInt(100000, 999999))
      return
    }

    const ownerIndex = getRandomInt(0, artists.length - 1)
    const owner = artists[ownerIndex]
    const friendsPool = shuffleArray(artists.filter((a, idx) => idx !== ownerIndex))

    setProfileOwner(owner)
    setTop8Friends(friendsPool.slice(0, 8))
    setMood(MOODS[getRandomInt(0, MOODS.length - 1)])
    setFriendCount(getRandomInt(100000, 999999))
  }, [artists])

  useEffect(() => {
    if (!BIG3_ERRORS.length) return
    setErrorIndex(getRandomInt(0, BIG3_ERRORS.length - 1))
  }, [])

  const ownerName = profileOwner?.name || 'Mystery Artist'
  const ownerImage =
    profileOwner?.imageUrl || profileOwner?.thumbnailUrl || '/resources/artists/default-avatar.jpg'

  return (
    <div className="myspace-theme">
      {/* Header Nav */}
      <div className="myspace-nav">
        <div className="myspace-nav-left">
          <span className="myspace-logo-normal">kuhl</span>
          <span className="myspace-logo-icon">👥</span>
          <span className="myspace-logo-bold">shit.com</span>
        </div>
        <div className="myspace-nav-right">
          <span className="myspace-nav-link">Home</span>
          <span className="myspace-nav-separator">|</span>
          <span className="myspace-nav-link">Search</span>
          <span className="myspace-nav-separator">|</span>
          <span className="myspace-nav-link">Help</span>
          <span className="myspace-nav-separator">|</span>
          <div className="myspace-return-wrap">
            <button
              type="button"
              className="myspace-nav-link myspace-return-link"
              onClick={() => Maps('/')}
            >
              [ Return to 2026 ]
            </button>
          </div>
        </div>
      </div>

      <div className="myspace-page">
        <div className="myspace-profile-container">
          {/* Left Column */}
          <div className="myspace-left-column">
            <div className="myspace-owner-name">{ownerName}</div>
            <div className="myspace-extended-network">
              {ownerName} is in your extended network
            </div>

            <div className="myspace-owner-photo-wrapper">
              <img src={ownerImage} alt={ownerName} className="myspace-owner-photo" />
            </div>

            <div className="myspace-status-box">
              <div className="myspace-status-line">Mood: {mood || 'Artistic'}</div>
              <div className="myspace-online-line">
                <span className="myspace-online-dot">●</span> Online Now
              </div>
            </div>

            <div className="myspace-contact-box">
              <div className="myspace-contact-header">Contacting {ownerName}</div>
              <div className="myspace-contact-grid">
                <a href="#" className="myspace-contact-link">
                  Add to Friends
                </a>
                <a href="#" className="myspace-contact-link">
                  Send Message
                </a>
                <a href="#" className="myspace-contact-link">
                  Add to Favorites
                </a>
                <a href="#" className="myspace-contact-link">
                  Forward to Friend
                </a>
                <a href="#" className="myspace-contact-link">
                  Add to Group
                </a>
                <a href="#" className="myspace-contact-link">
                  Block User
                </a>
                <a href="#" className="myspace-contact-link">
                  Add Comment
                </a>
                <a href="#" className="myspace-contact-link">
                  Instant Message
                </a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="myspace-right-column">
            {/* Music Player (intentionally broken Flash-style embed) */}
            <div className="myspace-player">
              <div className="myspace-player-header">KUHLSHIT.COM RADIO</div>
              <div className="myspace-player-body">
                <div className="myspace-player-broken-icon">🧩</div>
                <div className="myspace-player-broken-text">
                  <div
                    className={
                      BIG3_ERRORS[errorIndex]?.isBuffering
                        ? 'myspace-player-error-text myspace-player-error-buffering'
                        : 'myspace-player-error-text'
                    }
                  >
                    {BIG3_ERRORS[errorIndex]?.text}
                  </div>
                </div>
                <div className="myspace-player-broken-link">
                  <span>Download Macromedia Flash</span>
                </div>
              </div>
            </div>

            {/* Blurbs */}
            <div className="myspace-blurbs">
              <div className="myspace-blurbs-header">{ownerName}’s Blurbs</div>
              <div className="myspace-blurbs-section">
                <div className="myspace-blurbs-title">About Me:</div>
                <p>
                  We are a totally real band who still updates our MySpace page first. We live for
                  late-night sets, burnt CDs, and friends who know every word to the deep cuts. If
                  you&apos;re reading this, you&apos;re already part of the street team.
                </p>
              </div>
              <div className="myspace-blurbs-section">
                <div className="myspace-blurbs-title">Who I&apos;d Like to Meet:</div>
                <p>
                  Anyone who believes music hits different in tiny rooms, on crooked porches, and in
                  the glow of a CRT monitor at 2:07 AM. If you still remember your top 8 by heart,
                  this page is for you.
                </p>
              </div>
            </div>

            {/* Friend Space & Top 8 */}
            <div className="myspace-friend-space">
              <div className="myspace-friend-space-header">{ownerName}’s Friend Space</div>
              <div className="myspace-friend-space-sub">
                {ownerName} has {friendCount.toLocaleString()} friends.
              </div>

              <div className="myspace-top8-header">Top 8</div>
              <div className="myspace-top8-grid">
                {top8Friends.map((friend) => (
                  <button
                    key={friend.id || friend.name}
                    type="button"
                    className="myspace-friend-card"
                    onClick={() => Maps(`/porchfest/artists/${friend.id}`)}
                  >
                    <div className="myspace-friend-photo-wrapper">
                      {friend.thumbnailUrl || friend.imageUrl ? (
                        <img
                          src={friend.thumbnailUrl || friend.imageUrl}
                          alt={friend.name}
                          className="myspace-friend-photo"
                        />
                      ) : (
                        <div className="myspace-friend-photo-placeholder" />
                      )}
                    </div>
                    <div className="myspace-friend-name">{friend.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {!profileOwner && (
              <div className="myspace-fallback">
                No artists loaded. Come back to kuhlshit.com when the scene is ready.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

