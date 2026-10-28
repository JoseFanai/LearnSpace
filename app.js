const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const courses = [{
        id: "js-foundations",
        title: "JavaScript Foundations",
        category: "Development",
        level: "Beginner",
        creator: "freeCodeCamp.org",
        creatorLabel: "FCC",
        duration: "4h 12m",
        lessons: 8,
        color: "purple",
        description: "Build a solid understanding of the JavaScript essentials that power interactive websites.",
        videoId: "PkZNo7MFNFg",
        tags: ["JavaScript", "Web development"],
        curriculum: [
            ["Getting started with JavaScript", "Learn what JavaScript does and how it fits into a web page.", "PkZNo7MFNFg"],
            ["Variables and data types", "Understand values, variables, strings, numbers and booleans.", "W6NZfCO5SIk"],
            ["Functions and scope", "Practice writing reusable functions and understanding scope.", "N8ap4k_1QEQ"],
            ["Arrays and objects", "Store and work with collections of related data.", "oigfaZ5ApsM"],
            ["DOM basics", "Select and update elements on a web page.", "y17RuWkWdn8"]
        ]
    },
    {
        id: "ui-design",
        title: "UI Design Essentials",
        category: "Design",
        level: "Beginner",
        creator: "DesignCourse",
        creatorLabel: "DC",
        duration: "2h 35m",
        lessons: 6,
        color: "orange",
        description: "Learn the visual principles behind interfaces that feel clear, balanced and intuitive.",
        videoId: "c9Wg6Cb_YlU",
        tags: ["UI design", "Visual design"],
        curriculum: [
            ["Design foundations", "Explore hierarchy, alignment, contrast and visual balance.", "c9Wg6Cb_YlU"],
            ["Color and typography", "Use color and type to make information easier to scan.", "QrNi9FmdlxY"],
            ["Spacing and layout", "Create consistent rhythm with grids and spacing.", "j6Ule7GXaRs"]
        ]
    },
    {
        id: "react-intro",
        title: "React for Beginners",
        category: "Development",
        level: "Beginner",
        creator: "Programming with Mosh",
        creatorLabel: "PM",
        duration: "3h 18m",
        lessons: 7,
        color: "blue",
        description: "Get introduced to components, props, state and the way React builds user interfaces.",
        videoId: "SqcY0GlETPk",
        tags: ["React", "JavaScript"],
        curriculum: [
            ["What is React?", "Understand why component-based UI development is useful.", "SqcY0GlETPk"],
            ["Your first component", "Break a user interface into reusable pieces.", "Tn6-PIqc4UM"],
            ["Props and state", "Pass data to components and manage changing UI state.", "4ORZ1GmjaMc"]
        ]
    },
    {
        id: "focus-systems",
        title: "Build Better Study Habits",
        category: "Productivity",
        level: "All levels",
        creator: "Ali Abdaal",
        creatorLabel: "AA",
        duration: "1h 45m",
        lessons: 5,
        color: "green",
        description: "Create a sustainable learning routine with realistic goals and focused work sessions.",
        videoId: "f2O6mQkFiiw",
        tags: ["Habits", "Productivity"],
        curriculum: [
            ["Make learning easier to start", "Reduce friction and set up a small, repeatable study routine.", "f2O6mQkFiiw"],
            ["Plan a realistic week", "Choose a few priorities instead of an overwhelming list.", "Z9w9yX6g9k4"]
        ]
    },
    {
        id: "html-css",
        title: "HTML & CSS Refresher",
        category: "Development",
        level: "Beginner",
        creator: "Kevin Powell",
        creatorLabel: "KP",
        duration: "2h 05m",
        lessons: 6,
        color: "pink",
        description: "Revisit semantic HTML, modern CSS, responsive layouts and practical styling patterns.",
        videoId: "G3e-cpL7ofc",
        tags: ["HTML", "CSS", "Responsive"],
        curriculum: [
            ["Semantic HTML", "Structure pages with meaningful, accessible HTML.", "G3e-cpL7ofc"],
            ["Modern CSS layouts", "Use Flexbox and Grid to build responsive layouts.", "phWxA89Dy94"],
            ["Responsive design", "Make layouts work on different screen sizes.", "srvUrASNj0s"]
        ]
    },
    {
        id: "git-basics",
        title: "Git & GitHub Basics",
        category: "Development",
        level: "Beginner",
        creator: "The Net Ninja",
        creatorLabel: "NN",
        duration: "1h 30m",
        lessons: 5,
        color: "yellow",
        description: "Learn the everyday Git workflow for saving versions and sharing your projects.",
        videoId: "RGOj5yH7evk",
        tags: ["Git", "GitHub"],
        curriculum: [
            ["Why version control?", "Understand repositories and version history.", "RGOj5yH7evk"],
            ["Commit your changes", "Use add, commit, status and log.", "USjZcfj8yxE"],
            ["Push to GitHub", "Publish a repository and share your work.", "iv8rSLsi1xo"]
        ]
    }
];

