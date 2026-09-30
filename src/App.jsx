import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { supabase } from "./supabase";
import sopContent from "./data/sops.json";

const paths = {
  service: {
    name: "Customer Service",
    code: "CS",
    icon: "headset",
    tone: "service",
    progress: 0,
    done: 0,
    total: 8,
    next: "Service mindset & standards",
    duration: "35 min",
    description:
      "Build confident, empathetic support skills for every customer conversation.",
    modules: [
      {
        id: 1,
        category: "Foundation",
        title: "Service mindset & standards",
        lesson: "0 of 4 lessons",
        progress: 0,
        time: "35m",
        tone: "green",
        mark: "✓",
      },
      {
        id: 2,
        category: "Core skills",
        title: "Understanding the customer",
        lesson: "0 of 5 lessons",
        progress: 0,
        time: "1h 10m",
        tone: "blue",
        mark: "◉",
      },
      {
        id: 3,
        category: "Practice",
        title: "Handling difficult conversations",
        lesson: "0 of 6 lessons",
        progress: 0,
        time: "1h 20m",
        tone: "amber",
        mark: "◇",
      },
    ],
  },
  sales: {
    name: "Sales",
    code: "SA",
    icon: "trend",
    tone: "sales",
    progress: 0,
    done: 0,
    total: 9,
    next: "Our sales process",
    duration: "40 min",
    description:
      "Learn a repeatable, customer-first process from discovery through close.",
    modules: [
      {
        id: 1,
        category: "Foundation",
        title: "Our sales process",
        lesson: "0 of 4 lessons",
        progress: 0,
        time: "40m",
        tone: "green",
        mark: "✓",
      },
      {
        id: 2,
        category: "Core skills",
        title: "Discovery that earns trust",
        lesson: "0 of 5 lessons",
        progress: 0,
        time: "1h 15m",
        tone: "blue",
        mark: "◎",
      },
      {
        id: 3,
        category: "Practice",
        title: "Presenting value & closing",
        lesson: "0 of 7 lessons",
        progress: 0,
        time: "1h 35m",
        tone: "amber",
        mark: "↗",
      },
    ],
  },
};

const navItems = [
  ["grid", "Overview"],
  ["book", "My learning"],
  ["award", "Certificates"],
];

const driveVideo = (id) => `https://drive.google.com/file/d/${id}/preview`;

const lessonsByRole = {
  customer_service: [
    {
      title: "Welcome to Dharma",
      description:
        "Get introduced to Dharma Nutrition, the team, and the training journey.",
      video: driveVideo("1QA00k44gZNeGzOpVqXHJF168vjBvrBSv"),
    },
    {
      title: "Patient Journey",
      description:
        "Follow the patient experience through every important stage of care.",
      video: driveVideo("1O7QyuXGynZ5KWXZC0H0_JrZ9_GPDs3Yt"),
    },
    {
      title: "Teams and Responsibilities",
      description:
        "Learn how each team contributes and who owns each part of the patient experience.",
      video: driveVideo("1-OLqOM9c4Yl2bqrzkWB1eDGXvMuKsvv_"),
    },
    {
      title: "Products and Services",
      description:
        "Review the products and services offered by Dharma Nutrition.",
      video: driveVideo("1G-xhzuO7uKDts3IdfEUoaSJ5VqfBycjM"),
    },
    {
      title: "Communication Standards",
      description:
        "Learn Dharma standards for professional messaging and calls.",
      video: driveVideo("1nivSMhKlIhYnOMtPds6kLZb3Qh0aZz0b"),
    },
    {
      title: "Dharma Tools",
      description:
        "Get introduced to HubSpot, Aircall, Hubstaff, Respond.io, and the tools used in daily work.",
      video: driveVideo("1SVvJ8T9mIY0g4aL9tEwUpAfIiCbQyg0U"),
    },
    {
      title: "CRM",
      description:
        "Learn the core CRM and HubSpot workflow used by the team.",
      video: driveVideo("1WzLBvZng0WnU7Om3ukzGrIqhumauIAyX"),
    },
    {
      title: "How to Respond",
      description:
        "Learn how to respond to customer conversations clearly and professionally.",
      video: driveVideo("1l-6vxz0-4ey7srn8Ndkqu3MUE_6875uM"),
    },
  ],
  sales: [
    {
      title: "Sales Training Overview",
      description:
        "Start with an overview of Dharma Telehealth sales training.",
      video: driveVideo("1IWIq8aXVx5Ot1-RvLPAL5g423r1LhPx1"),
    },
    {
      title: "Professional Image, Routine, and Tools",
      description:
        "Review the professional standards, routine, and tools expected from the sales team.",
      video: driveVideo("1v-CDAwu0LjWRhLcpoTu6kfkhQ2bUAEec"),
    },
    {
      title: "Respond.io for Client Messaging",
      description: "Learn how to manage client conversations in Respond.io.",
      video: driveVideo("1bIMni-BkZqoGSgRa3413OULIvwizZYWN"),
    },
    {
      title: "HubSpot and Google Calendar",
      description: "Learn the connected HubSpot and Google Calendar workflow.",
      video: driveVideo("1x_KACawbDnz9ergT0TZyEViXSa6spaDE"),
    },
    {
      title: "Registering a Payment in HubSpot",
      description:
        "Learn how to correctly register a client payment in HubSpot.",
      video: driveVideo("16IHl4FisIq5YJ6ACc0vCU2yrQ7A1B1nA"),
    },
    {
      title: "Scheduling Appointments — Part 1",
      description: "Begin the appointment-scheduling workflow.",
      video: driveVideo("1-mmxSdZAQsZIYk6yalovS1HZ_aIpYrgb"),
    },
    {
      title: "Scheduling Appointments — Part 2",
      description: "Continue the appointment-scheduling workflow.",
      video: driveVideo("1_3g84DsHvOtKIEsycpNSglBYnwvnfkZh"),
    },
    {
      title: "Scheduling Appointments — Part 3",
      description: "Complete the appointment-scheduling workflow.",
      video: driveVideo("1q5GIDCU6PDuuDTaDs7afn_EWxI2XhsWJ"),
    },
    {
      title: "Doxy for Video Calls",
      description: "Learn how to use Doxy for client video calls.",
      video: driveVideo("1-f73gbyJ0qGQBawr0C0B1hamJlP4u7X-"),
    },
    {
      title: "Aircall for Client Calls",
      description: "Learn how to use Aircall for client calls.",
      video: driveVideo("1Q5l1l4Mzse48cYuCyCApZp0VrQn8_4CI"),
    },
    {
      title: "Sales Tool — Part 1",
      description: "Begin the guided sales-tool workflow.",
      video: driveVideo("157tRDsexWl-8o-ATstSy7kz9f8_LJrgI"),
    },
    {
      title: "Sales Tool — Part 2",
      description: "Continue the guided sales-tool workflow.",
      video: driveVideo("1qagOIHGpYAk11yHecEa9hVbowttHIj_A"),
    },
    {
      title: "Sales Tool — Part 3",
      description: "Complete the guided sales-tool workflow.",
      video: driveVideo("1b2Uj2dcuG7jEAoJ_bSDeLQAA2_3r2chu"),
    },
    {
      title: "Pricing Plans and Dosage — Part 1",
      description:
        "Review the first section of pricing plans and dosage guidance.",
      video: driveVideo("1EBkubmqUJs2oOMaFwJ26N6qi6wUfCHSe"),
    },
    {
      title: "Pricing Plans and Dosage — Part 2",
      description: "Complete the pricing plans and dosage guidance.",
      video: driveVideo("1cBEfcDo10ey9ulxN0Cn0Khzp5M5JNzrY"),
    },
  ],
};

