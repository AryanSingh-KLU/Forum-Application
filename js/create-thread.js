document.addEventListener("DOMContentLoaded", function () {

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

        const currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );

        const newThread = {
            id: Date.now(),
            title: title,
            category: category,
            description: description,
            author: currentUser ? currentUser.name : (document.getElementById("threadAuthor")?.value.trim() || "Anonymous"),
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

        alert("Discussion published successfully!");

        window.location.href = "index.html";

    });

});
