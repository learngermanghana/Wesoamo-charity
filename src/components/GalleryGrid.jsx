import { useEffect, useMemo, useState } from "react";

export default function GalleryGrid({ items }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const safeItems = useMemo(() => {
    return (items || []).map((it, idx) => ({
      ...it,
      key: it.src || ("item-" + idx)
    }));
  }, [items]);

  const active = activeIndex >= 0 ? safeItems[activeIndex] : null;

  function close() {
    setActiveIndex(-1);
  }

  function showPrev() {
    setActiveIndex((current) => {
      if (current < 0 || safeItems.length === 0) return -1;
      return (current - 1 + safeItems.length) % safeItems.length;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current < 0 || safeItems.length === 0) return -1;
      return (current + 1) % safeItems.length;
    });
  }

  useEffect(() => {
    if (!active) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <>
      <div className="galleryGrid">
        {safeItems.map((it, idx) => (
          <button
            key={it.key}
            className="galleryCard"
            onClick={() => setActiveIndex(idx)}
            type="button"
            aria-label={"Open photo: " + (it.alt || "gallery image")}
          >
            <div className="galleryMedia">
              <img src={it.src} alt={it.alt || ""} loading="lazy" decoding="async" />
            </div>
            <div className="galleryCaption">
              {it.caption || "—"}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <div className="lightboxInner" onClick={(e) => e.stopPropagation()}>
            <button className="lightboxClose" onClick={close} type="button" aria-label="Close">
              ✕
            </button>

            <div className="lightboxMedia">
              <img src={active.src} alt={active.alt || ""} />
            </div>

            {active.caption && <div className="lightboxCaption">{active.caption}</div>}

            <div className="lightboxNav" aria-label="Photo navigation">
              <button className="btn btn--outline" type="button" onClick={showPrev}>
                Previous
              </button>
              <span className="tiny">Use ← → keys to browse</span>
              <button className="btn btn--outline" type="button" onClick={showNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