const courseModulesFor = (role) =>
  role === "sales"
    ? [
        {
          id: "module-1",
          category: "Sales Foundations",
          title: "Module 1",
          lessons: lessonsByRole.sales.slice(0, 2),
        },
        {
          id: "module-2",
          category: "Client Messaging & Scheduling",
          title: "Module 2",
          lessons: lessonsByRole.sales.slice(2, 8),
        },
        {
          id: "module-3",
          category: "Calls & Sales Tools",
          title: "Module 3",
          lessons: lessonsByRole.sales.slice(8, 13),
        },
        {
          id: "module-4",
          category: "Pricing & Dosage",
          title: "Module 4",
          lessons: lessonsByRole.sales.slice(13, 15),
        },
      ]
    : [
        {
          id: "module-1",
          category: "Dharma Foundations",
          title: "Module 1",
          lessons: lessonsByRole.customer_service.slice(0, 6),
        },
        {
          id: "module-2",
          category: "Customer Service Tools",
          title: "Module 2",
          lessons: lessonsByRole.customer_service.slice(6, 8),
        },
      ];

const moduleStorageKey = (learnerId, moduleId) =>
  `dharma_${moduleId.replace("-", "_")}_${learnerId}`;

const lessonsFor = (role) =>
  role === "sales" ? lessonsByRole.sales : lessonsByRole.customer_service;

function Icon({ name, size = 19 }) {
  const p = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.7 12 7 21l5-3 5 3-1.7-9" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 6 4-6 4V8Z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2v-3ZM20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2v-3ZM17 19c-1 2-2.5 2-5 2" />
      </>
    ),
    trend: (
      <>
        <path d="M3 17l6-6 4 4 7-8" />
        <path d="M14 7h6v6" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p[name]}
    </svg>
  );
}