const assignments = [
    { id: "portfolio-page", title: "Build a personal portfolio page", courseId: "html-css", type: "Project", due: "Self-paced", description: "Create a responsive one-page portfolio with an introduction, skills, projects and contact section." },
    { id: "js-quiz", title: "JavaScript fundamentals quiz", courseId: "js-foundations", type: "Practice", due: "Self-paced", description: "Create a short quiz with at least five questions, score feedback and a restart button." },
    { id: "ui-review", title: "Review an interface you use", courseId: "ui-design", type: "Reflection", due: "Self-paced", description: "Identify three design choices that make an app easy or difficult to use." }
];

const CONFIG = window.LEARNSPACE_CONFIG || {};
const hasSupabaseConfig = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && window.supabase);
let supabaseClient = null;
if (hasSupabaseConfig) supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);

const state = {
    view: "overview",
    user: null,
    profile: null,
    progress: {},
    submissions: {},
    activeCourseId: null,
    activeLessonIndex: 0,
    authMode: "login"
};

const DEMO_KEY = "learnspace-demo-v1";
const blankProgress = () => ({ completed: [], lastLesson: 0, enrolled: false });

function loadDemo() {
    try {
        const saved = JSON.parse(localStorage.getItem(DEMO_KEY) || "{}");
        state.progress = saved.progress || {};
        state.submissions = saved.submissions || {};
        state.profile = saved.profile || { full_name: "Guest learner", email: "Demo mode" };
    } catch {
        state.progress = {};
        state.submissions = {};
        state.profile = { full_name: "Guest learner", email: "Demo mode" };
    }
}

function saveDemo() {
    localStorage.setItem(DEMO_KEY, JSON.stringify({
        progress: state.progress,
        submissions: state.submissions,
        profile: state.profile
    }));
}

function progressFor(courseId) {
    if (!state.progress[courseId]) state.progress[courseId] = blankProgress();
    return state.progress[courseId];
}

function courseProgress(course) {
    const p = progressFor(course.id);
    const total = course.curriculum.length;
    return Math.round((p.completed.length / total) * 100);
}

function enrolledCourses() {
    return courses.filter(c => progressFor(c.id).enrolled);
}

