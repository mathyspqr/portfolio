"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [activeTab, setActiveTab] = useState("professional");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const [activeProject, setActiveProject] = useState(null);

  const accueilRef = useRef<HTMLElement>(null);
  const projetsRef = useRef<HTMLElement>(null);
  const aproposRef = useRef<HTMLElement>(null);
  const parcoursRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      const sections = [
        { id: "accueil", ref: accueilRef, position: accueilRef.current?.offsetTop || 0 },
        { id: "projets", ref: projetsRef, position: projetsRef.current?.offsetTop || 0 },
        { id: "apropos", ref: aproposRef, position: aproposRef.current?.offsetTop || 0 },
        { id: "parcours", ref: parcoursRef, position: parcoursRef.current?.offsetTop || 0 },
        { id: "contact", ref: contactRef, position: contactRef.current?.offsetTop || 0 },
      ];

      let activeId = sections[0].id;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].position - 100) {
          activeId = sections[i].id;
          break;
        }
      }

      setActiveSection(activeId);
    };

    // Exécuter au chargement et sur scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    localStorage.setItem("darkMode", String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    } else if (id === 'accueil') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        loading: false,
        success: false,
        error: "Veuillez remplir tous les champs du formulaire"
      });
      return;
    }

    setFormStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite lors de l'envoi du formulaire");
      }

      setFormData({ name: '', email: '', message: '' });
      setFormStatus({
        loading: false,
        success: true,
        error: null
      });

      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-hidden">
      {/* Navigation flottante */}
      <div className="fixed top-6 right-6 z-20 flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-black/[.05] dark:bg-white/[.08] hover:bg-black/[.08] dark:hover:bg-white/[.15] transition-colors"
          aria-label="Basculer le mode sombre"
        >
          {darkMode ? (
            <motion.svg
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </motion.svg>
          ) : (
            <motion.svg
              initial={{ rotate: 30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </motion.svg>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section ref={accueilRef} id="accueil" className="min-h-screen flex items-center px-6 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <div className="mb-6">
                <span className="text-lg font-medium text-blue-500">Bienvenue sur mon portfolio</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Je suis <span className="text-blue-500">Mathys</span>, <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Développeur Full-Stack</span>
              </h1>
              <p className="text-lg mb-8 text-foreground/80 max-w-md">
                Je transforme des idées en expériences web performantes et intuitives,
                alliant créativité technique et design moderne.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/CV.pdf"
                  download
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
                >
                  Télécharger mon CV
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projets"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('projets');
                  }}
                  className="rounded-full border border-solid border-blue-500/30 dark:border-blue-500/50 transition-colors flex items-center justify-center bg-transparent text-blue-500 hover:bg-blue-500/10 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
                >
                  Voir mes projets
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-black/[.08] dark:border-white/[.145]">
                <Image src="/vercel.svg" alt="Avatar" fill className="object-cover" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
                {/* Ajout d'un élément décoratif */}
                <motion.div
                  className="absolute -bottom-3 -right-3 w-16 h-16 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diviseur avec vagues */}
      <div className="relative h-24 bg-transparent -mt-24">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 74V22.8607C1268.04 50.1117 1112.42 69.2805 961.759 74C809.884 78.7532 662.997 62.1508 506.857 37.7111C350.696 13.2668 184.407 -3.12894 0 0.968603V74H1440Z"
            fill="currentColor"
            className="text-black/[.02] dark:text-white/[.02]"
          />
        </svg>
      </div>

      {/* Projets Section */}
      <section ref={projetsRef} id="projets" className="py-16 px-6 bg-black/[.02] dark:bg-white/[.02] relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Projets scolaires et personnels
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Projet 2 */}
            <motion.div
              className="group cursor-pointer h-full"
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() =>
                setActiveProject({
                  title: "Application Infirmière à Domicile",
                  description:
                    "Application web pour un cabinet d&apos;infirmières avec gestion d&apos;agenda, cartographie et itinéraires optimisés.",
                  features: [
                    "Gestion d'agenda pour les soignants",
                    "Cartographie des patients",
                    "Calcul d'itinéraires optimisés",
                  ],
                  technologies: ["Angular", "Express.js", "MySQL"],
                })
              }
            >
              <div className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10 flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/infirmiere-app.jpg"
                    alt="Projet Infirmière"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Badge "Voir le projet" */}
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    Voir le projet
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Application Infirmière à Domicile</h3>
                  <p className="text-foreground/80 mb-4 flex-grow">
                    Application web pour un cabinet d&apos;infirmières avec gestion d&apos;agenda, cartographie et itinéraires optimisés.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Angular
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Express.js
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      MySQL
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projet 3 */}
            <motion.div
              className="group cursor-pointer h-full"
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() =>
                setActiveProject({
                  title: "Système de Quizz (type Kahoot)",
                  description:
                    "Application web pour créer et participer à des quizz interactifs, similaire à Kahoot, avec gestion en temps réel.",
                  features: [
                    "Création et gestion de quizz",
                    "Participation en temps réel via WebSockets",
                    "Interface utilisateur moderne",
                  ],
                  technologies: ["Angular", "Express.js", "MySQL", "Docker"],
                })
              }
            >
              <div className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10 flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/quiz-app.jpg"
                    alt="Projet Quizz"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Badge "Voir le projet" */}
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    Voir le projet
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Système de Quizz (type Kahoot)</h3>
                  <p className="text-foreground/80 mb-4 flex-grow">
                    Application web pour créer et participer à des quizz interactifs, avec gestion en temps réel.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Angular
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Express.js
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      MySQL
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Docker
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projet 4 */}
            <motion.div
              className="group cursor-pointer h-full"
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() =>
                setActiveProject({
                  title: "Spotilike",
                  description:
                    "Reproduction de l&apos;application Spotify, permettant de gérer des playlists et écouter de la musique.",
                  features: [
                    "Gestion des playlists",
                    "Lecture de musique",
                    "Interface utilisateur inspirée de Spotify",
                  ],
                  technologies: ["Angular", "AdonisJS", "Docker"],
                })
              }
            >
              <div className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10 flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="/spotify-clone.jpg"
                    alt="Projet Spotilike"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Badge "Voir le projet" */}
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    Voir le projet
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Spotilike</h3>
                  <p className="text-foreground/80 mb-4 flex-grow">
                    Reproduction de l&apos;application Spotify, permettant de gérer des playlists et écouter de la musique.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Angular
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      AdonisJS
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">
                      Docker
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Carte "Et plus encore..." */}
            <motion.div
              className="group cursor-pointer h-full col-span-1 md:col-span-3 lg:col-span-3"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] border-dashed transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10 flex flex-col h-full min-h-[200px] bg-gradient-to-br from-transparent to-black/[.02] dark:to-white/[.03]">
                <div className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                  <div className="mb-4 bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Et bien plus encore...</h3>
                  <p className="text-foreground/70 mb-4">
                    J&apos;ai réalisé de nombreux autres projets scolaires et personnels. Retrouvez tous mes travaux sur GitHub !                </p>
                  <motion.a
                    href="https://github.com/mathyspqr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 mt-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      Voir sur GitHub
                    </span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diviseur avec vagues */}
      <div className="relative h-24 bg-transparent">
        <svg
          className="absolute top-0 left-0 w-full transform rotate-180"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 74V22.8607C1268.04 50.1117 1112.42 69.2805 961.759 74C809.884 78.7532 662.997 62.1508 506.857 37.7111C350.696 13.2668 184.407 -3.12894 0 0.968603V74H1440Z"
            fill="currentColor"
            className="text-black/[.02] dark:text-white/[.02]"
          />
        </svg>
      </div>

      {/* À propos Section - Réorganisée */}
      <section ref={aproposRef} id="apropos" className="py-16 px-6 relative">
        <div className="absolute bottom-0 left-0 -translate-x-1/4 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold mb-12 text-center"
          >
            À propos de moi
          </motion.h2>

          {/* Partie Présentation distincte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">Présentation</h3>
            <div className="max-w-3xl mx-auto">
              <p className="mb-6 text-foreground/80 text-center">
                Développeur web passionné avec une solide expérience dans la création d&apos;applications web modernes et
                performantes. Spécialisé dans les technologies JavaScript et les frameworks modernes comme React et Next.js.
              </p>

              {/* Atouts en badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  Autonome
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  Créatif
                </span>
                <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  Orienté solution
                </span>
                <span className="px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                    <line x1="6" y1="9" x2="6" y2="21"></line>
                  </svg>
                  Esprit d&apos;équipe
                </span>
              </div>

              {/* Bouton "Contactez-moi" */}
              <div className="flex justify-center">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
                >
                  Contactez-moi
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Séparateur visuel */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto my-10"></div>

          {/* Partie Compétences - Refonte */}
          <h3 className="text-2xl font-semibold mb-8 text-center">Compétences techniques</h3>

          {/* Technologies maîtrisées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-10 bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6"
          >
            <h4 className="text-lg font-medium mb-4 text-blue-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span>Technologies maîtrisées</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frontend */}
              <div className="bg-black/[.01] dark:bg-white/[.02] p-4 rounded-lg">
                <h5 className="font-medium mb-3 pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="M2 9l10-7 10 7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6"></path>
                    <path d="M9 22V12H15V22"></path>
                  </svg>
                  <span>Frontend</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    HTML/CSS
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    TailwindCSS
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    JavaScript
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    TypeScript
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                    </svg>
                    Angular
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                    React (notions)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Vue.js (notions)
                  </span>
                </div>
              </div>

              {/* Backend */}
              <div className="bg-black/[.01] dark:bg-white/[.02] p-4 rounded-lg">
                <h5 className="font-medium mb-3 pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
                    <line x1="8" y1="16" x2="8.01" y2="16"></line>
                    <line x1="8" y1="20" x2="8.01" y2="20"></line>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    <line x1="12" y1="22" x2="12.01" y2="22"></line>
                    <line x1="16" y1="16" x2="16.01" y2="16"></line>
                    <line x1="16" y1="20" x2="16.01" y2="20"></line>
                  </svg>
                  <span>Backend</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M12 18H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4"></path>
                      <circle cx="16" cy="18" r="3"></circle>
                    </svg>
                    Node.js
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <polyline points="16 3 21 3 21 8"></polyline>
                      <line x1="4" y1="20" x2="21" y2="3"></line>
                      <polyline points="21 16 21 21 16 21"></polyline>
                      <line x1="15" y1="15" x2="21" y2="21"></line>
                      <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                    ExpressJS
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    AdonisJS
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    RedwoodJS (notions)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    GraphQL (notions)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <line x1="22" y1="12" x2="2" y2="12"></line>
                      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                    </svg>
                    API REST
                  </span>
                </div>
              </div>

              {/* Bases de données */}
              <div className="bg-black/[.01] dark:bg-white/[.02] p-4 rounded-lg">
                <h5 className="font-medium mb-3 pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  <span>Bases de données</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"></path>
                      <path d="M9 22V12H15V22"></path>
                    </svg>
                    MySQL
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    Supabase
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="22" y1="12" x2="18" y2="12"></line>
                      <line x1="6" y1="12" x2="2" y2="12"></line>
                      <line x1="12" y1="6" x2="12" y2="2"></line>
                      <line x1="12" y1="22" x2="12" y2="18"></line>
                    </svg>
                    MongoDB (notions)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    PostgreSQL (notions)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <rect x="9" y="9" width="6" height="6"></rect>
                    </svg>
                    SQLite
                  </span>
                </div>
              </div>

              {/* Outils / DevOps */}
              <div className="bg-black/[.01] dark:bg-white/[.02] p-4 rounded-lg">
                <h5 className="font-medium mb-3 pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <span>Outils & Environnement</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                      <circle cx="18" cy="18" r="3"></circle>
                      <circle cx="6" cy="6" r="3"></circle>
                      <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                      <line x1="6" y1="9" x2="6" y2="21"></line>
                    </svg>
                    Git
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                    Docker
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    Postman
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    JWT Auth
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    WebSockets
                  </span>
                </div>
              </div>

              {/* Développement mobile */}
              <div className="bg-black/[.01] dark:bg-white/[.02] p-4 rounded-lg md:col-span-2">
                <h5 className="font-medium mb-3 pb-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <span>Développement mobile</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <polygon points="13 19 22 12 13 5 13 19"></polygon>
                      <polygon points="2 19 11 12 2 5 2 19"></polygon>
                    </svg>
                    Kotlin (bases)
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-black/[.05] dark:bg-white/[.06] flex items-center gap-1.5 text-sm opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    React Native (bases)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Soft skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6"
          >
            <h4 className="text-lg font-medium mb-4 text-blue-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Soft skills professionnelles</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/[.02] dark:bg-white/[.03] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span className="font-medium">Autonomie & Initiative</span>
                </div>
                <p className="text-foreground/80 text-sm">Capacité à mener un projet de A à Z avec peu de supervision</p>
              </div>

              <div className="bg-black/[.02] dark:bg-white/[.03] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span className="font-medium">Communication</span>
                </div>
                <p className="text-foreground/80 text-sm">Bonne vulgarisation des enjeux techniques auprès d&apos;équipes non-tech</p>
              </div>


              <div className="bg-black/[.02] dark:bg-white/[.03] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <span className="font-medium">Résolution de problèmes</span>
                </div>
                <p className="text-foreground/80 text-sm">Approche analytique et orientation solution</p>
              </div>

              <div className="bg-black/[.02] dark:bg-white/[.03] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                    <line x1="6" y1="9" x2="6" y2="21"></line>
                  </svg>
                  <span className="font-medium">Esprit d&apos;équipe</span>
                </div>
                <p className="text-foreground/80 text-sm">Habitué à travailler en méthode agile (daily, sprint, trello/jira)</p>
              </div>


              <div className="bg-black/[.02] dark:bg-white/[.03] p-3 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                  <span className="font-medium">Veille technologique</span>
                </div>
                <p className="text-foreground/80 text-sm">Passionné par les dernières tendances JS, IA et DevOps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diviseur avec vagues */}
      <div className="relative h-24 bg-transparent">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 74V22.8607C1268.04 50.1117 1112.42 69.2805 961.759 74C809.884 78.7532 662.997 62.1508 506.857 37.7111C350.696 13.2668 184.407 -3.12894 0 0.968603V74H1440Z"
            fill="currentColor"
            className="text-black/[.02] dark:text-white/[.02]"
          />
        </svg>
      </div>

      {/* Nouvelle section Parcours */}
      <section ref={parcoursRef} id="parcours" className="py-16 px-6 bg-black/[.02] dark:bg-white/[.02] relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Mon parcours
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center space-x-4 mb-10">
              <button
                onClick={() => setActiveTab('professional')}
                className={`px-5 py-3 rounded-md transition-colors ${activeTab === 'professional'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/[.05] dark:bg-white/[.06] hover:bg-black/[.08] dark:hover:bg-white/[.10]'}`}
              >
                Parcours professionnel
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-5 py-3 rounded-md transition-colors ${activeTab === 'education'
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/[.05] dark:bg-white/[.06] hover:bg-black/[.08] dark:hover:bg-white/[.10]'}`}
              >
                Formation académique
              </button>
            </div>

            {/* Contenu du parcours professionnel */}
            {activeTab === 'professional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6 relative">
                  <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-blue-500/50"></div>
                  <div className="ml-10">
                    <h4 className="text-xl font-semibold mb-2">Développeur Fullstack – COMPANY NAME</h4>
                    <p className="text-sm text-foreground/60 mb-3">Janvier 2022 - Présent</p>
                    <p className="text-foreground/80 mb-4">
                      Conception et développement d&apos;applications web avec React, Next.js et Node.js.
                      Création d&apos;interfaces utilisateur performantes et intuitives. Intégration avec diverses
                      API et services tiers pour offrir des fonctionnalités complètes aux utilisateurs.
                    </p>
                    <ul className="list-disc ml-5 mb-4 text-foreground/70 space-y-1">
                      <li>Développement de nouvelles fonctionnalités pour une application SaaS</li>
                      <li>Optimisation des performances et de l&apos;accessibilité</li>
                      <li>Mise en place de tests automatisés</li>
                      <li>Collaboration avec l&apos;équipe design pour implémenter des interfaces utilisateur</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">React</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Node.js</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">MongoDB</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">TypeScript</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6 relative">
                  <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-blue-500/50"></div>
                  <div className="ml-10">
                    <h4 className="text-xl font-semibold mb-2">Développeur Frontend – COMPANY NAME</h4>
                    <p className="text-sm text-foreground/60 mb-3">Juin 2020 - Décembre 2021</p>
                    <p className="text-foreground/80 mb-4">
                      Développement d&apos;interfaces utilisateur avec Vue.js et Nuxt.js.
                      Intégration d&apos;APIs RESTful et optimisation des performances pour une expérience
                      utilisateur fluide et réactive.
                    </p>
                    <ul className="list-disc ml-5 mb-4 text-foreground/70 space-y-1">
                      <li>Développement de composants UI réutilisables</li>
                      <li>Intégration avec des API backend</li>
                      <li>Optimisation des temps de chargement</li>
                      <li>Adaptation des interfaces pour mobile et tablette</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Vue.js</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">JavaScript</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">CSS</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Vuex</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* Contenu du parcours de formation */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6 relative">
                  <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-blue-500/50"></div>
                  <div className="ml-10">
                    <h4 className="text-xl font-semibold mb-2">Master en Développement Web – ÉCOLE</h4>
                    <p className="text-sm text-foreground/60 mb-3">2018 - 2020</p>
                    <p className="text-foreground/80 mb-4">
                      Spécialisation en développement d&apos;applications web modernes.
                      Formation approfondie sur les frameworks JavaScript et les méthodologies agiles.
                    </p>
                    <ul className="list-disc ml-5 mb-4 text-foreground/70 space-y-1">
                      <li>Spécialisation en applications web avancées</li>
                      <li>Projet de fin d&apos;études: Plateforme e-commerce avec React et Node.js</li>
                      <li>Stage de 6 mois en développement web</li>
                      <li>Certification en Développement Web Full Stack</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">JavaScript</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">React</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Node.js</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">UX/UI</span>
                    </div>
                  </div>
                </div>


                <div className="bg-black/[.03] dark:bg-white/[.04] rounded-lg p-6 relative">
                  <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-blue-500/50"></div>
                  <div className="ml-10">
                    <h4 className="text-xl font-semibold mb-2">Licence en Informatique – UNIVERSITÉ</h4>
                    <p className="text-sm text-foreground/60 mb-3">2015 - 2018</p>
                    <p className="text-foreground/80 mb-4">
                      Formation généraliste en informatique avec spécialisation en développement logiciel.
                      Projets pratiques de programmation et bases de données, acquisition des fondamentaux
                      de l&apos;algorithmique et des structures de données.
                    </p>
                    <ul className="list-disc ml-5 mb-4 text-foreground/70 space-y-1">
                      <li>Fondamentaux de la programmation et des algorithmes</li>
                      <li>Bases de données relationnelles et SQL</li>
                      <li>Développement d&apos;applications Java</li>
                      <li>Introduction au développement web</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Java</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">SQL</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">Algo</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/[.05] dark:bg-white/[.06]">HTML/CSS</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Diviseur avec vagues - Entre Parcours et Contact */}
      <div className="relative h-24 bg-transparent">
        <svg
          className="absolute top-0 left-0 w-full transform rotate-180"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 74V22.8607C1268.04 50.1117 1112.42 69.2805 961.759 74C809.884 78.7532 662.997 62.1508 506.857 37.7111C350.696 13.2668 184.407 -3.12894 0 0.968603V74H1440Z"
            fill="currentColor"
            className="text-black/[.02] dark:text-white/[.02]"
          />
        </svg>
      </div>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-16 px-6 relative">
        <div className="absolute top-1/2 right-0 transform translate-x-1/4 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Me contacter
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-md mx-auto"
          >
            {formStatus.success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                Votre message a été envoyé avec succès ! Je vous répondrai dès que possible.
              </div>
            )}

            {formStatus.error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {formStatus.error}
              </div>
            )}

            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label htmlFor="name" className="block mb-2 font-medium">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre message..."
                ></textarea>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={formStatus.loading}
                className="w-full rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium h-12 px-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formStatus.loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Navigation du bas */}
      <div className="fixed bottom-6 left-0 w-full z-10 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full py-3 px-6 flex gap-8 shadow-lg pointer-events-auto"
        >
          <a
            href="#accueil"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('accueil');
            }}
            className={`flex items-center transition-colors hover:text-blue-500 ${activeSection === "accueil" ? "text-blue-500" : ""
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </a>

          <a
            href="#projets"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('projets');
            }}
            className={`flex items-center transition-colors hover:text-blue-500 ${activeSection === "projets" ? "text-blue-500" : ""
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </a>

          <a
            href="#apropos"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('apropos');
            }}
            className={`flex items-center transition-colors hover:text-blue-500 ${activeSection === "apropos" ? "text-blue-500" : ""
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
            </svg>
          </a>

          <a
            href="#parcours"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('parcours');
            }}
            className={`flex items-center transition-colors hover:text-blue-500 ${activeSection === "parcours" ? "text-blue-500" : ""
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
            className={`flex items-center transition-colors hover:text-blue-500 ${activeSection === "contact" ? "text-blue-500" : ""
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-foreground/80">© {new Date().getFullYear()} Mathys. Tous droits réservés.</div>
          <div className="flex gap-6">
            <motion.a
              href="https://www.linkedin.com/in/mathys-paquereau-461924232/"
              className="hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </motion.a>

            <motion.a
              href="https://github.com/mathyspqr"
              className="hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </motion.a>
          </div>
        </div>
      </footer>

      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveProject(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeProject.title}</h3>
              <button
                onClick={() => setActiveProject(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">{activeProject.description}</p>

              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fonctionnalités principales :</h4>
              <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                {activeProject.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies utilisées :</h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => setActiveProject(null)}
              >
                Fermer
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
