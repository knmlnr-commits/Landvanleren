import React from "react";
import { Link } from "react-router-dom";
import WillowBand from "../shared/WillowBand.jsx";

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #c9dfb8 0%, #dde9c8 30%, #efe9d2 100%)",
  },
  content: {
    position: "relative", zIndex: 2,
    maxWidth: 760, margin: "0 auto",
    padding: "200px 22px 24px",
  },
  back: {
    color: "#3a5a2a", textDecoration: "none", fontSize: 14,
    background: "rgba(253, 250, 242, 0.78)",
    padding: "6px 12px", borderRadius: 999,
    fontWeight: 600, display: "inline-block", marginBottom: 14,
    border: "1px solid #cadeb4", fontFamily: "Georgia, serif",
  },
  hero: { textAlign: "center", marginBottom: 28 },
  title: {
    fontSize: 44, margin: "0 0 8px",
    color: "#3a5a2a",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: "italic", fontWeight: 700,
    letterSpacing: -0.5,
    textShadow: "0 2px 0 rgba(255, 255, 255, 0.55)",
    lineHeight: 1.1,
  },
  tagline: {
    fontSize: 17, color: "#5a6a4a",
    margin: 0, fontStyle: "italic",
  },
  section: {
    background: "#fdfaf2",
    borderRadius: 22,
    padding: "20px 22px",
    marginBottom: 16,
    border: "2px solid #cadeb4",
    boxShadow: "0 6px 18px rgba(58, 90, 42, 0.10), inset 0 0 0 1px rgba(255,255,255,0.6)",
    animation: "pop-in 0.4s ease-out",
  },
  sectionTitle: {
    fontSize: 22, margin: "0 0 10px",
    color: "#3a5a2a", fontFamily: "Georgia, serif",
    fontStyle: "italic", fontWeight: 700,
  },
  para: {
    color: "#3a4a2a", lineHeight: 1.6,
    fontSize: 15, margin: "0 0 10px",
  },
  list: {
    margin: 0, paddingLeft: 22,
    color: "#3a4a2a", lineHeight: 1.7, fontSize: 15,
  },
  contactRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "8px 0", borderBottom: "1px dashed #cadeb4",
  },
  contactLast: { borderBottom: "none" },
  contactName: { fontWeight: 700, color: "#3a5a2a", fontFamily: "Georgia, serif" },
  contactRole: { color: "#5a6a4a", fontSize: 14, marginTop: 2 },
  cta: {
    display: "inline-block",
    background: "#86c060",
    color: "white",
    padding: "10px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    marginTop: 8,
    boxShadow: "0 4px 0 #5a8a4a",
  },
  footer: {
    position: "relative", zIndex: 2,
    textAlign: "center", color: "#5a6a4a",
    fontSize: 13, fontStyle: "italic",
    padding: "24px 16px 28px",
  },
};

export default function VoorLeraren() {
  return (
    <div style={styles.page}>
      <WillowBand />
      <div style={styles.content}>
        <Link to="/" style={styles.back}>← Land van Leren</Link>

        <header style={styles.hero}>
          <h1 style={styles.title}>Voor leraren</h1>
          <p style={styles.tagline}>Over Willow Games en Land van Leren.</p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Wat is Land van Leren?</h2>
          <p style={styles.para}>
            Land van Leren is een groeiende verzameling kleine, leerzame spellen
            voor kinderen op de basisschool. Geen accounts, geen reclame, geen
            cookies; open de site en speel. Werkt op Chromebooks, tablets en
            telefoons, en is te installeren als app op het beginscherm.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Onze visie</h2>
          <p style={styles.para}>
            Met Willow Games willen we eenvoudige, leerzame spellen bouwen
            waarmee kinderen in het primair onderwijs spelenderwijs kunnen
            leren. AI helpt ons om elke ronde nieuwe vragen te genereren die
            passen bij het niveau van de leerling, zodat herspelen leuk blijft
            en kinderen telkens iets nieuws tegenkomen.
          </p>
          <p style={styles.para}>
            Klein gemaakt, door een leerling, voor leerlingen.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>In de klas gebruiken</h2>
          <ul style={styles.list}>
            <li>Geen account of inloggen nodig; gewoon de site openen.</li>
            <li>Per spel kies je het niveau: groep 5 en 6, groep 7 en 8, of middelbaar.</li>
            <li>
              Eén apparaat, meerdere spelers: bij Eilandenavontuur kunnen tot
              vier kinderen samen op één scherm spelen, ieder met eigen naam,
              kleur en vlag. Handig voor een hoekje, een Chromebook of het
              digibord.
            </li>
            <li>
              Als app installeren: op iOS via Safari, deelknop, "Zet op
              beginscherm". Op Android via Chrome, menu, "App installeren" of
              "Toevoegen aan startscherm".
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>De spellen</h2>
          <ul style={styles.list}>
            <li>
              <strong>🏝️ Eilandenavontuur</strong> live; verover de vijf
              eilanden via vragen rond rekenen, topografie, Engels, spelling
              en geschiedenis.
            </li>
            <li>
              <strong>🐻 Beren Leren</strong> binnenkort; in voorbereiding.
            </li>
          </ul>
          <Link to="/" style={styles.cta}>Bekijk de spellen →</Link>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Veiligheid en privacy</h2>
          <ul style={styles.list}>
            <li>Geen tracking, geen analytics, geen cookies.</li>
            <li>Geen logins; geen persoonlijke gegevens van kinderen.</li>
            <li>Geen reclame en geen externe links voor kinderen.</li>
            <li>
              Vragen worden gegenereerd door een AI-model met strenge
              richtlijnen: geen kwetsende, uitsluitende of stereotyperende
              inhoud, en geen culturele, religieuze of politieke
              gevoeligheden.
            </li>
            <li>
              Bij elke storing of vreemde uitkomst valt het spel terug op een
              vooraf gecontroleerde vragenbank, zodat de les altijd
              doorgaat.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact</h2>
          <div style={styles.contactRow}>
            <span style={{ fontSize: 28 }}>🌿</span>
            <div>
              <div style={styles.contactName}>Wilgje Molenaar</div>
              <div style={styles.contactRole}>Maker, Willow Games</div>
            </div>
          </div>
          <div style={{ ...styles.contactRow, ...styles.contactLast }}>
            <span style={{ fontSize: 28 }}>🛠️</span>
            <div>
              <div style={styles.contactName}>Koen Molenaar</div>
              <div style={styles.contactRole}>Technisch contact</div>
            </div>
          </div>
        </section>
      </div>
      <div style={styles.footer}>🌿 Willow Games • © 2026</div>
    </div>
  );
}
