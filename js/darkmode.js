document.addEventListener("mousemove", (e) => {
    const overlay = document.querySelector(".dark-overlay");
    overlay.style.setProperty("--x", `${e.clientX}px`);
    overlay.style.setProperty("--y", `${e.clientY}px`);
});

// Detect when the mouse enters an iframe and hide the overlay
document.querySelectorAll("iframe").forEach((iframe) => {
    iframe.addEventListener("mouseenter", () => {
        document.querySelector(".dark-overlay").style.display = "none";
    });
    iframe.addEventListener("mouseleave", () => {
        document.querySelector(".dark-overlay").style.display = "block";
    });
});