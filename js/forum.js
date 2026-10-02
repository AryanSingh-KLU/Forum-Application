/* =====================================================
   FORUMHUB - HOME PAGE JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeForum();

});


/* =====================================================
   INITIALIZE
   ===================================================== */

function initializeForum() {

    createSampleDataIfNeeded();

    updateStatistics();

    displayDiscussions();

    setupSearch();

}


/* =====================================================
   SAMPLE DATA
   ===================================================== */

function createSampleDataIfNeeded() {

    let threads = JSON.parse(
        localStorage.getItem("threads")
    );

    if (!threads || !Array.isArray(threads)) {

        threads = [

            {
                id: "thread-1",

                title: "How to learn JavaScript?",

                content:
                    "I am a beginner in JavaScript. Which topics should I learn first?",

                category: "Programming",

                author: "Priya",

                date: "2026-09-21",

                likes: 5,

                dislikes: 0,

                replies: 1

            },

            {
                id: "thread-2",

                title: "Ideas for a college mini project",

                content:
                    "Looking for simple but useful project ideas using HTML, CSS and JavaScript.",

                category: "Projects",

                author: "Rahul",

                date: "2026-09-20",

                likes: 3,

                dislikes: 0,

                replies: 2

            },

            {
                id: "thread-3",

                title: "Best way to prepare for exams?",

                content:
                    "What study techniques do you use before your semester examinations?",

                category: "Academics",

                author: "Ananya",

                date: "2026-09-19",

                likes: 7,

                dislikes: 1,

                replies: 3

            }

        ];

        localStorage.setItem(
            "threads",
            JSON.stringify(threads)
        );

    }


    /* Users */

    let users = JSON.parse(
        localStorage.getItem("users")
    );

    if (!users || !Array.isArray(users)) {

        users = [

            {
                name: "Priya",
                email: "priya@example.com"
            },

            {
                name: "Rahul",
                email: "rahul@example.com"
            },

            {
                name: "Ananya",
                email: "ananya@example.com"
            }

        ];

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }

}


/* =====================================================
   UPDATE STATISTICS
   ===================================================== */

function updateStatistics() {

    const threads = getThreads();

    const users = getUsers();


    const discussionCount = document.getElementById("discussionCount") || document.getElementById("activeDiscussions");

    const userCount = document.getElementById("userCount") || document.getElementById("registeredUsers");


    if (discussionCount) {

        discussionCount.textContent =
            threads.length;

    }


    if (userCount) {

        userCount.textContent =
            users.length;

    }

}


/* =====================================================
   GET THREADS
   ===================================================== */

function getThreads() {

    const data =
        localStorage.getItem("threads");

    if (!data) {

        return [];

    }

    try {

        const threads = JSON.parse(data);

        return Array.isArray(threads)
            ? threads
            : [];

    } catch (error) {

        console.error(
            "Unable to read threads:",
            error
        );

        return [];

    }

}


/* =====================================================
   GET USERS
   ===================================================== */

function getUsers() {

    const data =
        localStorage.getItem("users");

    if (!data) {

        return [];

    }

    try {

        const users = JSON.parse(data);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        return [];

    }

}


/* =====================================================
   DISPLAY DISCUSSIONS
   ===================================================== */

function displayDiscussions(
    searchText = "",
    category = "all"
) {

    const container =
        document.getElementById(
            "discussionList"
        );

    if (!container) {

        return;

    }


    const threads = getThreads();


    const filteredThreads =
        threads.filter(function (thread) {

            const title =
                String(
                    thread.title || ""
                ).toLowerCase();

            const content =
                String(
                    thread.content || thread.description || ""
                ).toLowerCase();

            const threadCategory =
                String(
                    thread.category || "General"
                );


            const search =
                searchText
                    .toLowerCase()
                    .trim();


            const matchesSearch =
                title.includes(search) ||
                content.includes(search);


            const matchesCategory =
                category === "all" ||
                threadCategory === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    container.innerHTML = "";


    if (filteredThreads.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    💬
                </div>

                <h3>
                    No discussions found
                </h3>

                <p>
                    Start a new discussion and
                    get the community talking.
                </p>

                <a
                    href="create-thread.html"
                    class="primary-btn"
                >
                    + Start a Discussion
                </a>

            </div>

        `;

        return;

    }


    filteredThreads.forEach(function (thread) {

        const card =
            createDiscussionCard(thread);

        container.appendChild(card);

    });

}


/* =====================================================
   CREATE DISCUSSION CARD
   ===================================================== */

function createDiscussionCard(thread) {

    const card =
        document.createElement("a");

    card.className =
        "discussion-card";
    card.href = `thread.html?id=${encodeURIComponent(thread.id || "")}`;
    card.dataset.category = thread.category || "General";
    card.dataset.title = thread.title || "";


    const likes =
        Number(thread.likes) || 0;

    const dislikes =
        Number(thread.dislikes) || 0;

    const replies = Array.isArray(thread.replies) ? thread.replies.length : (Number(thread.replies) || 0);


    const author =
        thread.author ||
        "Anonymous";


    const category =
        thread.category ||
        "General";


    const date =
        thread.date ||
        "Recently";


    card.innerHTML = `

        <div class="card-top">

            <span class="category">
                ${escapeHTML(category)}
            </span>

            <span class="votes">
                👍 ${likes}
                &nbsp;&nbsp;
                👎 ${dislikes}
            </span>

        </div>


        <h3>

            ${escapeHTML(
                thread.title ||
                "Untitled Discussion"
            )}

        </h3>


        <p>
                ${escapeHTML(
                    thread.content || thread.description ||
                "No description available."
            )}
        </p>


        <div class="card-bottom">

            <span>
                Asked by
                <strong>
                    ${escapeHTML(author)}
                </strong>
                • ${escapeHTML(date)}
                • ${replies} ${replies === 1 ? "reply" : "replies"}
            </span>


            <span class="open-link">
                Open →
            </span>

        </div>

    `;

    card.setAttribute("aria-label", `Open discussion: ${thread.title || "Untitled Discussion"}`);


    return card;

}


/* =====================================================
   SEARCH AND FILTER
   ===================================================== */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                displayDiscussions(
                    searchInput.value,
                    categoryFilter
                        ? categoryFilter.value
                        : "all"
                );

            }
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                displayDiscussions(
                    searchInput
                        ? searchInput.value
                        : "",
                    categoryFilter.value
                );

            }
        );

    }

}


/* =====================================================
   SECURITY
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}
