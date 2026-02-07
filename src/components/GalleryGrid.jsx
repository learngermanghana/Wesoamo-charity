import { useMemo, useState } from "react";

export default function GalleryGrid({ items }) {
  const [active, setActive] = useState(null);

  const safeItems = useMemo(() => {
    return (items || []).map((it, idx) => ({
      ...it,
      key: it.src || ("item-" + idx)
    }));
  }, [items]);

  function close() {
    setActive(null);
  }

  return (
    <>
      <div className="galleryGrid">
        {safeItems.map((it) => (
          <button
            key={it.key}
            className="galleryCard"
            onClick={() => setActive(it)}
            type="button"
            aria-label={"Open photo: " + (it.alt || "gallery image")}
          >
            <div className="galleryMedia">
              {/* If image missing, browser shows broken icon; caption still visible */}
              <img src={it.src} alt={it.alt || ""} loading="lazy" />
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
          </div>
        </div>
      )}
    </>
  );
}
