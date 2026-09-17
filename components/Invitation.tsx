"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CalendarPlus, Clock3, MapPin, Music2, Pause } from "lucide-react";
import { gallery, wedding } from "./wedding-config";

const target = new Date(`${wedding.date}T${wedding.time}:00+05:00`).getTime();
type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };
type Spark = { id: number; x: number; drift: number; size: number; delay: number; kind: "star" | "petal" | "dot" };

function getRemaining(): Remaining {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: false,
  };
}

const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${wedding.groom} & ${wedding.bride} To‘yi`)}&dates=20261018T130000Z/20261018T180000Z&details=${encodeURIComponent("Samar va Madinaning to‘y marosimi")}&location=${encodeURIComponent(`${wedding.venue}, ${wedding.city}`)}`;

function Ornament() {
  return <span className="ornament" aria-hidden="true">✦ ✧ ✦</span>;
}

export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [countdown, setCountdown] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false });
  const [musicOn, setMusicOn] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [flash, setFlash] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lastBurst = useRef(0);
  const lastY = useRef(0);
  const sparkId = useRef(0);
  const names = `${wedding.groom} & ${wedding.bride}`;
  const petals = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      left: `${(i * 17) % 100}%`,
      delay: `${(i * 0.45) % 8}s`,
      duration: `${9 + (i % 6)}s`,
      rotate: `${i * 24}deg`,
    })),
    [],
  );
  const stars = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: `${8 + ((i * 47) % 84)}%`,
      top: `${6 + ((i * 29) % 78)}%`,
      delay: `${(i % 7) * 0.35}s`,
    })),
    [],
  );

  useEffect(() => {
    setCountdown(getRemaining());
    const id = window.setInterval(() => setCountdown(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
      document.body.style.overflow = "auto";
      lastY.current = 0;
    }
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  useEffect(() => { void startMusic(); }, []);

  useEffect(() => {
    if (!opened) return;
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const fire = () => {
      const now = performance.now();
      if (now - lastBurst.current < 260) return;
      lastBurst.current = now;
      const batch: Spark[] = Array.from({ length: 22 }, (_, i) => {
        sparkId.current += 1;
        const kind: Spark["kind"] = i % 5 === 0 ? "petal" : i % 3 === 0 ? "dot" : "star";
        return {
          id: sparkId.current,
          x: Math.random() * 100,
          drift: (Math.random() - 0.5) * 140,
          size: kind === "petal" ? 12 + Math.random() * 10 : 5 + Math.random() * 9,
          delay: Math.random() * 0.14,
          kind,
        };
      });
      setSparks((prev) => [...prev.slice(-36), ...batch]);
      setFlash(true);
      window.setTimeout(() => setFlash(false), 420);
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id > sparkId.current - 80));
      }, 1300);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current + 4) fire();
      lastY.current = y;
      const hero = heroRef.current;
      if (hero) hero.style.setProperty("--py", `${Math.min(y, 700) * 0.28}px`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [opened]);

  async function startMusic() {
    if (!audio.current || !wedding.musicUrl) return;
    try {
      await audio.current.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  }

  async function toggleMusic() {
    if (!audio.current || !wedding.musicUrl) return;
    if (musicOn) {
      audio.current.pause();
      setMusicOn(false);
      return;
    }
    await startMusic();
  }

  function openInvite() {
    if (opening || opened) return;
    setOpening(true);
    void startMusic();
    window.scrollTo(0, 0);
    window.setTimeout(() => setOpened(true), 700);
  }

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      {opened ? (
        <div className="petals" aria-hidden="true">
          {petals.map((petal, i) => (
            <span
              key={i}
              className="petal"
              style={{ left: petal.left, animationDelay: petal.delay, animationDuration: petal.duration, transform: `rotate(${petal.rotate})` }}
            />
          ))}
        </div>
      ) : null}

      <div className={`fx-layer${flash ? " is-flash" : ""}`} aria-hidden="true">
        <div className="fx-shimmer" />
        {sparks.map((spark) => (
          <span
            key={spark.id}
            className={`spark spark--${spark.kind}`}
            style={{
              left: `${spark.x}%`,
              width: spark.size,
              height: spark.size,
              animationDelay: `${spark.delay}s`,
              ["--drift" as string]: `${spark.drift}px`,
            }}
          />
        ))}
      </div>

      <section className={`cover${opening ? " cover--opening" : ""}${opened ? " cover--open" : ""}`} aria-hidden={opened}>
        <div className="cover-orbit" />
        <div className="cover-orbit-2" />
        <div className="cover-glow" />
        <div className="cover-stars" aria-hidden="true">
          {stars.map((star, i) => (
            <span key={i} style={{ left: star.left, top: star.top, animationDelay: star.delay }} />
          ))}
        </div>
        <div className="cover-frame">
          <p className="cover-kicker">SIZ TO‘YIMIZGA</p>
          <div className="cover-title">taklif etilgansiz</div>
          <p className="cover-sub">bir umrlik muhabbat bayramiga</p>
          <div className="cover-seal">{wedding.groom[0]} <i>&</i> {wedding.bride[0]}</div>
          <button type="button" onClick={openInvite} className="open-button">Ochish</button>
          <div className="cover-names">
            <em>muhabbat ila,</em>
            <strong>{names}</strong>
          </div>
        </div>
      </section>

      <audio ref={audio} src={wedding.musicUrl || undefined} autoPlay loop />
      <button
        className={`music-float${musicOn ? " is-on" : ""}`}
        onClick={toggleMusic}
        aria-label="Musiqani yoqish yoki to‘xtatish"
        title={wedding.musicUrl ? "Musiqa" : "Musiqa fayli qo‘shilganda faollashadi"}
      >
        {musicOn ? <Pause size={17} /> : <Music2 size={17} />}
        <span>{musicOn ? "Pauza" : "Musiqa"}</span>
      </button>

      <section className="hero" ref={heroRef}>
        <Image priority fill sizes="100vw" src={gallery[0]} alt="Samar va Madina to‘y fotosurati" className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-ring" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">We are getting married</p>
          <h1>
            {wedding.groom}
            <span>&</span>
            {wedding.bride}
          </h1>
          <p className="hero-date">{wedding.displayDate}</p>
          <p className="hero-note">Sizni baxtli kunimizda kutib qolamiz</p>
          <span className="scroll-cue">pastga aylantiring<i /></span>
        </div>
      </section>

      <section className="section invitation-message reveal" data-reveal>
        <Ornament />
        <p className="eyebrow">Siz uchun</p>
        <h2>Assalomu alaykum!</h2>
        <div className="gold-line" />
        <p>
          Hayotimizdagi eng go‘zal kunlardan birini siz bilan birga nishonlashni istaymiz.
          Sizni to‘yimizga chin dildan taklif qilamiz — qadamingiz muborak bo‘lsin.
        </p>
        <div className="script-sign">{wedding.groom} <small>&</small> {wedding.bride}</div>
      </section>

      <section className="section countdown-section reveal" data-reveal>
        <p className="eyebrow">Qolgan vaqt</p>
        <h2>Katta kunimizgacha</h2>
        <div className="gold-line" />
        {countdown.done ? (
          <p className="complete">Bugun bizning eng baxtli kunimiz ✦</p>
        ) : (
          <div className="countdown">
            {([["days", "Kunlar"], ["hours", "Soatlar"], ["minutes", "Daqiqalar"], ["seconds", "Soniya"]] as const).map(([key, label]) => (
              <div key={key}>
                <strong>{String(countdown[key]).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section details reveal" data-reveal>
        <p className="eyebrow">Marosim tafsilotlari</p>
        <h2>Sizni kutamiz</h2>
        <div className="gold-line" />
        <div className="detail-grid">
          <article>
            <CalendarDays />
            <span>Sana</span>
            <strong>{wedding.displayDate}</strong>
          </article>
          <article>
            <Clock3 />
            <span>Vaqt</span>
            <strong>{wedding.time}</strong>
          </article>
          <article>
            <MapPin />
            <span>Manzil</span>
            <strong>{wedding.venue}</strong>
            <em>{wedding.city}</em>
          </article>
        </div>
        <div className="actions">
          <a href={wedding.mapsUrl} target="_blank" rel="noreferrer" className="map-link">
            <MapPin size={16} /> Xaritada ko‘rish
          </a>
          <a href={calendarUrl} target="_blank" rel="noreferrer" className="cal-link">
            <CalendarPlus size={16} /> Taqvimga qo‘shish
          </a>
        </div>
      </section>

      <section className="section program reveal" data-reveal>
        <p className="eyebrow">Kechasi</p>
        <h2>Dastur</h2>
        <div className="gold-line" />
        <div className="panel">
          <ul className="timeline">
            <li><time>18:00</time><div><strong>Mehmonlar qabul</strong><span>Iltifot va kutib olish</span></div></li>
            <li><time>18:30</time><div><strong>Nikoh marosimi</strong><span>Duo va tilaklar</span></div></li>
            <li><time>19:30</time><div><strong>Bazm</strong><span>Kecha, raqs va shodlik</span></div></li>
          </ul>
        </div>
      </section>

      <footer className="footer reveal" data-reveal>
        <div className="mono">{wedding.groom[0]}&{wedding.bride[0]}</div>
        <p>Siz bilan ko‘rishguncha</p>
        <small>{wedding.displayDate} · {wedding.city}</small>
      </footer>
    </main>
  );
}