function esc(value) {
    return String(value ? ? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
}

function initials(name = "Learner") {
    return name.trim().split(/\s+/).slice(0, 2).map(s => s[0] || "").join("").toUpperCase();
}

function courseCard(course, options = {}) {
    const p = progressFor(course.id);
    const percent = courseProgress(course);
    const showProgress = options.progress || p.enrolled;
    return `<article class="course-card">
    <button class="course-cover ${course.color}" data-open-course="${course.id}" aria-label="Open ${esc(course.title)}">
      <span class="cover-kicker">${esc(course.category)} · ${esc(course.level)}</span>
      <span class="cover-graphic graphic-${course.color}"><i></i><i></i><i></i></span>
      <span class="cover-play">▶</span>
      <span class="cover-duration">${esc(course.duration)}</span>
    </button>
    <div class="course-card-body">
      <div class="creator-row"><span class="creator-avatar ${course.color}">${esc(course.creatorLabel)}</span><span>${esc(course.creator)}</span><span class="creator-check">✓</span></div>
      <button class="course-title-button" data-open-course="${course.id}">${esc(course.title)}</button>
      <p class="course-description">${esc(course.description)}</p>
      ${showProgress ? `<div class="progress-meta"><span>${p.completed.length} of ${course.curriculum.length} lessons</span><strong>${percent}%</strong></div><div class="progress-track"><span style="width:${percent}%"></span></div>` : `<div class="card-bottom"><span>◷ ${esc(course.duration)}</span><span>${course.curriculum.length} lessons</span></div>`}
      <div class="card-actions"><button class="secondary-button small" data-open-course="${course.id}">${p.enrolled ? "Continue learning" : "View course"} <span>↗</span></button>${!p.enrolled ? `<button class="bookmark-button" data-enroll="${course.id}" aria-label="Add ${esc(course.title)} to my learning">＋</button>` : ""}</div>
    </div>
  </article>`;
}

function renderOverview() {
  const enrolled = enrolledCourses();
  const continueList = (enrolled.length ? enrolled : courses.slice(0, 2)).slice(0, 3);
  $("#continue-grid").innerHTML = continueList.map(c => courseCard(c, { progress: true })).join("");
  $("#recommended-grid").innerHTML = courses.filter(c => !progressFor(c.id).enrolled).slice(0, 3).map(c => courseCard(c)).join("");
  const totalCompleted = Object.values(state.progress).reduce((sum, p) => sum + (p.completed?.length || 0), 0);
  $("#stat-courses").textContent = enrolled.length;
  $("#stat-lessons").textContent = totalCompleted;
  $("#assignment-count").textContent = assignments.filter(a => !state.submissions[a.id]?.status || state.submissions[a.id]?.status !== "submitted").length;
}
function renderCourses() {
  const query = ($("#course-search")?.value || "").toLowerCase().trim();
  const category = $("#category-filter")?.value || "All";
  const filtered = courses.filter(c => (category === "All" || c.category === category) &&
    `${c.title} ${c.creator} ${c.category} ${c.tags.join(" ")}`.toLowerCase().includes(query));
  $("#all-courses-grid").innerHTML = filtered.map(c => courseCard(c)).join("") || `<div class="empty-state"><h3>No courses found</h3><p>Try another search term or category.</p></div>`;
}
function renderMyLearning() {
  const enrolled = enrolledCourses();
  $("#my-learning-grid").innerHTML = enrolled.map(c => courseCard(c, { progress: true })).join("");
  $("#learning-empty").classList.toggle("hidden", enrolled.length > 0);
}
function renderAssignments() {
  $("#assignment-list").innerHTML = assignments.map((a, index) => {
    const sub = state.submissions[a.id] || {};
    const course = courses.find(c => c.id === a.courseId);
    return `<article class="assignment-card">
      <div class="assignment-symbol ${index % 2 ? "mint" : "lavender"}">${a.type === "Project" ? "⌘" : a.type === "Practice" ? "✓" : "✎"}</div>
      <div class="assignment-main"><div class="assignment-meta">${esc(a.type)} <span>·</span> ${esc(course?.title || "")}</div><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><div class="assignment-due">◷ ${esc(a.due)}</div>
      ${sub.url ? `<a class="submission-link" href="${esc(sub.url)}" target="_blank" rel="noopener noreferrer">View submitted link ↗</a>` : ""}
      </div>
      <div class="assignment-side"><span class="assignment-status ${sub.status === "submitted" ? "done" : ""}">${sub.status === "submitted" ? "Submitted" : "Not submitted"}</span><button class="secondary-button small" data-submit-assignment="${a.id}">${sub.status === "submitted" ? "Update submission" : "Submit work"} ↗</button></div>
    </article>`;
  }).join("");
}
function renderUser() {
  const name = state.profile?.full_name || state.user?.email?.split("@")[0] || "Guest learner";
  $("#sidebar-name").textContent = name;
  $("#sidebar-email").textContent = state.user ? state.user.email : (hasSupabaseConfig ? "Not signed in" : "Demo mode · this browser only");
  $("#sidebar-avatar").textContent = initials(name);
  $("#top-avatar").textContent = initials(name);
  $("#connection-status").innerHTML = `<span class="status-dot"></span> ${state.user ? "Cloud account" : hasSupabaseConfig ? "Not signed in" : "Demo mode"}`;
  $("#account-description").textContent = state.user ? `Signed in as ${state.user.email}. Your progress is designed to sync through Supabase.` : "You're exploring LearnSpace in demo mode. Progress is saved only in this browser unless Supabase is configured and you sign in.";
  $("#config-state").innerHTML = `<span class="status-dot ${hasSupabaseConfig ? "connected" : ""}"></span> ${hasSupabaseConfig ? "Supabase keys found. Database setup and sign-in still need to be verified." : "Supabase is not configured. Cloud authentication and sync are inactive."}`;
  $("#auth-mode-note").textContent = hasSupabaseConfig ? "Supabase configured: real email/password authentication will be used." : "Demo mode: sign-in is simulated locally and is not secure authentication.";
}
function renderAll() {
  renderOverview(); renderCourses(); renderMyLearning(); renderAssignments(); renderUser();
}
function showView(view) {
  state.view = view;
  $$(".page-view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
  $$(".nav-item[data-view]").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  const labels = { overview: "Overview", courses: "Explore courses", "my-learning": "My learning", assignments: "Assignments", settings: "Settings", "course-detail": "Course details" };
  $("#breadcrumb-current").textContent = labels[view] || "Overview";
  $("#sidebar").classList.remove("mobile-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openCourse(courseId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return;
  state.activeCourseId = courseId;
  const p = progressFor(courseId);
  const percent = courseProgress(course);
  $("#course-detail-content").innerHTML = `
    <div class="course-detail-hero ${course.color}">
      <div><div class="eyebrow">${esc(course.category)} · ${esc(course.level)}</div><h1>${esc(course.title)}</h1><p>${esc(course.description)}</p><div class="detail-meta"><span>◷ ${esc(course.duration)}</span><span>▤ ${course.curriculum.length} lessons</span><span>By ${esc(course.creator)}</span></div>
      <button class="primary-button" id="detail-enroll">${p.enrolled ? "Continue learning" : "Add to my learning"} <span>↗</span></button></div>
      <div class="detail-abstract"><div class="abstract-ring"><span>${percent}%</span></div><small>COURSE PROGRESS</small></div>
    </div>
    <div class="detail-columns"><div><div class="section-heading compact"><div><div class="eyebrow">THE LEARNING PATH</div><h2>Course content</h2></div></div>
      <div class="curriculum-list">${course.curriculum.map((lesson, i) => `<button class="curriculum-item" data-lesson-index="${i}"><span class="lesson-number ${p.completed.includes(i) ? "completed" : ""}">${p.completed.includes(i) ? "✓" : String(i+1).padStart(2,"0")}</span><span class="curriculum-copy"><strong>${esc(lesson[0])}</strong><small>${esc(lesson[1])}</small></span><span class="curriculum-play">▶</span></button>`).join("")}</div>
    </div><aside class="detail-sidebar"><h3>What you'll learn</h3><ul><li>Understand the core concepts</li><li>Practice with guided lessons</li><li>Apply your knowledge in a project</li><li>Track your progress as you go</li></ul><div class="note-card"><span>✳</span><p>Learn at your own pace. Your progress is saved as you go.</p></div></aside></div>`;
  $("#detail-enroll").addEventListener("click", () => {
    progressFor(courseId).enrolled = true; saveProgress(); renderAll(); openCourse(courseId);
    if (course.curriculum.length) openLesson(courseId, progressFor(courseId).lastLesson || 0);
  });
  $$("[data-lesson-index]", $("#course-detail-content")).forEach(button => button.addEventListener("click", () => {
    progressFor(courseId).enrolled = true;
    const idx = Number(button.dataset.lessonIndex);
    progressFor(courseId).lastLesson = idx;
    saveProgress(); renderAll(); openLesson(courseId, idx);
  }));
  showView("course-detail");
}
function openLesson(courseId, index) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return;
  const p = progressFor(courseId);
  const lesson = course.curriculum[index];
  state.activeCourseId = courseId; state.activeLessonIndex = index;
  p.enrolled = true; p.lastLesson = index; saveProgress();
  $("#lesson-title").textContent = lesson[0];
  $("#lesson-description").textContent = lesson[1];
  $("#lesson-progress-label").textContent = `Lesson ${index + 1} of ${course.curriculum.length} · ${p.completed.length} completed`;
  $("#video-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(lesson[2])}?rel=0" title="${esc(lesson[0])}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  const completeButton = $("#complete-lesson");
  completeButton.textContent = p.completed.includes(index) ? "Completed ✓" : "Mark as completed ✓";
  completeButton.disabled = p.completed.includes(index);
  $("#lesson-modal").showModal();
  renderAll();
}
async function saveProgress() {
  if (!state.user || !supabaseClient) { saveDemo(); return; }
  const courseId = state.activeCourseId;
  if (courseId) {
    const p = progressFor(courseId);
    const { error } = await supabaseClient.from("lesson_progress").upsert({
      user_id: state.user.id, course_id: courseId, completed_lessons: p.completed,
      last_lesson_index: p.lastLesson, enrolled: p.enrolled, updated_at: new Date().toISOString()
    }, { onConflict: "user_id,course_id" });
    if (error) { console.error(error); toast("Could not sync progress. Check your Supabase schema and policies."); }
  }
}
async function loadCloudProgress() {
  if (!state.user || !supabaseClient) return;
  const { data, error } = await supabaseClient.from("lesson_progress").select("*").eq("user_id", state.user.id);
  if (error) { console.error(error); toast("Signed in, but progress could not load. Check database setup."); return; }
  state.progress = {};
  (data || []).forEach(row => {
    state.progress[row.course_id] = {
      completed: row.completed_lessons || [], lastLesson: row.last_lesson_index || 0, enrolled: row.enrolled || false
    };
  });
  const { data: profileData } = await supabaseClient.from("profiles").select("full_name").eq("id", state.user.id).maybeSingle();
  const { data: submissionRows, error: submissionError } = await supabaseClient.from("assignment_submissions").select("*").eq("user_id", state.user.id);
  if (submissionError) console.error("Could not load assignment submissions:", submissionError);
  state.submissions = {};
  (submissionRows || []).forEach(row => {
    state.submissions[row.assignment_id] = { url: row.submission_url, status: row.status, submittedAt: row.updated_at, feedback: row.feedback };
  });
  state.profile = { full_name: profileData?.full_name || state.user.email?.split("@")[0], email: state.user.email };
  renderAll();
}
async function initAuth() {
  if (!supabaseClient) { loadDemo(); renderAll(); return; }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user) {
    state.user = session.user;
    await loadCloudProgress();
  } else {
    loadDemo();
  }
  supabaseClient.auth.onAuthStateChange(async (_event, sessionNow) => {
    state.user = sessionNow?.user || null;
    if (state.user) await loadCloudProgress();
    else { loadDemo(); renderAll(); }
  });
  renderAll();
}
function setAuthMode(mode) {
  state.authMode = mode;
  const isRegister = mode === "register";
  $("#login-tab").classList.toggle("active", !isRegister);
  $("#register-tab").classList.toggle("active", isRegister);
  $("#name-field-label").classList.toggle("hidden", !isRegister);
  $("#auth-name").required = isRegister;
  $("#auth-title").textContent = isRegister ? "Create your learning space." : "Your next chapter starts here.";
  $("#auth-description").textContent = isRegister ? "Create an account to save your courses and progress." : "Sign in to pick up where you left off.";
  $("#auth-submit").textContent = isRegister ? "Create account" : "Sign in";
  $("#auth-password").autocomplete = isRegister ? "new-password" : "current-password";
  $("#auth-message").textContent = "";
}
async function handleAuth(event) {
  event.preventDefault();
  const email = $("#auth-email").value.trim();
  const password = $("#auth-password").value;
  const name = $("#auth-name").value.trim();
  const message = $("#auth-message");
  message.textContent = "";
  if (!supabaseClient) {
    if (state.authMode === "register") {
      state.profile = { full_name: name || email.split("@")[0], email };
      toast("Demo profile created. This is not a real account.");
    } else {
      state.profile = { full_name: email.split("@")[0], email };
      toast("Demo sign-in only. No secure account was created.");
    }
    saveDemo(); renderAll(); $("#auth-modal").close(); return;
  }
  $("#auth-submit").disabled = true;
  try {
    if (state.authMode === "register") {
      const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) throw error;
      if (data.user && !data.session) {
        message.textContent = "Account created. Check your email to confirm, then sign in.";
      } else {
        state.user = data.user;
        await supabaseClient.from("profiles").upsert({ id: data.user.id, full_name: name, email });
        await loadCloudProgress();
        $("#auth-modal").close(); toast("Welcome to LearnSpace!");
      }
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.user = data.user;
      await loadCloudProgress();
      $("#auth-modal").close(); toast("Welcome back!");
    }
  } catch (error) {
    message.textContent = error.message || "Authentication failed. Please try again.";
  } finally {
    $("#auth-submit").disabled = false;
  }
}
async function signOut() {
  if (supabaseClient && state.user) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) { toast(error.message); return; }
    state.user = null;
  } else {
    toast("Demo mode: there is no real session to sign out from.");
  }
  loadDemo(); renderAll(); showView("overview");
}
function submitAssignment(id) {
  const assignment = assignments.find(a => a.id === id);
  if (!assignment) return;
  const existing = state.submissions[id]?.url || "";
  const url = prompt(`Paste a public project, GitHub, or document link for:\n${assignment.title}\n\nFor this first version, submit a URL (not a file upload).`, existing);
  if (url === null) return;
  const trimmed = url.trim();
  if (!trimmed) { toast("No submission link added."); return; }
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch { toast("Please enter a valid link starting with https://"); return; }
  state.submissions[id] = { url: trimmed, status: "submitted", submittedAt: new Date().toISOString() };
  if (state.user && supabaseClient) {
    supabaseClient.from("assignment_submissions").upsert({
      user_id: state.user.id, assignment_id: id, submission_url: trimmed, status: "submitted", updated_at: new Date().toISOString()
    }, { onConflict: "user_id,assignment_id" }).then(({ error }) => {
      if (error) { console.error(error); toast("Saved locally, but cloud submission failed. Check schema."); }
      else toast("Assignment submitted!");
    });
  } else {
    saveDemo(); toast("Saved in this browser only. Sign in with configured Supabase for cloud saving.");
  }
  renderAssignments(); renderOverview();
}

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) showView(viewButton.dataset.view);
  const goButton = event.target.closest("[data-go]");
  if (goButton) showView(goButton.dataset.go);
  const openButton = event.target.closest("[data-open-course]");
  if (openButton) openCourse(openButton.dataset.openCourse);
  const enrollButton = event.target.closest("[data-enroll]");
  if (enrollButton) {
    const enrolledId = enrollButton.dataset.enroll;
    progressFor(enrolledId).enrolled = true;
    state.activeCourseId = enrolledId;
    if (state.user && supabaseClient) {
      saveProgress().then(() => { renderAll(); toast("Added to My learning."); openCourse(enrolledId); });
    } else {
      saveDemo(); renderAll(); toast("Added to My learning."); openCourse(enrolledId);
    }
  }
  const submitButton = event.target.closest("[data-submit-assignment]");
  if (submitButton) submitAssignment(submitButton.dataset.submitAssignment);
});
$("#course-search").addEventListener("input", renderCourses);
$("#category-filter").addEventListener("change", renderCourses);
$("#settings-button").addEventListener("click", () => showView("settings"));
$("#auth-open").addEventListener("click", () => { setAuthMode("login"); $("#auth-modal").showModal(); });
$("#account-button").addEventListener("click", () => showView("settings"));
$("#top-avatar").addEventListener("click", () => showView("settings"));
$("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("mobile-open"));
$("#login-tab").addEventListener("click", () => setAuthMode("login"));
$("#register-tab").addEventListener("click", () => setAuthMode("register"));
$("#auth-form").addEventListener("submit", handleAuth);
$("#signout-button").addEventListener("click", signOut);
$("#back-to-courses").addEventListener("click", () => showView("courses"));
$("#complete-lesson").addEventListener("click", async () => {
  const course = courses.find(c => c.id === state.activeCourseId);
  if (!course) return;
  const p = progressFor(course.id);
  if (!p.completed.includes(state.activeLessonIndex)) p.completed.push(state.activeLessonIndex);
  p.enrolled = true;
  await saveProgress();
  $("#complete-lesson").textContent = "Completed ✓";
  $("#complete-lesson").disabled = true;
  renderAll();
  toast("Lesson marked complete!");
});
$("#lesson-modal").addEventListener("close", () => { $("#video-frame").innerHTML = ""; renderAll(); });
$("#auth-modal").addEventListener("click", event => {
  if (event.target === $("#auth-modal")) $("#auth-modal").close();
});
$("#lesson-modal").addEventListener("click", event => {
  if (event.target === $("#lesson-modal")) $("#lesson-modal").close();
});

initAuth();