function MyLearning({ learner, path, onContinue }) {
  const [progress, setProgress] = useState([]),
    [loading, setLoading] = useState(true);
  const moduleOneLessons = lessonsFor(learner.role);
  useEffect(() => {
    supabase
      .rpc("learner_progress_for", { p_learner_id: learner.id })
      .then(({ data }) => {
        setProgress(data || []);
        setLoading(false);
      });
  }, [learner.id]);
  const localVideos = Math.min(
    Number(localStorage.getItem(`dharma_module_1_${learner.id}`) || 0),
    moduleOneLessons.length,
  );
  const localSop =
    localStorage.getItem(`dharma_module_1_${learner.id}_sop`) === "complete";
  const savedModule = progress.find((item) => item.module_key === "module-1"),
    savedSop = progress.find((item) => item.module_key === "sop");
  const moduleProgress = Math.max(
    savedModule?.progress || 0,
    Math.round((localVideos / moduleOneLessons.length) * 100),
  );
  const completedVideos = Math.max(
    localVideos,
    Math.min(
      moduleOneLessons.length,
      Math.round((moduleProgress / 100) * moduleOneLessons.length),
    ),
  );
  const sopProgress = Math.max(savedSop?.progress || 0, localSop ? 100 : 0);
  const completed =
    (moduleProgress === 100 ? 1 : 0) + (sopProgress === 100 ? 1 : 0);
  const overall = Math.round((moduleProgress + sopProgress) / 2);
  const nextLesson =
    moduleProgress < 100
      ? moduleOneLessons[Math.min(completedVideos, moduleOneLessons.length - 1)]
          .title
      : sopProgress < 100
        ? `${path.name} SOP`
        : "Course completed";
  const modules = [
    {
      id: "module-1",
      category: "Dharma Foundations",
      title: "Module 1",
      detail:
        moduleProgress === 100
          ? `All ${moduleOneLessons.length} lessons completed`
          : `${completedVideos} of ${moduleOneLessons.length} lessons completed`,
      value: moduleProgress,
      updatedAt: savedModule?.updated_at,
    },
    {
      id: "sop",
      category: "Standard Operating Procedure",
      title: `${path.name} SOP`,
      detail:
        sopProgress === 100
          ? "Reviewed and completed"
          : moduleProgress < 100
            ? "Locked until Module 1 is complete"
            : "Ready to review",
      value: sopProgress,
      updatedAt: savedSop?.updated_at,
      locked: moduleProgress < 100,
    },
  ];
  return (
    <div className="content my-learning">
      <section className="learning-title">
        <p className="eyebrow">{path.name.toUpperCase()} PATH</p>
        <h1>My learning</h1>
        <p>Track your modules and continue from your current lesson.</p>
      </section>
      <section className="learning-summary">
        <div>
          <span>OVERALL PROGRESS</span>
          <strong>{loading && overall === 0 ? "—" : `${overall}%`}</strong>
          <i>
            <b style={{ width: `${overall}%` }} />
          </i>
        </div>
        <div>
          <span>MODULES COMPLETED</span>
          <strong>{completed} of 2</strong>
          <small>
            {completed === 2
              ? "Course complete"
              : completed
                ? "Keep up the momentum"
                : "Your progress starts here"}
          </small>
        </div>
        <div>
          <span>CURRENT LESSON</span>
          <strong>{nextLesson}</strong>
          <small>
            {moduleProgress < 100
              ? "Module 1"
              : sopProgress < 100
                ? "SOP"
                : "All requirements finished"}
          </small>
        </div>
      </section>
      <section className="learning-modules">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR COURSE</p>
            <h2>Module progress</h2>
          </div>
        </div>
        {modules.map((module, index) => (
          <article
            key={module.id}
            className={module.locked ? "learning-locked" : ""}
          >
            <span className="module-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="module-copy">
              <small>{module.category}</small>
              <strong>{module.title}</strong>
              <span>{module.detail}</span>
            </div>
            <div className="module-progress">
              <span>{module.value}%</span>
              <i>
                <b style={{ width: `${module.value}%` }} />
              </i>
              <small>
                {module.updatedAt
                  ? `Updated ${new Date(module.updatedAt).toLocaleDateString()}`
                  : "No activity yet"}
              </small>
            </div>
            <button disabled={module.locked} onClick={onContinue}>
              {module.locked ? "Locked" : module.value ? "Continue" : "Start"}{" "}
              {!module.locked && <Icon name="arrow" size={15} />}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

function SopReader({ role }) {
  const document = sopContent[role];
  const [page, setPage] = useState(1),
    [search, setSearch] = useState("");
  const matches = useMemo(
    () =>
      search.trim()
        ? document.pages.filter((item) =>
            item.text.toLowerCase().includes(search.toLowerCase()),
          )
        : [],
    [document, search],
  );
  const current = document.pages[page - 1];
  const lines = current.text.split("\n").filter(Boolean);
  return (
    <div className="sop-reader">
      <aside>
        <div className="sop-reader-brand">
          <span>DHARMA</span>
          <strong>{document.title}</strong>
          <small>{document.pages.length} pages</small>
        </div>
        <label>
          <Icon name="search" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this SOP"
          />
        </label>
        <div className="sop-page-list">
          {(search ? matches : document.pages).map((item) => {
            const title =
              item.text.split("\n").find((line) => line.trim()) ||
              `Page ${item.number}`;
            return (
              <button
                key={item.number}
                className={page === item.number ? "active" : ""}
                onClick={() => {
                  setPage(item.number);
                  setSearch("");
                }}
              >
                <span>{String(item.number).padStart(3, "0")}</span>
                <strong>{title.slice(0, 65)}</strong>
              </button>
            );
          })}
          {search && !matches.length && <p>No matching pages found.</p>}
        </div>
      </aside>
      <article>
        <header>
          <div>
            <p>STANDARD OPERATING PROCEDURE</p>
            <h2>{document.title}</h2>
          </div>
          <span>
            Page {page} of {document.pages.length}
          </span>
        </header>
        <div className="sop-document">
          {lines.map((line, index) => {
            const trimmed = line.trim();
            const heading =
              /^(STANDARD OPERATING|DEPARTMENT:|\d+\.\s|[A-Z][A-Z\s&()/>-]{5,}:?$)/.test(
                trimmed,
              );
            const bullet = /^[●○•]/.test(trimmed);
            return heading ? (
              <h3 key={index}>{trimmed}</h3>
            ) : bullet ? (
              <p className="sop-bullet" key={index}>
                {trimmed}
              </p>
            ) : (
              <p key={index}>{trimmed}</p>
            );
          })}
          {!lines.length && (
            <div className="visual-reference">
              <Icon name="book" size={28} />
              <strong>Visual reference page</strong>
              <p>
                Open the original PDF to view the screenshot or diagram on this
                page.
              </p>
            </div>
          )}
        </div>
        <footer>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Previous
          </button>
          <a href={document.source} target="_blank" rel="noreferrer">
            Original PDF
          </a>
          <button
            disabled={page === document.pages.length}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </footer>
      </article>
    </div>
  );
}

function ModuleOne({ learner }) {
  const moduleOneLessons = lessonsFor(learner.role);
  const storageKey = `dharma_module_1_${learner.id}`;
  const [completed, setCompleted] = useState(() =>
    Math.min(
      Number(localStorage.getItem(storageKey) || 0),
      moduleOneLessons.length,
    ),
  );
  const [selected, setSelected] = useState(() =>
    Math.min(
      Number(localStorage.getItem(storageKey) || 0),
      moduleOneLessons.length - 1,
    ),
  );
  const [moduleOpen, setModuleOpen] = useState(true),
    [sopOpen, setSopOpen] = useState(false);
  const [sopCompleted, setSopCompleted] = useState(
    () => localStorage.getItem(`${storageKey}_sop`) === "complete",
  );
  const lesson = moduleOneLessons[selected];
  const moduleComplete = completed === moduleOneLessons.length;
  const sopName =
    learner.role === "sales" ? "Sales Team SOP" : "Customer Service SOP";
  async function finishLesson() {
    const finished = Math.max(completed, selected + 1);
    setCompleted(finished);
    localStorage.setItem(storageKey, String(finished));
    const nextIndex = Math.min(finished, moduleOneLessons.length - 1);
    const nextTitle =
      finished === moduleOneLessons.length
        ? "Module complete"
        : moduleOneLessons[nextIndex].title;
    await supabase.rpc("save_learner_progress", {
      p_learner_id: learner.id,
      p_module_key: "module-1",
      p_module_title: "Dharma Foundations",
      p_lesson_title: nextTitle,
      p_progress: Math.round((finished / moduleOneLessons.length) * 100),
    });
    if (finished < moduleOneLessons.length) setSelected(nextIndex);
  }
  async function completeSop() {
    const { error } = await supabase.rpc("save_learner_progress", {
      p_learner_id: learner.id,
      p_module_key: "sop",
      p_module_title: sopName,
      p_lesson_title: "SOP reviewed",
      p_progress: 100,
    });
    if (!error) {
      localStorage.setItem(`${storageKey}_sop`, "complete");
      setSopCompleted(true);
    }
  }
  return (
    <section className="section-block training-accordions">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR TRAINING</p>
          <h2>Course modules</h2>
        </div>
      </div>
      <article className="training-accordion">
        <button
          className="accordion-head"
          onClick={() => setModuleOpen(!moduleOpen)}
          aria-expanded={moduleOpen}
        >
          <span className="module-number">01</span>
          <span>
            <small>DHARMA FOUNDATIONS</small>
            <strong>Module 1</strong>
            <em>Complete each video in order.</em>
          </span>
          <span className="lesson-count">
            {completed}/{moduleOneLessons.length} complete
          </span>
          <b>{moduleOpen ? "−" : "+"}</b>
        </button>
        {moduleOpen && (
          <div className="accordion-body lesson-layout">
            <div className="video-panel">
              <div className="video-frame">
                <iframe
                  key={lesson.video}
                  src={lesson.video}
                  title={lesson.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="video-copy">
                <span>
                  LESSON {selected + 1} OF {moduleOneLessons.length}
                </span>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <button
                  className="lesson-complete"
                  onClick={finishLesson}
                  disabled={selected < completed}
                >
                  {selected < completed
                    ? "Lesson completed"
                    : selected === moduleOneLessons.length - 1
                      ? "Complete lesson"
                      : "Complete and continue"}
                </button>
              </div>
            </div>
            <div className="lesson-list">
              {moduleOneLessons.map((item, index) => {
                const locked = index > completed;
                const done = index < completed;
                return (
                  <button
                    key={item.title}
                    disabled={locked}
                    className={`${selected === index ? "current" : ""} ${locked ? "lesson-locked" : ""}`}
                    onClick={() => setSelected(index)}
                  >
                    <span>
                      {done
                        ? "✓"
                        : locked
                          ? "×"
                          : String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {done
                          ? "Completed"
                          : locked
                            ? "Finish the previous lesson to unlock"
                            : selected === index
                              ? "Now playing"
                              : "Ready to start"}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </article>
      <article
        className={`training-accordion sop-accordion ${moduleComplete ? "" : "locked-module"}`}
      >
        <button
          className="accordion-head"
          disabled={!moduleComplete}
          onClick={() => setSopOpen(!sopOpen)}
          aria-expanded={sopOpen}
          data-tooltip={
            !moduleComplete
              ? "Finish all Module 1 videos to unlock SOP"
              : undefined
          }
        >
          <span className="module-number">02</span>
          <span>
            <small>STANDARD OPERATING PROCEDURE</small>
            <strong>SOP</strong>
            <em>
              {moduleComplete
                ? sopName
                : "Complete Module 1 to unlock this module."}
            </em>
          </span>
          <span className="module-status">
            {sopCompleted
              ? "Completed"
              : moduleComplete
                ? "Available"
                : "Locked"}
          </span>
          <b>{moduleComplete ? (sopOpen ? "−" : "+") : "×"}</b>
        </button>
        {moduleComplete && sopOpen && (
          <div className="accordion-body sop-body">
            <SopReader role={learner.role} />
            <button
              className="sop-complete"
              onClick={completeSop}
              disabled={sopCompleted}
            >
              {sopCompleted ? "SOP completed" : "Mark SOP as reviewed"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

function SalesLearning({ learner, path, onContinue }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const courseModules = courseModulesFor("sales");
  useEffect(() => {
    supabase
      .rpc("learner_progress_for", { p_learner_id: learner.id })
      .then(({ data }) => {
        setProgress(data || []);
        setLoading(false);
      });
  }, [learner.id]);

  const moduleStats = courseModules.map((module) => {
    const localCompleted = Math.min(
      Number(
        localStorage.getItem(moduleStorageKey(learner.id, module.id)) || 0,
      ),
      module.lessons.length,
    );
    const saved = progress.find((item) => item.module_key === module.id);
    const value = Math.max(
      saved?.progress || 0,
      Math.round((localCompleted / module.lessons.length) * 100),
    );
    const completedLessons = Math.max(
      localCompleted,
      Math.min(
        module.lessons.length,
        Math.round((value / 100) * module.lessons.length),
      ),
    );
    return { ...module, value, completedLessons, updatedAt: saved?.updated_at };
  });
  const savedSop = progress.find((item) => item.module_key === "sop");
  const localSop =
    localStorage.getItem(`dharma_module_1_${learner.id}_sop`) === "complete";
  const sopProgress = Math.max(savedSop?.progress || 0, localSop ? 100 : 0);
  const allVideosComplete = moduleStats.every((module) => module.value === 100);
  const completedCount =
    moduleStats.filter((module) => module.value === 100).length +
    (sopProgress === 100 ? 1 : 0);
  const totalCount = moduleStats.length + 1;
  const overall = Math.round(
    (moduleStats.reduce((sum, module) => sum + module.value, 0) + sopProgress) /
      totalCount,
  );
  const current = moduleStats.find((module) => module.value < 100);
  const nextLesson = current
    ? current.lessons[
        Math.min(current.completedLessons, current.lessons.length - 1)
      ].title
    : sopProgress < 100
      ? `${path.name} SOP`
      : "Course completed";
  const cards = [
    ...moduleStats.map((module, index) => ({
      ...module,
      detail:
        module.value === 100
          ? `All ${module.lessons.length} lessons completed`
          : `${module.completedLessons} of ${module.lessons.length} lessons completed`,
      locked: index > 0 && moduleStats[index - 1].value < 100,
    })),
    {
      id: "sop",
      category: "Standard Operating Procedure",
      title: `${path.name} SOP`,
      detail:
        sopProgress === 100
          ? "Reviewed and completed"
          : allVideosComplete
            ? "Ready to review"
            : "Locked until all video modules are complete",
      value: sopProgress,
      updatedAt: savedSop?.updated_at,
      locked: !allVideosComplete,
    },
  ];

  return (
    <div className="content my-learning">
      <section className="learning-title">
        <p className="eyebrow">{path.name.toUpperCase()} PATH</p>
        <h1>My learning</h1>
        <p>Track your modules and continue from your current lesson.</p>
      </section>
      <section className="learning-summary">
        <div>
          <span>OVERALL PROGRESS</span>
          <strong>{loading && overall === 0 ? "—" : `${overall}%`}</strong>
          <i>
            <b style={{ width: `${overall}%` }} />
          </i>
        </div>
        <div>
          <span>MODULES COMPLETED</span>
          <strong>
            {completedCount} of {totalCount}
          </strong>
          <small>
            {completedCount === totalCount
              ? "Course complete"
              : completedCount
                ? "Keep up the momentum"
                : "Your progress starts here"}
          </small>
        </div>
        <div>
          <span>CURRENT LESSON</span>
          <strong>{nextLesson}</strong>
          <small>
            {current
              ? current.title
              : sopProgress < 100
                ? "SOP"
                : "All requirements finished"}
          </small>
        </div>
      </section>
      <section className="learning-modules">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR COURSE</p>
            <h2>Module progress</h2>
          </div>
        </div>
        {cards.map((module, index) => (
          <article
            key={module.id}
            className={module.locked ? "learning-locked" : ""}
          >
            <span className="module-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="module-copy">
              <small>{module.category}</small>
              <strong>{module.title}</strong>
              <span>{module.detail}</span>
            </div>
            <div className="module-progress">
              <span>{module.value}%</span>
              <i>
                <b style={{ width: `${module.value}%` }} />
              </i>
              <small>
                {module.updatedAt
                  ? `Updated ${new Date(module.updatedAt).toLocaleDateString()}`
                  : "No activity yet"}
              </small>
            </div>
            <button disabled={module.locked} onClick={onContinue}>
              {module.locked ? "Locked" : module.value ? "Continue" : "Start"}{" "}
              {!module.locked && <Icon name="arrow" size={15} />}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

function SalesModules({ learner }) {
  const courseModules = courseModulesFor("sales");
  const [completed, setCompleted] = useState(() =>
    Object.fromEntries(
      courseModules.map((module) => [
        module.id,
        Math.min(
          Number(
            localStorage.getItem(moduleStorageKey(learner.id, module.id)) || 0,
          ),
          module.lessons.length,
        ),
      ]),
    ),
  );
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(
      courseModules.map((module) => [
        module.id,
        Math.min(
          Number(
            localStorage.getItem(moduleStorageKey(learner.id, module.id)) || 0,
          ),
          module.lessons.length - 1,
        ),
      ]),
    ),
  );
  const [openModule, setOpenModule] = useState("module-1");
  const [sopOpen, setSopOpen] = useState(false);
  const sopStorageKey = `dharma_module_1_${learner.id}_sop`;
  const [sopCompleted, setSopCompleted] = useState(
    () => localStorage.getItem(sopStorageKey) === "complete",
  );
  const allModulesComplete = courseModules.every(
    (module) => completed[module.id] === module.lessons.length,
  );

  async function finishLesson(module, index) {
    const finished = Math.max(completed[module.id], index + 1);
    setCompleted((current) => ({ ...current, [module.id]: finished }));
    localStorage.setItem(
      moduleStorageKey(learner.id, module.id),
      String(finished),
    );
    const nextIndex = Math.min(finished, module.lessons.length - 1);
    await supabase.rpc("save_learner_progress", {
      p_learner_id: learner.id,
      p_module_key: module.id,
      p_module_title: module.title,
      p_lesson_title:
        finished === module.lessons.length
          ? "Module complete"
          : module.lessons[nextIndex].title,
      p_progress: Math.round((finished / module.lessons.length) * 100),
    });
    if (finished < module.lessons.length) {
      setSelected((current) => ({ ...current, [module.id]: nextIndex }));
    } else {
      const moduleIndex = courseModules.findIndex(
        (item) => item.id === module.id,
      );
      if (moduleIndex < courseModules.length - 1)
        setOpenModule(courseModules[moduleIndex + 1].id);
    }
  }

  async function completeSop() {
    const { error } = await supabase.rpc("save_learner_progress", {
      p_learner_id: learner.id,
      p_module_key: "sop",
      p_module_title: "Sales Team SOP",
      p_lesson_title: "SOP reviewed",
      p_progress: 100,
    });
    if (!error) {
      localStorage.setItem(sopStorageKey, "complete");
      setSopCompleted(true);
    }
  }

  return (
    <section className="section-block training-accordions">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR TRAINING</p>
          <h2>Course modules</h2>
        </div>
      </div>
      {courseModules.map((module, moduleIndex) => {
        const previous = courseModules[moduleIndex - 1];
        const moduleLocked =
          moduleIndex > 0 && completed[previous.id] < previous.lessons.length;
        const isOpen = openModule === module.id && !moduleLocked;
        const selectedIndex = selected[module.id];
        const lesson = module.lessons[selectedIndex];
        return (
          <article
            key={module.id}
            className={`training-accordion ${moduleLocked ? "locked-module" : ""}`}
          >
            <button
              className="accordion-head"
              disabled={moduleLocked}
              onClick={() => setOpenModule(isOpen ? "" : module.id)}
              aria-expanded={isOpen}
              data-tooltip={
                moduleLocked
                  ? "Finish the previous module to unlock"
                  : undefined
              }
            >
              <span className="module-number">
                {String(moduleIndex + 1).padStart(2, "0")}
              </span>
              <span>
                <small>{module.category.toUpperCase()}</small>
                <strong>{module.title}</strong>
                <em>
                  {moduleLocked
                    ? "Complete the previous module first."
                    : "Complete each video in order."}
                </em>
              </span>
              <span className="lesson-count">
                {completed[module.id]}/{module.lessons.length} complete
              </span>
              <b>{moduleLocked ? "×" : isOpen ? "−" : "+"}</b>
            </button>
            {isOpen && (
              <div className="accordion-body lesson-layout">
                <div className="video-panel">
                  <div className="video-frame">
                    <iframe
                      key={lesson.video}
                      src={lesson.video}
                      title={lesson.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  </div>
                  <div className="video-copy">
                    <span>
                      LESSON {selectedIndex + 1} OF {module.lessons.length}
                    </span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                    <button
                      className="lesson-complete"
                      onClick={() => finishLesson(module, selectedIndex)}
                      disabled={selectedIndex < completed[module.id]}
                    >
                      {selectedIndex < completed[module.id]
                        ? "Lesson completed"
                        : selectedIndex === module.lessons.length - 1
                          ? "Complete module"
                          : "Complete and continue"}
                    </button>
                  </div>
                </div>
                <div className="lesson-list">
                  {module.lessons.map((item, index) => {
                    const locked = index > completed[module.id];
                    const done = index < completed[module.id];
                    return (
                      <button
                        key={item.title}
                        disabled={locked}
                        className={`${selectedIndex === index ? "current" : ""} ${locked ? "lesson-locked" : ""}`}
                        onClick={() =>
                          setSelected((current) => ({
                            ...current,
                            [module.id]: index,
                          }))
                        }
                      >
                        <span>
                          {done
                            ? "✓"
                            : locked
                              ? "×"
                              : String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {done
                              ? "Completed"
                              : locked
                                ? "Finish the previous lesson to unlock"
                                : selectedIndex === index
                                  ? "Now playing"
                                  : "Ready to start"}
                          </small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        );
      })}
      <article
        className={`training-accordion sop-accordion ${allModulesComplete ? "" : "locked-module"}`}
      >
        <button
          className="accordion-head"
          disabled={!allModulesComplete}
          onClick={() => setSopOpen(!sopOpen)}
          aria-expanded={sopOpen}
          data-tooltip={
            !allModulesComplete
              ? "Finish all four video modules to unlock SOP"
              : undefined
          }
        >
          <span className="module-number">05</span>
          <span>
            <small>STANDARD OPERATING PROCEDURE</small>
            <strong>SOP</strong>
            <em>
              {allModulesComplete
                ? "Sales Team SOP"
                : "Complete all four video modules to unlock this module."}
            </em>
          </span>
          <span className="module-status">
            {sopCompleted
              ? "Completed"
              : allModulesComplete
                ? "Available"
                : "Locked"}
          </span>
          <b>{allModulesComplete ? (sopOpen ? "−" : "+") : "×"}</b>
        </button>
        {allModulesComplete && sopOpen && (
          <div className="accordion-body sop-body">
            <SopReader role={learner.role} />
            <button
              className="sop-complete"
              onClick={completeSop}
              disabled={sopCompleted}
            >
              {sopCompleted ? "SOP completed" : "Mark SOP as reviewed"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

function Certificates({ learner }) {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .rpc("certificates_for", { p_learner_id: learner.id })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [learner.id]);
  return (
    <div className="content certificates-page">
      <p className="eyebrow">ACHIEVEMENTS</p>
      <h1>Certificates</h1>
      <p>
        Certificates are issued by an administrator after you complete the
        entire course.
      </p>
      {!loading && !items.length ? (
        <section className="no-certificates">
          <span>
            <Icon name="award" size={28} />
          </span>
          <h2>No certificates yet</h2>
          <p>
            Finish Module 1 and your SOP. An administrator can then review your
            progress and issue your certificate.
          </p>
        </section>
      ) : (
        <div className="certificate-grid">
          {items.map((item) => (
            <article key={item.id}>
              <Icon name="award" size={30} />
              <span>COURSE CERTIFICATE</span>
              <h2>{item.course_title}</h2>
              <p>
                Awarded to <strong>{learner.username}</strong>
              </p>
              <small>
                Issued {new Date(item.issued_at).toLocaleDateString()} ·{" "}
                {item.certificate_code}
              </small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard({ navigate, learner }) {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false),
    [notice, setNotice] = useState(false);
  const team = learner?.role === "sales" ? "sales" : "service";
  const path = paths[team];
  const displayName = learner?.username || "Learner";
  const initials = displayName.slice(0, 2).toUpperCase();
  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <img src="/DHARMA - LOGO (9).png" alt="Dharma" />
          <div>
            <strong>DHARMA</strong>
            <span>Learning Studio</span>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          <p className="nav-label">LEARNING</p>
          {navItems.map(([icon, label]) => (
            <button
              key={label}
              className={active === label ? "active" : ""}
              onClick={() => {
                setActive(label);
                setMenuOpen(false);
              }}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {active === label && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            onClick={() => {
              localStorage.removeItem("dharma_portal_session");
              navigate("/signin");
            }}
          >
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="mobile-mark">
            <img src="/DHARMA - LOGO (9).png" alt="" />
            DHARMA
          </div>
          <a
            className="teams-help"
            href="https://teams.microsoft.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span>?</span>
            <span>
              <small>NEED HELP?</small>
              <strong>Contact Vinci through Teams</strong>
            </span>
          </a>
          <div className="header-actions">
            <button className="bell" onClick={() => setNotice(!notice)}>
              <Icon name="bell" />
              <b />
            </button>
            {notice && (
              <div className="notification">
                <strong>You’re all caught up</strong>
                <span>No new notifications right now.</span>
              </div>
            )}
            <div className="profile">
              <div className="avatar">{initials}</div>
              <div>
                <strong>{displayName}</strong>
                <span>{path.name} Team</span>
              </div>
            </div>
          </div>
        </header>
        {active === "My learning" ? (
          learner.role === "sales" ? (
            <SalesLearning
              learner={learner}
              path={path}
              onContinue={() => setActive("Overview")}
            />
          ) : (
            <MyLearning
              learner={learner}
              path={path}
              onContinue={() => setActive("Overview")}
            />
          )
        ) : active === "Certificates" ? (
          <Certificates learner={learner} />
        ) : (
          <div className="content">
            <section className="welcome-row">
              <div>
                <p className="eyebrow">YOUR TRAINING HOME</p>
                <h1>
                  Welcome back, {displayName} <span>✦</span>
                </h1>
                <p>Your {path.name} learning path is ready.</p>
              </div>
            </section>
            <section className="role-paths">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CHOOSE YOUR ASSIGNED ROLE</p>
                  <h2>Training paths</h2>
                  <p className="role-guidance">
                    Select your role to continue. Access is based on the role
                    assigned by your administrator.
                  </p>
                </div>
              </div>
              <div className="role-path-grid">
                {Object.entries(paths).map(([key, item]) => {
                  const allowed = key === team;
                  return (
                    <button
                      key={key}
                      className={`role-path-card ${allowed ? "allowed" : "locked"}`}
                      disabled={!allowed}
                      aria-disabled={!allowed}
                      data-tooltip={
                        !allowed
                          ? `Only the ${item.name} team can enter here`
                          : undefined
                      }
                      onClick={() =>
                        allowed &&
                        document
                          .getElementById("current-path")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <span className="role-path-icon">
                        <Icon name={item.icon} size={24} />
                      </span>
                      <span className="role-path-details">
                        <small>{item.code} LEARNING PATH</small>
                        <strong>{item.name}</strong>
                        <span>
                          {allowed
                            ? "Your assigned path — click to continue"
                            : `Only ${item.name} learners can access this path`}
                        </span>
                      </span>
                      <span className="role-path-status">
                        {allowed ? "Open" : "Locked"}
                      </span>
                      {allowed && <Icon name="chevron" size={18} />}
                    </button>
                  );
                })}
              </div>
            </section>
            <section className="hero-card simple-hero" id="current-path">
              <div className="hero-copy">
                <span className="pill">{path.name.toUpperCase()} PATH</span>
                <h2>
                  Your next step:
                  <br />
                  {path.next}
                </h2>
                <p>
                  {path.description} Your next lesson takes about{" "}
                  {path.duration}.
                </p>
                <button>
                  Continue training <Icon name="arrow" size={17} />
                </button>
              </div>
            </section>
            {learner.role === "sales" ? (
              <SalesModules learner={learner} />
            ) : (
              <ModuleOne learner={learner} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function PortalChoice({ navigate }) {
  return (
    <main className="portal-choice">
      <div className="choice-brand">
        <img src="/DHARMA - LOGO (9).png" alt="Dharma" />
        <strong>DHARMA</strong>
        <span>Learning Studio</span>
      </div>
      <section>
        <p className="eyebrow">WELCOME TO DHARMA</p>
        <h1>
          Where would you
          <br />
          like to sign in?
        </h1>
        <p>Choose the portal that matches your role.</p>
        <div className="choice-grid">
          <button onClick={() => navigate("/signin")}>
            <span>
              <Icon name="book" size={25} />
            </span>
            <strong>Learner portal</strong>
            <small>
              Continue training, track modules, and view certificates.
            </small>
            <i>
              Sign in <Icon name="arrow" size={16} />
            </i>
          </button>
          <button onClick={() => navigate("/admin/signin")}>
            <span>
              <Icon name="settings" size={25} />
            </span>
            <strong>Admin portal</strong>
            <small>
              Manage learners, teams, courses, and training progress.
            </small>
            <i>
              Admin sign in <Icon name="arrow" size={16} />
            </i>
          </button>
        </div>
      </section>
      <small className="choice-footer">© 2026 Dharma Learning Studio</small>
    </main>
  );
}

function SignIn({ navigate, admin = false }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(
        `Enter your ${admin ? "email" : "username"} and password to continue.`,
      );
      return;
    }
    setError("");
    setLoading(true);
    if (!admin) {
      const { data, error: loginError } = await supabase.rpc("learner_login", {
        p_username: email,
        p_password: password,
      });
      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }
      if (!data?.length) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }
      localStorage.setItem(
        "dharma_portal_session",
        JSON.stringify({
          user: data[0],
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        }),
      );
      navigate("/dashboard");
      return;
    }
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError("The email or password is incorrect.");
      setLoading(false);
      return;
    }
    if (
      data.user?.email?.toLowerCase() !==
      import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
    ) {
      await supabase.auth.signOut();
      setError("This account does not have administrator access.");
      setLoading(false);
      return;
    }
    navigate("/admin");
  }
  return (
    <main className="signin-page">
      <section className="signin-panel">
        <div className="signin-brand">
          <img src="/DHARMA - LOGO (9).png" alt="Dharma" />
          <div>
            <strong>DHARMA</strong>
            <span>Learning Studio</span>
          </div>
        </div>
        <button className="back-link" onClick={() => navigate("/")}>
          <span>←</span> All portals
        </button>
        <div className="signin-content">
          <p className="eyebrow">
            {admin ? "ADMINISTRATOR ACCESS" : "LEARNER ACCESS"}
          </p>
          <h1>
            {admin
              ? "Manage your training\nworkspace."
              : "Sign in to continue\nyour learning."
                  .split("\n")
                  .map((x, i) => (
                    <span key={x}>
                      {x}
                      {i === 0 && <br />}
                    </span>
                  ))}
          </h1>
          <p className="signin-intro">
            {admin
              ? "Secure access for authorized Dharma administrators only."
              : "Access your team path, continue your modules, and keep your progress moving forward."}
          </p>
          <form onSubmit={submit} noValidate>
            <label>
              {admin ? "Work email" : "Username"}
              <input
                type={admin ? "email" : "text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={admin ? "admin@dharma.com" : "Enter your username"}
                autoComplete={admin ? "email" : "username"}
              />
            </label>
            <label>
              Password
              <span className="password-field">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <div className="form-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button">Forgot password?</button>
            </div>
            {error && (
              <p className="signin-error" role="alert">
                {error}
              </p>
            )}
            <button className="signin-submit" type="submit" disabled={loading}>
              {loading ? "Verifying…" : admin ? "Sign in securely" : "Sign in"}{" "}
              {!loading && <Icon name="arrow" size={17} />}
            </button>
          </form>
          <p className="signin-help">
            Having trouble signing in? <button>Contact support</button>
          </p>
        </div>
        <p className="signin-footer">© 2026 Dharma Learning Studio</p>
      </section>
      <section className={`signin-visual ${admin ? "admin-visual" : ""}`}>
        <div className="visual-copy">
          <span>{admin ? "SECURE ADMINISTRATION" : "LEARN WITH PURPOSE"}</span>
          <h2>
            {admin ? (
              <>
                Lead the learning.
                <br />
                See the impact.
              </>
            ) : (
              <>
                Two teams.
                <br />
                One standard
                <br />
                of excellence.
              </>
            )}
          </h2>
          <p>
            {admin
              ? "Manage people, learning paths, and performance from one workspace."
              : "Clear learning paths designed for Customer Service and Sales."}
          </p>
        </div>
        <div className="visual-orb visual-orb-one" />
        <div className="visual-orb visual-orb-two" />
        <div className="visual-arch">
          <i>✦</i>
        </div>
        <div className="visual-lines" />
      </section>
    </main>
  );
}

function UserManagement() {
  const empty = { username: "", password: "", role: "customer_service" };
  const [form, setForm] = useState(empty),
    [users, setUsers] = useState([]),
    [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    supabase
      .from("learners")
      .select(
        "id,username,role,active,created_at,learner_progress(module_key,module_title,progress,completed,updated_at),certificates(id,certificate_code,issued_at)",
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setUsers(data || []);
      });
  }, []);
  async function createUser(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const { data, error } = await supabase.rpc("admin_create_learner", {
      p_username: form.username,
      p_password: form.password,
      p_role: form.role,
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    const learner = Array.isArray(data) ? data[0] : data;
    setUsers((current) => [{ ...learner, learner_progress: [] }, ...current]);
    setForm(empty);
    setOpen(false);
    setBusy(false);
  }
  async function issueCertificate(id) {
    setMessage("");
    const { data, error } = await supabase.rpc("issue_certificate", {
      p_learner_id: id,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    const certificate = Array.isArray(data) ? data[0] : data;
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, certificates: [certificate] } : user,
      ),
    );
  }
  return (
    <section className="users-panel">
      <div className="users-heading">
        <div>
          <p className="eyebrow">ACCOUNT MANAGEMENT</p>
          <h2>Portal users</h2>
          <p>Create learner accounts and assign their training role.</p>
        </div>
        <button
          onClick={() => {
            setOpen(true);
            setMessage("");
          }}
        >
          + Create user
        </button>
      </div>
      {message && (
        <p className="signin-error" role="alert">
          {message}
        </p>
      )}
      <div className="users-list">
        <div className="users-row users-labels">
          <span>Learner</span>
          <span>Team</span>
          <span>Course progress</span>
          <span>Current module</span>
          <span>Last active</span>
          <span>Certificate</span>
        </div>
        {users.length ? (
          users.map((item) => {
            const modules = item.learner_progress || [];
            const required = ["module-1", "sop"];
            const completed = required.filter((key) =>
              modules.some((x) => x.module_key === key && x.completed),
            ).length;
            const total = Math.round((completed / required.length) * 100);
            const current = [...modules].sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
            )[0];
            const certificate = item.certificates?.[0];
            return (
              <div className="users-row" key={item.id}>
                <span>
                  <strong>{item.username}</strong>
                  <small>{item.active === false ? "Disabled" : "Active"}</small>
                </span>
                <span>
                  <i className={`role-badge ${item.role}`}>
                    {item.role.replace("_", " ")}
                  </i>
                </span>
                <span className="learner-total">
                  <i>
                    <b style={{ width: `${total}%` }} />
                  </i>
                  <small>
                    {total}% · {completed}/2 complete
                  </small>
                </span>
                <span>
                  <strong>{current?.module_title || "Not started"}</strong>
                  <small>
                    {current
                      ? `${current.progress}% complete`
                      : "No activity yet"}
                  </small>
                </span>
                <span>
                  {current?.updated_at
                    ? new Date(current.updated_at).toLocaleDateString()
                    : "—"}
                </span>
                <span>
                  {certificate ? (
                    <i className="issued-badge">Issued</i>
                  ) : (
                    <button
                      className="issue-button"
                      disabled={completed < 2}
                      onClick={() => issueCertificate(item.id)}
                    >
                      {completed === 2 ? "Issue" : "Not eligible"}
                    </button>
                  )}
                </span>
              </div>
            );
          })
        ) : (
          <div className="users-empty">
            No learner profiles yet. Create the first user.
          </div>
        )}
      </div>
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <form className="create-user-modal" onSubmit={createUser}>
            <div>
              <p className="eyebrow">NEW ACCOUNT</p>
              <h2>Create portal user</h2>
              <button type="button" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <p>
              The password is securely hashed before it is stored. Learners sign
              in with the username and password created here.
            </p>
            <label>
              Username
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="alex.morgan"
                autoComplete="off"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
                minLength="8"
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Role
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="customer_service">Customer Service</option>
                <option value="sales">Sales</option>
              </select>
            </label>
            {message && <p className="signin-error">{message}</p>}
            <div className="modal-actions">
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={busy}>
                {busy ? "Creating…" : "Create user"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function AdminPortal({ navigate, user }) {
  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/signin");
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="signin-brand">
          <img src="/DHARMA - LOGO (9).png" alt="Dharma" />
          <div>
            <strong>DHARMA</strong>
            <span>Admin Workspace</span>
          </div>
        </div>
        <nav>
          <button className="active">
            <Icon name="award" />
            Learners
          </button>
        </nav>
        <button className="admin-signout" onClick={signOut}>
          <Icon name="logout" />
          Sign out
        </button>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Learner progress</h1>
          </div>
          <div className="admin-header-actions">
            <a
              className="teams-help"
              href="https://teams.microsoft.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span>?</span>
              <span>
                <small>NEED HELP?</small>
                <strong>Contact Vinci through Teams</strong>
              </span>
            </a>
            <div className="admin-user">
              <span>AD</span>
              <div>
                <strong>Administrator</strong>
                <small>{user?.email}</small>
              </div>
            </div>
          </div>
        </header>
        <UserManagement />
      </main>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [adminUser, setAdminUser] = useState(null),
    [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const sync = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminUser(
        data.user?.email?.toLowerCase() ===
          import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
          ? data.user
          : null,
      );
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setAdminUser(
        session?.user?.email?.toLowerCase() ===
          import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
          ? session.user
          : null,
      ),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  function navigate(to) {
    window.history.pushState({}, "", to);
    setRoute(to);
    window.scrollTo(0, 0);
  }
  if (route === "/dashboard") {
    let session;
    try {
      session = JSON.parse(localStorage.getItem("dharma_portal_session"));
    } catch {
      return <SignIn navigate={navigate} />;
    }
    return session?.user && new Date(session.expiresAt) > new Date() ? (
      <Dashboard navigate={navigate} learner={session.user} />
    ) : (
      <SignIn navigate={navigate} />
    );
  }
  if (route === "/signin") return <SignIn navigate={navigate} />;
  if (route === "/admin/signin") return <SignIn navigate={navigate} admin />;
  if (route === "/admin") {
    if (!authReady)
      return (
        <div className="auth-loading">Verifying administrator access…</div>
      );
    return adminUser ? (
      <AdminPortal navigate={navigate} user={adminUser} />
    ) : (
      <SignIn navigate={navigate} admin />
    );
  }
  return <PortalChoice navigate={navigate} />;
}
export default App;
