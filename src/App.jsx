import { useMemo, useState } from 'react'
import './App.css'

const navItems = [
  ['grid', 'Overview'], ['book', 'My learning'], ['compass', 'Explore'],
  ['calendar', 'Schedule'], ['award', 'Certificates'],
]

const courses = [
  { id: 1, category: 'Leadership', title: 'Leading with empathy', lesson: 'Module 6 of 10', progress: 68, time: '2h 15m left', tone: 'amber', icon: '◎' },
  { id: 2, category: 'Communication', title: 'Powerful conversations', lesson: 'Module 3 of 8', progress: 42, time: '3h 40m left', tone: 'blue', icon: '◌' },
  { id: 3, category: 'Mindfulness', title: 'Mindful productivity', lesson: 'Module 8 of 9', progress: 86, time: '45m left', tone: 'green', icon: '✦' },
]

const recommended = [
  { category: 'PERSONAL GROWTH', title: 'The art of focused work', author: 'Mara Ellis', meta: '8 lessons · 3h 20m', tone: 'sun', art: '◐' },
  { category: 'COMMUNICATION', title: 'Stories that move people', author: 'James Han', meta: '12 lessons · 4h 10m', tone: 'sea', art: '◒' },
  { category: 'WELLBEING', title: 'Build resilient habits', author: 'Nina Patel', meta: '7 lessons · 2h 40m', tone: 'rose', art: '◇' },
]

function Icon({ name, size = 19 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    award: <><circle cx="12" cy="8" r="5"/><path d="M8.7 12 7 21l5-3 5 3-1.7-9"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All topics')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState(false)

  const filtered = useMemo(() => recommended.filter((item) => {
    const matchesQuery = `${item.title} ${item.author} ${item.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'All topics' || item.category.toLowerCase().includes(filter.toLowerCase()))
  }), [query, filter])

  return (
    <div className="app-shell">
      {menuOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <img src="/DHARMA - LOGO (9).png" alt="Dharma" />
          <div><strong>DHARMA</strong><span>Learning Studio</span></div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><Icon name="close" /></button>
        </div>
        <nav>
          <p className="nav-label">LEARNING</p>
          {navItems.map(([icon, label]) => (
            <button key={label} className={active === label ? 'active' : ''} onClick={() => { setActive(label); setMenuOpen(false) }}>
              <Icon name={icon} /><span>{label}</span>{active === label && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button><Icon name="settings" /><span>Settings</span></button>
          <button><Icon name="logout" /><span>Sign out</span></button>
          <div className="help-card"><span>?</span><strong>Need a little help?</strong><small>Visit our learning centre</small><button>Get support</button></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button>
          <div className="mobile-mark"><img src="/DHARMA - LOGO (9).png" alt="" /> DHARMA</div>
          <label className="search"><Icon name="search" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, mentors and topics" /></label>
          <div className="header-actions">
            <button className="bell" onClick={() => setNotice(!notice)} aria-label="Notifications"><Icon name="bell" /><b /></button>
            {notice && <div className="notification"><strong>You’re all caught up</strong><span>No new notifications right now.</span></div>}
            <div className="profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Product Design</span></div><span>⌄</span></div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div><p className="eyebrow">THURSDAY, SEPTEMBER 24</p><h1>Welcome back, Alex <span>✦</span></h1><p>Keep building momentum. You're making wonderful progress.</p></div>
            <button className="outline-button"><Icon name="calendar" /> View schedule</button>
          </section>

          <section className="hero-card">
            <div className="hero-copy"><span className="pill">COURSE OF THE MONTH</span><h2>Build the clarity to<br />lead with purpose.</h2><p>Practical tools for thoughtful leaders who want to create trust, alignment, and lasting impact.</p><button>Explore the course <Icon name="arrow" size={17} /></button></div>
            <div className="hero-art" aria-hidden="true"><div className="orb one"/><div className="orb two"/><div className="arch"><span>✦</span><i /></div><div className="line-art"/></div>
          </section>

          <section className="section-block">
            <div className="section-heading"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Continue learning</h2></div><button>View all <Icon name="arrow" size={16} /></button></div>
            <div className="progress-grid">
              {courses.map(course => <article className="progress-card" key={course.id}>
                <div className={`course-art ${course.tone}`}><span>{course.icon}</span><small>{String(course.id).padStart(2, '0')}</small></div>
                <div className="course-info"><span className="course-category">{course.category}</span><h3>{course.title}</h3><div className="lesson-line"><span>{course.lesson}</span><span><Icon name="clock" size={14}/>{course.time}</span></div><div className="progress-track"><i style={{width: `${course.progress}%`}} /></div><div className="progress-meta"><strong>{course.progress}% complete</strong><button aria-label={`Resume ${course.title}`}><Icon name="play" size={28}/></button></div></div>
              </article>)}
            </div>
          </section>

          <section className="section-block discover">
            <div className="section-heading"><div><p className="eyebrow">CURATED FOR YOUR GOALS</p><h2>Discover something new</h2></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter courses"><option>All topics</option><option>Communication</option><option>Wellbeing</option><option>Personal Growth</option></select></div>
            <div className="recommend-grid">
              {filtered.map(item => <article className="recommend-card" key={item.title}>
                <div className={`recommend-art ${item.tone}`}><span>{item.art}</span><i>DHARMA</i></div>
                <div className="recommend-body"><span>{item.category}</span><h3>{item.title}</h3><p>with {item.author}</p><div><small>{item.meta}</small><button aria-label={`Open ${item.title}`}><Icon name="chevron" size={17}/></button></div></div>
              </article>)}
              {!filtered.length && <div className="empty-state">No courses match “{query}”. Try a different search.</div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
