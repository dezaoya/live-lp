const revealTargets = document.querySelectorAll(".reveal");
const fixedCta = document.querySelector(".fixed-cta");
const fv = document.querySelector(".fv");
const fvVideo = document.querySelector(".fv__video");
const soundToggle = document.querySelector(".sound-toggle");
const animatedSections = document.querySelectorAll(".section");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    threshold: 0.28,
    rootMargin: "-8% 0px -18% 0px",
  },
);

animatedSections.forEach((section) => sectionObserver.observe(section));

const showFvVideo = () => {
  fvVideo?.classList.add("is-ready");
};

if (fvVideo) {
  if (fvVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    showFvVideo();
  } else {
    fvVideo.addEventListener("loadeddata", showFvVideo, { once: true });
    fvVideo.addEventListener("canplay", showFvVideo, { once: true });
  }
}

const updateCta = () => {
  const trigger = fv ? fv.offsetHeight * 0.62 : window.innerHeight * 0.62;
  fixedCta.classList.toggle("is-shown", window.scrollY > trigger);
};

window.addEventListener("scroll", updateCta, { passive: true });
window.addEventListener("resize", updateCta);
updateCta();

fixedCta.addEventListener("click", (event) => {
  if (fixedCta.dataset.ticketUrl?.startsWith("TODO")) {
    event.preventDefault();
  }
});

const setSoundState = (isOn) => {
  if (!fvVideo || !soundToggle) return;

  fvVideo.muted = !isOn;
  soundToggle.setAttribute("aria-pressed", String(isOn));
  soundToggle.setAttribute(
    "aria-label",
    isOn ? "動画の音声をオフにする" : "動画の音声をオンにする",
  );
  soundToggle.textContent = isOn ? "音声 ON" : "音声 OFF";
};

soundToggle?.addEventListener("click", async () => {
  const nextSoundState = fvVideo ? fvVideo.muted : true;

  try {
    await fvVideo?.play();
  } catch {
    // ユーザー操作後でも再生できない環境では、表示状態だけを切り替えない。
    return;
  }

  setSoundState(nextSoundState);
});
