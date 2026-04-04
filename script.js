document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when clicking a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });

    // Active Navigation on Scroll & Fuse animation
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    const fuseContainer = document.getElementById('fuse');
    const spark = document.getElementById('spark');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });

        // Fuse animation on scroll
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        
        if (fuseContainer && spark) {
            if (scrolled > 0.01) {
                fuseContainer.style.width = (scrolled * 100) + '%';
                spark.style.opacity = '1';
                spark.style.left = `calc(${scrolled * 100}% - 6px)`;
            } else {
                fuseContainer.style.width = '0%';
                spark.style.opacity = '0';
            }
        }
    });

    // Typing effect for subtitle
    const textElt = document.querySelector('.typing-effect');
    if (textElt) {
        const textToType = textElt.innerText;
        textElt.innerText = '';
        let i = 0;
        
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (i < textToType.length) {
                    textElt.innerText += textToType.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
        }, 1000);
    }

    // Formulaire de mission - Envoi vers Google Sheets
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNqwSTjq5wQhhSivKchbf1MSCBpp1J6w18Q2TtMQTlE3WgDHqMdFQIV1KFYbownuT1Vw/exec";
    
    const form = document.getElementById('mission-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.querySelector('.btn-submit');
            const originalText = btn.innerText;
            btn.innerText = "TRANSMISSION EN COURS...";
            
            // Récupération des données du formulaire
            const nom = document.getElementById('nom').value;
            const dateHeure = document.getElementById('date-heure').value;
            const message = document.getElementById('message').value;

            // Préparation des données pour l'envoi réel
            const formData = new FormData();
            formData.append('nom', nom);
            formData.append('date_heure', dateHeure);
            formData.append('message', message);

            // Envoi réel vers Google Sheets
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Évite les erreurs de sécurité entre domaines (CORS)
                body: formData
            })
            .then(() => {
                // Succès (avec no-cors, la réponse est "opaque" donc ne renvoie pas d'erreur réseau si le message est passé)
                onSuccess(btn, originalText);
            })
            .catch(error => {
                console.error("Erreur lors de la transmission :", error);
                btn.innerText = "ÉCHEC DE TRANSMISSION";
                btn.style.backgroundColor = "gray";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "";
                }, 3000);
            });
        });

        // Fonction d'animation de succès (réutilisée pour le vrai et faux succès)
        function onSuccess(btn, originalText) {
            form.reset();
            btn.innerText = "MISSION ACCEPTÉE √";
            btn.style.backgroundColor = "#b30000"; // Rouge foncé
            formStatus.classList.remove('hidden');
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = ""; // Reset couleur
                formStatus.classList.add('hidden');
            }, 5000);
        }
    }

    // Glitch effect on hover for the main button
    const heroBtn = document.querySelector('.hero .btn-primary');
    if(heroBtn) {
        heroBtn.addEventListener('mouseover', () => {
            heroBtn.style.transform = `scale(1.05) translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        });
        heroBtn.addEventListener('mouseout', () => {
            heroBtn.style.transform = `scale(1) translate(0px, 0px)`;
        });
    }
});
