document.addEventListener("DOMContentLoaded", function () {

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
        currentUser = null;
    }

    if (!currentUser || currentUser.role !== "user") {
        const gate = document.createElement("div");
        gate.className = "signin-gate";
        gate.setAttribute("role", "dialog");
        gate.setAttribute("aria-modal", "true");
        gate.setAttribute("aria-labelledby", "signinGateTitle");
        gate.innerHTML = `
            <section class="signin-gate-card">
                <div class="signin-gate-icon" aria-hidden="true">✦</div>
                <p class="eyebrow">JOIN THE CONVERSATION</p>
                <h2 id="signinGateTitle">Sign in to start a discussion</h2>
                <p class="signin-gate-copy">Create an account or sign in to share your question with the ForumHub community.</p>
                <div class="signin-gate-actions">
                    <a class="btn" href="login.html">Sign in</a>
                    <a class="btn btn-secondary" href="signup.html">Create account</a>
                </div>
                <a class="signin-gate-back" href="index.html#discussions">Back to discussions</a>
            </section>`;
        document.body.append(gate);
        document.body.classList.add("signin-gate-open");
        return;
    }

    const form = document.getElementById("threadForm");

    if (!form) {
        console.log("Thread form not found");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();

        if (title === "" || category === "" || description === "") {
            alert("Please fill all the fields.");
            return;
        }

        let threads = [];
        try { threads = JSON.parse(localStorage.getItem("threads") || "[]"); } catch { threads = []; }
        if (!Array.isArray(threads)) threads = [];

        const newThread = {
            id: Date.now(),
            title: title,
            category: category,
            description: description,
            author: currentUser.name,
            authorEmail: currentUser.email,
            date: new Date().toLocaleDateString(),
            likes: 0,
            dislikes: 0,
            replies: [],
            followers: []
        };

        threads.unshift(newThread);

        localStorage.setItem(
            "threads",
            JSON.stringify(threads)
        );

        const success = document.createElement("div");
        success.className = "signin-gate publish-success-gate";
        success.setAttribute("role", "dialog");
        success.setAttribute("aria-modal", "true");
        success.setAttribute("aria-labelledby", "publishSuccessTitle");
        success.innerHTML = `
            <section class="signin-gate-card">
                <div class="signin-gate-icon publish-success-icon" aria-hidden="true">✓</div>
                <p class="eyebrow">POSTED TO THE COMMUNITY</p>
                <h2 id="publishSuccessTitle">Discussion published!</h2>
                <p class="signin-gate-copy">Your discussion is now available for the community to read and reply to.</p>
                <div class="signin-gate-actions">
                    <a class="btn" href="index.html#discussions">View discussions</a>
                </div>
            </section>`;
        document.body.append(success);
        document.body.classList.add("signin-gate-open");

    });

});
