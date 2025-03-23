// Show loading overlay on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 2500);
});

// Voice Typing Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

document.getElementById('voiceName').addEventListener('click', () => {
    recognition.start();
    recognition.onresult = (event) => {
        document.getElementById('name').value = event.results[0][0].transcript;
    };
});

document.getElementById('voiceDate').addEventListener('click', () => {
    recognition.start();
    recognition.onresult = (event) => {
        const spokenDate = event.results[0][0].transcript.replace(/\s+/g, '-');
        const date = new Date(spokenDate);
        if (!isNaN(date)) {
            document.getElementById('birthdate').value = date.toISOString().split('T')[0];
        } else {
            alert("Please say a valid date (e.g., 'January 1st 1990')");
        }
    };
});

// Form Submission
document.getElementById('numerologyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim().toLowerCase();
    const birthdate = document.getElementById('birthdate').value;

    if (!name || !birthdate) {
        document.getElementById('result').innerHTML = "Error: Please provide both name and birthdate.";
        document.getElementById('result').style.display = 'block';
        return;
    }

    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';

    setTimeout(() => {
        const { lifePathNumber, lifePathSteps } = calculateLifePathNumber(birthdate);
        const { destinyNumber, destinySteps } = calculateDestinyNumber(name);
        const { soulUrgeNumber, soulUrgeSteps } = calculateSoulUrgeNumber(name);
        const { heartDesireNumber, heartDesireSteps } = calculateHeartDesireNumber(name);
        const { dreamNumber, dreamSteps } = calculateDreamNumber(name);
        const { personalityNumber, personalitySteps } = calculatePersonalityNumber(name);

        const steps = `
            <strong>1. Life Path Number:</strong><br>${lifePathSteps.en}<br>Result = ${lifePathNumber}<br><br>
            <strong>2. Destiny Number:</strong><br>${destinySteps.en}<br>Result = ${destinyNumber}<br><br>
            <strong>3. Soul Urge Number:</strong><br>${soulUrgeSteps.en}<br>Result = ${soulUrgeNumber}<br><br>
            <strong>4. Heart's Desire Number:</strong><br>${heartDesireSteps.en}<br>Result = ${heartDesireNumber}<br><br>
            <strong>5. Dream Number:</strong><br>${dreamSteps.en}<br>Result = ${dreamNumber}<br><br>
            <strong>6. Personality Number:</strong><br>${personalitySteps.en}<br>Result = ${personalityNumber}<br>
        `;

        const numbers = { lifePathNumber, destinyNumber, soulUrgeNumber, heartDesireNumber, dreamNumber, personalityNumber };
        const { traits, characterType } = analyzeNumbers(numbers);

        if (!traits || !characterType) {
            document.getElementById('result').innerHTML = "Error: Unable to calculate traits.";
            document.getElementById('result').style.display = 'block';
            overlay.style.display = 'none';
            return;
        }

        const timeline = `
            <div class="stage"><strong>Early Life (0-25):</strong> ${traits.lifeStages.en.early} | ${traits.lifeStages.si.early}</div>
            <div class="stage"><strong>Mid Life (25-50):</strong> ${traits.lifeStages.en.mid} | ${traits.lifeStages.si.mid}</div>
            <div class="stage"><strong>Later Life (50+):</strong> ${traits.lifeStages.en.later} | ${traits.lifeStages.si.later}</div>
        `;

        document.getElementById('calculationSteps').innerHTML = steps;
        document.getElementById('lifePathTimeline').innerHTML = timeline;
        document.getElementById('traits').innerHTML = `
            ${traits.en} | ${traits.si}<br><br>
            <strong>Education:</strong> ${traits.details.en.education} | ${traits.details.si.education}<br>
            <strong>Love:</strong> ${traits.details.en.love} | ${traits.details.si.love}<br>
            <strong>Marriage:</strong> ${traits.details.en.marriage} | ${traits.details.si.marriage}<br>
            <strong>Human Relationships:</strong> ${traits.details.en.relationships} | ${traits.details.si.relationships}<br>
            <strong>Character Traits:</strong> ${traits.details.en.character} | ${traits.details.si.character}<br>
            <strong>Anger Response:</strong> ${traits.details.en.anger} | ${traits.details.si.anger}<br>
            <strong>Life Challenges:</strong> ${traits.details.en.challenges} | ${traits.details.si.challenges}
        `;
        document.getElementById('characterType').innerHTML = `
            ${characterType.en} | ${characterType.si}<br><br>
            <strong>Description:</strong> ${characterType.details.en.description} | ${characterType.details.si.description}
        `;

        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        overlay.style.display = 'none';
        document.getElementById('backToTop').style.display = 'block';

        anime({
            targets: '#result',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeInOutQuad'
        });

        // Updated PDF Download (English Only, Organized and Varied Layout)
        document.getElementById('downloadPdf').onclick = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Title
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 100); // Dark blue
            doc.text("Numerology Insights", 105, 15, { align: "center" });

            // Header Info
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0); // Black
            doc.text(`Name: ${name}`, 10, 25);
            doc.text(`Birthdate: ${birthdate}`, 10, 32);

            // Section: Calculations
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(70, 130, 180); // Steel blue
            doc.text("Calculations", 10, 45);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const calcLines = doc.splitTextToSize(steps.replace(/<[^>]+>/g, ''), 190);
            let yPos = 52;
            calcLines.forEach(line => {
                if (line.trim().startsWith("1.") || line.trim().startsWith("2.") || line.trim().startsWith("3.") ||
                    line.trim().startsWith("4.") || line.trim().startsWith("5.") || line.trim().startsWith("6.")) {
                    doc.setFont("helvetica", "bold");
                    doc.text(line, 10, yPos);
                    doc.setFont("helvetica", "normal");
                } else {
                    doc.text(line, 10, yPos);
                }
                yPos += 5;
                if (yPos > 270) { // New page if needed
                    doc.addPage();
                    yPos = 20;
                }
            });

            // Section: Life Path Timeline
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(70, 130, 180);
            doc.text("Life Path Timeline", 10, yPos + 10);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const timelineLines = [
                "Early Life (0-25): " + traits.lifeStages.en.early,
                "Mid Life (25-50): " + traits.lifeStages.en.mid,
                "Later Life (50+): " + traits.lifeStages.en.later
            ];
            yPos += 17;
            timelineLines.forEach(line => {
                const splitLine = doc.splitTextToSize(line, 190);
                splitLine.forEach(subLine => {
                    doc.text(subLine, 10, yPos);
                    yPos += 5;
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 2; // Extra spacing between stages
            });

            // Section: Personality Traits
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(70, 130, 180);
            doc.text("Personality Traits", 10, yPos + 10);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const traitsText = [
                traits.en,
                "",
                "Education: " + traits.details.en.education,
                "Love: " + traits.details.en.love,
                "Marriage: " + traits.details.en.marriage,
                "Relationships: " + traits.details.en.relationships,
                "Character Traits: " + traits.details.en.character,
                "Anger Response: " + traits.details.en.anger,
                "Life Challenges: " + traits.details.en.challenges
            ];
            yPos += 17;
            traitsText.forEach(line => {
                const splitLine = doc.splitTextToSize(line, 190);
                splitLine.forEach(subLine => {
                    if (subLine.startsWith("Education:") || subLine.startsWith("Love:") || 
                        subLine.startsWith("Marriage:") || subLine.startsWith("Relationships:") || 
                        subLine.startsWith("Character Traits:") || subLine.startsWith("Anger Response:") || 
                        subLine.startsWith("Life Challenges:")) {
                        doc.setFont("helvetica", "bold");
                        doc.text(subLine, 10, yPos);
                        doc.setFont("helvetica", "normal");
                    } else {
                        doc.text(subLine, 10, yPos);
                    }
                    yPos += 5;
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 2; // Extra spacing between items
            });

            // Section: Character Type
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(70, 130, 180);
            doc.text("Character Type", 10, yPos + 10);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const characterText = [
                characterType.en,
                "",
                "Description: " + characterType.details.en.description
            ];
            yPos += 17;
            characterText.forEach(line => {
                const splitLine = doc.splitTextToSize(line, 190);
                splitLine.forEach(subLine => {
                    if (subLine.startsWith("Description:")) {
                        doc.setFont("helvetica", "bold");
                        doc.text(subLine, 10, yPos);
                        doc.setFont("helvetica", "normal");
                    } else {
                        doc.text(subLine, 10, yPos);
                    }
                    yPos += 5;
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 2;
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100); // Gray
            doc.text("Generated on " + new Date().toLocaleDateString(), 105, 290, { align: "center" });

            // Save PDF
            doc.save(`${name.replace(/\s+/g, '_')}_Numerology.pdf`);
        };
    }, 1500);
});

// Clear Button
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('numerologyForm').reset();
    document.getElementById('result').style.display = 'none';
    document.getElementById('backToTop').style.display = 'none';
});

// Back to Top
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Letter Values
const letterValues = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

// Reduce to Single Digit
function reduceToSingleDigit(num) {
    if (isNaN(num) || num === undefined || num === null) return 1;
    let reduced = num;
    while (reduced > 9) {
        reduced = reduced.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return reduced;
}

// Calculation Functions
function calculateLifePathNumber(birthdate) {
    const digits = birthdate.replace(/-/g, '').split('');
    let total = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
    let enSteps = "Digits: " + (digits.length ? digits.join(" + ") + " = " + total : "No digits");
    const result = reduceToSingleDigit(total);
    return { lifePathNumber: result, lifePathSteps: { en: enSteps } };
}

function calculateDestinyNumber(name) {
    let total = 0, enSteps = "Letters: ";
    name.split('').forEach(char => {
        const value = letterValues[char] || 0;
        if (value) {
            total += value;
            enSteps += `${char} = ${value}, `;
        }
    });
    enSteps = enSteps.slice(0, -2) || "None";
    const result = reduceToSingleDigit(total);
    return { destinyNumber: result, destinySteps: { en: enSteps } };
}

function calculateSoulUrgeNumber(name) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let total = 0, enSteps = "Vowels: ";
    name.split('').forEach(char => {
        if (vowels.includes(char)) {
            const value = letterValues[char];
            total += value;
            enSteps += `${char} = ${value}, `;
        }
    });
    enSteps = enSteps.slice(0, -2) || "None";
    const result = reduceToSingleDigit(total);
    return { soulUrgeNumber: result, soulUrgeSteps: { en: enSteps } };
}

function calculateHeartDesireNumber(name) {
    const { soulUrgeNumber, soulUrgeSteps } = calculateSoulUrgeNumber(name);
    return { heartDesireNumber: soulUrgeNumber, heartDesireSteps: soulUrgeSteps };
}

function calculateDreamNumber(name) {
    const { destinyNumber } = calculateDestinyNumber(name);
    const { soulUrgeNumber } = calculateSoulUrgeNumber(name);
    let total = Math.abs(destinyNumber - soulUrgeNumber);
    let enSteps = `Destiny (${destinyNumber}) - Soul Urge (${soulUrgeNumber}) = ${total}`;
    const result = reduceToSingleDigit(total);
    return { dreamNumber: result, dreamSteps: { en: enSteps } };
}

function calculatePersonalityNumber(name) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let total = 0, enSteps = "Consonants: ";
    name.split('').forEach(char => {
        if (!vowels.includes(char) && letterValues[char]) {
            const value = letterValues[char];
            total += value;
            enSteps += `${char} = ${value}, `;
        }
    });
    enSteps = enSteps.slice(0, -2) || "None";
    const result = reduceToSingleDigit(total);
    return { personalityNumber: result, personalitySteps: { en: enSteps } };
}

function analyzeNumbers(numbers) {
    const { lifePathNumber, destinyNumber, soulUrgeNumber, heartDesireNumber, dreamNumber, personalityNumber } = numbers;
    const validNumbers = [
        lifePathNumber, destinyNumber, soulUrgeNumber, 
        heartDesireNumber, dreamNumber, personalityNumber
    ].map(num => (num === undefined || isNaN(num) || num === null ? 1 : num));
    const avgNumber = reduceToSingleDigit(Math.round(validNumbers.reduce((sum, num) => sum + num, 0) / 6));

    const traitsMap = {
        1: { 
            traits: { 
                en: "Independent, ambitious, and confident.", 
                si: "තනිව කටයුතු කරන, ඉහළ බලාපොරොත්තු ඇති, සහ තමන් ගැන විශ්වාස තබන." 
            },
            characterType: { 
                en: "The Leader", 
                si: "නායකයා" 
            },
            lifeStages: {
                en: {
                    early: "A bold and assertive youth, eager to carve your own path.",
                    mid: "A driven period of leadership and achievement.",
                    later: "A phase of guiding others with your earned wisdom."
                },
                si: {
                    early: "නිර්භීතව තම මාවත හදන තරුණ වියක්. මේ කාලයේ ඔබ තමන්ටම විශේෂ ඉඩක් හදාගන්න උත්සාහ කරනවා.",
                    mid: "නායකත්වයෙන් හා ජයග්‍රහණවලින් පිරුණු කාලයක්. ඔබ මෙහිදී ඉහළට යන්න බලාපොරොත්තු වෙනවා.",
                    later: "ලබාගත් ප්‍රඥාවෙන් අන් අයට මඟ පෙන්වන කාලයක්. මෙහිදී ඔබේ අත්දැකීම් අනිත් අයට උපකාරී වෙනවා."
                }
            },
            details: {
                en: {
                    education: "You excel in self-directed studies and leadership-focused subjects.",
                    love: "In love, you seek a partner who respects your independence and ambition.",
                    marriage: "Marriage thrives with mutual respect and space for personal goals.",
                    relationships: "You build strong, respectful connections, often leading the group.",
                    character: "Determined, innovative, and self-reliant.",
                    anger: "When angry, you assert dominance or withdraw to strategize.",
                    challenges: "Balancing independence with teamwork can be difficult."
                },
                si: {
                    education: "තනිව ඉගෙනීමට හා නායකත්වය ගැන විෂයන්ට ඔබ දක්ෂයි. ඔබට තමන්ගේම විදියට දැනුම ලබා ගන්න ලේසියි.",
                    love: "ආදරයේදී ඔබේ තනි බවට හා ඉහළ බලාපොරොත්තුවලට ගරු කරන කෙනෙක් ඔබට ඕනෑ. එය ඔබේ සම්බන්ධතාවට ශක්තියක් වෙනවා.",
                    marriage: "පරස්පර ගෞරවය හා තම ඉලක්කවලට ඉඩ දීමෙන් විවාහය සතුටු වෙනවා. එකිනෙකාට ඉඩ දීම ඔබට වැදගත්.",
                    relationships: "ශක්තිමත්, ගෞරවනීය සම්බන්ධතා හදන ඔබ බොහෝ විට කණ්ඩායමට මඟ පෙන්වනවා. ඔබේ බලය එහිදී පේනවා.",
                    character: "තීරණ ගන්නා, නව මත හදන, තමන්ම රැකබලා ගන්නා. මේ ගති ඔබව වෙනස් කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ බලය පෙන්වනවා හෝ සැලසුම් කරන්න ඈත් වෙනවා. එය ඔබේ තීරණ ගැනීමට උපකාර වෙනවා.",
                    challenges: "තනි බව හා කණ්ඩායම් වැඩ සමබර කිරීම ඔබට අමාරු වෙන්න පුළුවන්. එකට වැඩ කිරීමට ඉගෙන ගන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Leader, you’re a natural pioneer who inspires through action and vision, often taking charge in uncertain times."
                    },
                    si: {
                        description: "නායකයෙක් විදියට ඔබ ක්‍රියාවෙන් හා දැක්මෙන් ආනුභාව දෙන, අවිනිශ්චිත වෙලාවට ඉදිරියෙන් යන ස්වභාවික පෙරළිකරුවෙක්. ඔබේ මේ ගති අන් අයට උදව් වෙනවා."
                    }
                }
            }
        },
        2: { 
            traits: { 
                en: "Cooperative, sensitive, and diplomatic.", 
                si: "එකට වැඩ කරන, හැඟීම් දන්නා, සහ සාමයෙන් කටයුතු කරන." 
            },
            characterType: { 
                en: "The Peacemaker", 
                si: "සාමකරුවා" 
            },
            lifeStages: {
                en: {
                    early: "A gentle and empathetic youth, learning to balance emotions.",
                    mid: "A harmonious period of fostering peace and connections.",
                    later: "A wise phase, mediating and supporting others."
                },
                si: {
                    early: "සුමුදු හා හැඟීම් දන්නා තරුණ වියක්. මෙහිදී ඔබ හැඟීම් තේරුම් ගන්න ඉගෙන ගන්නවා.",
                    mid: "සාමය හා සම්බන්ධතා හදන සතුටු කාලයක්. ඔබ මෙහිදී අන් අය එක්ක එකතු වෙනවා.",
                    later: "බුද්ධිමත්ව අන් අයට උදව් කරන හා සමථයට උදව් කරන කාලයක්. ඔබේ දැනුම මෙහිදී බෙදෙනවා."
                }
            },
            details: {
                en: {
                    education: "You shine in collaborative settings, excelling in arts or humanities.",
                    love: "You seek emotional depth and harmony in love.",
                    marriage: "Marriage thrives on partnership and mutual understanding.",
                    relationships: "You’re a supportive friend, sensitive to others’ needs.",
                    character: "Gentle, intuitive, and patient.",
                    anger: "When angry, you avoid conflict or become quietly resentful.",
                    challenges: "Standing up for yourself and avoiding over-sensitivity."
                },
                si: {
                    education: "එකට වැඩ කරන තැන්වලදී ඔබ දිලිසෙනවා. කලාව හෝ මිනිසුන් ගැන විෂයන්ට ඔබට ලේසියි.",
                    love: "ආදරයේදී ඔබට හැඟීම් ගැඹුර හා සතුට ඕනෑ. එය ඔබේ හදවතට ලඟින් තියෙනවා.",
                    marriage: "එකට වැඩ කිරීම හා එකිනෙකා තේරුම් ගැනීමෙන් විවාහය සතුටු වෙනවා. එකිනෙකාට උදව් කිරීම මෙහිදී වැදගත්.",
                    relationships: "ඔබ උදව් කරන මිතුරෙක්. අන් අයගේ ඕනෑකම් ඔබට තේරෙනවා හා ඒවාට ගරු කරනවා.",
                    character: "සුමුදු, හැඟීමෙන් දන්නා, ඉවසන. මේ ගති ඔබව අන් අයට ලං කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ ගැටුම්වලින් ඈත් වෙනවා හෝ නිහඬව කලකිරෙනවා. එය ඔබේ සාමකාමී බව පෙන්වනවා.",
                    challenges: "තමන් වෙනුවෙන් පෙනී සිටීම හා ඕනෑවට වඩා හැඟීම් තබා ගැනීම වළකන එක. මෙය ඔබට ඉගෙන ගන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Peacemaker, you’re a calming influence, skilled at resolving disputes and fostering unity with your empathy."
                    },
                    si: {
                        description: "සාමකරුවෙක් විදියට ඔබ සන්සුන් බලපෑමක් දෙනවා. ගැටුම් විසඳන්න හා හැඟීමෙන් එකමුතුකම හදන්න ඔබට හැකියි."
                    }
                }
            }
        },
        3: { 
            traits: { 
                en: "Creative, social, and expressive.", 
                si: "නිර්මාණශීලී, යාළුකම් කරන, හා හැඟීම් පෙන්වන." 
            },
            characterType: { 
                en: "The Artist", 
                si: "කලාකරුවා" 
            },
            lifeStages: {
                en: {
                    early: "A vibrant and imaginative youth, exploring creativity.",
                    mid: "A lively period of self-expression and social engagement.",
                    later: "A reflective phase, sharing artistic legacies."
                },
                si: {
                    early: "ජීවත්වන හා කල්පනා කරන තරුණ වියක්. මෙහිදී ඔබ නිර්මාණශීලී බව හොයනවා.",
                    mid: "තම හැඟීම් පෙන්වන හා යාළුකම් කරන ජීවමාන කාලයක්. ඔබ මෙහිදී බොහෝ අය එක්ක එකතු වෙනවා.",
                    later: "ආපසු හැරී බලන, කලා උරුමය බෙදන කාලයක්. ඔබේ නිර්මාණ මෙහිදී අන් අයට ලැබෙනවා."
                }
            },
            details: {
                en: {
                    education: "You excel in creative fields like art, music, or writing.",
                    love: "You crave passion and excitement in romantic relationships.",
                    marriage: "Marriage needs variety and emotional connection to thrive.",
                    relationships: "You’re the life of the party, attracting diverse friends.",
                    character: "Optimistic, charming, and imaginative.",
                    anger: "When angry, you express it dramatically or retreat to create.",
                    challenges: "Maintaining focus and avoiding scattered energy."
                },
                si: {
                    education: "කලාව, සංගීතය, හෝ ලිවීම වගේ නිර්මාණශීලී දේවල්වල ඔබ දක්ෂයි. ඔබට මේවා තුළින් ලොකු දෙයක් කරන්න පුළුවන්.",
                    love: "ආදරයේදී ඔබට උනුසුම හා උද්දීපනය ඕනෑ. එය ඔබේ සම්බන්ධතාව විශේෂ කරනවා.",
                    marriage: "විවිධත්වය හා හැඟීම් සම්බන්ධයෙන් විවාහය සතුටු වෙනවා. එකිනෙකා එක්ක බෙදුණු හැඟීම් වැදගත්.",
                    relationships: "ඔබ සමූහයේ ජීවයයි. විවිධ යාළුවෝ ආකර්ෂණය කරන ඔබ බොහෝ දෙනා එක්ක සතුටින් ඉන්නවා.",
                    character: "බලාපොරොත්තු ඇති, ආකර්ශනීය, කල්පනා කරන. මේ ගති ඔබව ජනප්‍රිය කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ ඒක විශාල ලෙස පෙන්වනවා හෝ නිර්මාණයට යනවා. එය ඔබේ හැඟීම් පෙන්වන විදියයි.",
                    challenges: "එකඟතාව තබා ගන්න එක හා විසිරුණු ශක්තිය වළකන එක. ඔබට එක දෙයකට යොමු වෙන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As an Artist, you bring beauty and inspiration to the world through your unique vision and expressive talents."
                    },
                    si: {
                        description: "කලාකරුවෙක් විදියට ඔබ ලෝකයට සුන්දරත්වය හා ආනුභාවය ගේනවා. ඔබේ විශේෂ දැක්මෙන් හා හැඟීම් පෙන්වන දක්ෂතාවලින් එය කරනවා."
                    }
                }
            }
        },
        4: { 
            traits: { 
                en: "Practical, disciplined, and hardworking.", 
                si: "යථාර්ථවාදී, නීති රීතිවල යන, හා වෙහෙසෙන." 
            },
            characterType: { 
                en: "The Builder", 
                si: "බිල්ඩරයා" 
            },
            lifeStages: {
                en: {
                    early: "A diligent and structured youth, building foundations.",
                    mid: "A steady period of hard work and stability.",
                    later: "A rewarding phase, enjoying the fruits of your labor."
                },
                si: {
                    early: "වෙහෙසෙන හා සැලසුම් ඇති තරුණ වියක්. මෙහිදී ඔබ ජීවිතයට පදනමක් හදනවා.",
                    mid: "ස්ථිරව වෙහෙසෙන කාලයක්. ඔබ මෙහිදී තම ඉලක්ක කරා යනවා.",
                    later: "වෙහෙසට ගෙවුණු ඵල භුක්ති විඳින සතුටු කාලයක්. ඔබේ වෙහෙස මෙහිදී ගෞරවයට පත් වෙනවා."
                }
            },
            details: {
                en: {
                    education: "You thrive in structured, practical learning environments.",
                    love: "You seek reliability and commitment in love.",
                    marriage: "Marriage succeeds with stability and shared responsibilities.",
                    relationships: "You form dependable, long-lasting bonds.",
                    character: "Reliable, methodical, and grounded.",
                    anger: "When angry, you become stubborn or overly critical.",
                    challenges: "Adapting to change and relaxing your strict standards."
                },
                si: {
                    education: "සැලසුම් ඇති, යථාර්ථවාදී ඉගෙනුම් තැන්වල ඔබ සතුටු වෙනවා. ඔබට ප්‍රායෝගික දේ ලේසියි.",
                    love: "ආදරයේදී ඔබට විශ්වාසය හා බැඳීම ඕනෑ. එය ඔබේ සම්බන්ධතාවට ශක්තියක් වෙනවා.",
                    marriage: "ස්ථිර බව හා එකට බෙදුණු වගකීම්වලින් විවාහය ජය ගන්නවා. එකිනෙකාට උදව් කිරීම මෙහිදී වැදගත්.",
                    relationships: "ඔබ විශ්වාස කළ හැකි, දිගු කල් යන බැඳීම් හදනවා. ඔබේ ස්ථිර බව එහිදී පේනවා.",
                    character: "විශ්වාස කළ හැකි, සැලසුම් ඇති, පිහිටවූ. මේ ගති ඔබව ශක්තිමත් කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ තදින් හිටගන්නවා හෝ වැඩියෙන් විවේචනය කරනවා. එය ඔබේ තීරණ ගැනීමට බලපානවා.",
                    challenges: "වෙනසට ගැළපෙන්න හා තද නීති ලිහිල් කරන එක. ඔබට ලිහිල් වෙන්න ඉගෙන ගන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Builder, you create enduring structures and systems with your dedication, leaving a lasting legacy."
                    },
                    si: {
                        description: "බිල්ඩරයෙක් විදියට ඔබ ඔබේ වෙහෙසෙන් දිගු කල් යන දේවල් හා පද්ධති හදනවා. එයින් ඔබ දිගු උරුමයක් තබනවා."
                    }
                }
            }
        },
        5: { 
            traits: { 
                en: "Adventurous, versatile, and freedom-loving.", 
                si: "වික්‍රමශීලී, බොහෝ දේ කළ හැකි, හා නිදහසට ආදරය කරන." 
            },
            characterType: { 
                en: "The Explorer", 
                si: "ගවේෂකයා" 
            },
            lifeStages: {
                en: {
                    early: "A curious and restless youth, eager to explore the world.",
                    mid: "A dynamic period of change, seeking new horizons.",
                    later: "A reflective phase, sharing wisdom from adventures."
                },
                si: {
                    early: "කුතුහලයෙන් හා නිස්සාරණ තරුණ වියක්. මෙහිදී ඔබ ලෝකය හොයන්න යනවා.",
                    mid: "වෙනස් වෙන, නව දේවල් හොයන ජීවමාන කාලයක්. ඔබ මෙහිදී නව අත්දැකීම්වලට යනවා.",
                    later: "ආපසු බලන, වික්‍රමයෙන් ලබපු දැනුම බෙදන කාලයක්. ඔබේ කතා මෙහිදී අන් අයට උදව් වෙනවා."
                }
            },
            details: {
                en: {
                    education: "You thrive in dynamic, hands-on learning environments.",
                    love: "You seek excitement and variety in romantic relationships.",
                    marriage: "Marriage needs flexibility and mutual independence.",
                    relationships: "You connect with diverse people, valuing freedom.",
                    character: "Bold, adaptable, and curious.",
                    anger: "When angry, you act impulsively or seek an escape.",
                    challenges: "Commitment and avoiding restlessness."
                },
                si: {
                    education: "ජීවමාන, අත්දැකීමෙන් ඉගෙනෙන තැන්වල ඔබ සතුටු වෙනවා. ඔබට ප්‍රායෝගික ඉගෙනීම ලේසියි.",
                    love: "ආදරයේදී ඔබට උද්දීපනය හා විවිධත්වය ඕනෑ. එය ඔබේ සම්බන්ධතාව විශේෂ කරනවා.",
                    marriage: "විවාහයට ලිහිල් බව හා එකිනෙකාට නිදහස ඕනෑ. එකිනෙකාට ඉඩ දීම මෙහිදී වැදගත්.",
                    relationships: "ඔබ විවිධ අය එක්ක එකතු වෙනවා. නිදහසට වටිනාකම දෙන ඔබ බොහෝ දෙනා එක්ක සම්බන්ධ වෙනවා.",
                    character: "නිර්භීත, ගැළපෙන, කුතුහලය ඇති. මේ ගති ඔබව වික්‍රමශීලී කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ හදිසියේ හැසිරෙනවා හෝ පැනල යනවා. එය ඔබේ නිදහසට ආදරය පෙන්වනවා.",
                    challenges: "බැඳීම හා නිස්සාරණ බව වළකන එක. ඔබට එක තැනක ඉන්න ඉගෙන ගන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As an Explorer, you’re a trailblazer who thrives on discovery, inspiring others with your fearless pursuit of the unknown."
                    },
                    si: {
                        description: "ගවේෂකයෙක් විදියට ඔබ නව දේ හොයන්න යන, නිර්භීත ලෙස නොදන්නා දේ හොයන, අන් අයට ආනුභාව දෙන පෙරළිකරුවෙක්. ඔබේ ගමන අන් අයට උදව් වෙනවා."
                    }
                }
            }
        },
        6: { 
            traits: { 
                en: "Nurturing, responsible, and harmonious.", 
                si: "සලකන, වගකියන, හා සතුටින් එකට ඉන්නා." 
            },
            characterType: { 
                en: "The Caregiver", 
                si: "සලකන්නා" 
            },
            lifeStages: {
                en: {
                    early: "A caring and supportive youth, building family ties.",
                    mid: "A nurturing period of responsibility and balance.",
                    later: "A fulfilling phase, surrounded by loved ones."
                },
                si: {
                    early: "සලකන හා උදව් කරන තරුණ වියක්. මෙහිදී ඔබ පවුල් බැඳීම් හදනවා.",
                    mid: "වගකීමෙන් හා සමබර බවෙන් යුතු සලකන කාලයක්. ඔබ මෙහිදී අන් අය ගැන හිතනවා.",
                    later: "ආදරය කරන අය එක්ක සතුටින් ඉන්නා සම්පූර්ණ කාලයක්. ඔබේ සලකිල්ල මෙහිදී පේනවා."
                }
            },
            details: {
                en: {
                    education: "You excel in caregiving or community-focused studies.",
                    love: "You seek deep, supportive love with emotional security.",
                    marriage: "Marriage thrives on loyalty and shared duties.",
                    relationships: "You’re a pillar of support in all relationships.",
                    character: "Compassionate, dependable, and balanced.",
                    anger: "When angry, you may guilt-trip or overprotect.",
                    challenges: "Avoiding over-responsibility and setting boundaries."
                },
                si: {
                    education: "සලකන හෝ එකට ඉන්නා දේවල් ගැන ඉගෙනීමට ඔබ දක්ෂයි. ඔබට අන් අයට උදව් කරන දේ ලේසියි.",
                    love: "ආදරයේදී ඔබට ගැඹුරු, උදව් කරන, හැඟීමෙන් ආරක්ෂිත එකක් ඕනෑ. එය ඔබේ හදවතට සතුටක් දෙනවා.",
                    marriage: "විශ්වාසය හා එකට කරන වැඩවලින් විවාහය සතුටු වෙනවා. එකිනෙකාට බැඳීම මෙහිදී වැදගත්.",
                    relationships: "සියලු සම්බන්ධතාවල ඔබ උදව් කරන තුණු පහක් වගේ. ඔබේ සලකිල්ල එහිදී අන් අයට පේනවා.",
                    character: "කරුණාව ඇති, විශ්වාස කළ හැකි, සමබර තබන. මේ ගති ඔබව අන් අයට ලං කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ වරදක් දෙනවා හෝ වැඩිපුර රැකබලනවා. එය ඔබේ සලකිල්ලේ ලකුණක්.",
                    challenges: "වැඩි වගකීමෙන් ඈත් වෙන එක හා සීමා තබන එක. ඔබට තමන් ගැනත් හිතන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Caregiver, you’re a nurturing soul who brings comfort and stability, often the heart of any community."
                    },
                    si: {
                        description: "සලකන්නෙක් විදියට ඔබ සතුටු හා ස්ථිර බව ගේනවා. බොහෝ විට එකට ඉන්නා තැනක හදවත වගේ ඔබ ඉන්නවා."
                    }
                }
            }
        },
        7: { 
            traits: { 
                en: "Introspective, analytical, and spiritual.", 
                si: "තමන් ගැන හිතන, විමර්ශනය කරන, හා ආත්මික." 
            },
            characterType: { 
                en: "The Thinker", 
                si: "හිතන්නා" 
            },
            lifeStages: {
                en: {
                    early: "A thoughtful and inquisitive youth, seeking knowledge.",
                    mid: "A deep period of introspection and discovery.",
                    later: "A wise phase, sharing profound insights."
                },
                si: {
                    early: "හිතන හා හොයන තරුණ වියක්. මෙහිදී ඔබ දැනුමට යනවා.",
                    mid: "තමන් ගැන හිතන හා හොයන ගැඹුරු කාලයක්. ඔබ මෙහිදී ලොකු දේවල් තේරුම් ගන්නවා.",
                    later: "බුද්ධිමත්ව ගැඹුරු දැනුම බෙදන කාලයක්. ඔබේ දැනුම මෙහිදී අන් අයට උදව් වෙනවා."
                }
            },
            details: {
                en: {
                    education: "You excel in philosophy, science, or spiritual studies.",
                    love: "You seek intellectual and spiritual connection in love.",
                    marriage: "Marriage needs depth and mutual growth to succeed.",
                    relationships: "You prefer meaningful, deep connections over many.",
                    character: "Wise, reserved, and insightful.",
                    anger: "When angry, you withdraw to reflect or analyze.",
                    challenges: "Opening up emotionally and avoiding isolation."
                },
                si: {
                    education: "දර්ශනය, විද්‍යාව, හෝ ආත්මික දේවල් ගැන ඉගෙනීමට ඔබ දක්ෂයි. ඔබට ගැඹුරු දේ තේරුම් ගන්න ලේසියි.",
                    love: "ආදරයේදී ඔබට බුද්ධිය හා ආත්මික එකතුව ඕනෑ. එය ඔබේ සම්බන්ධතාවට ගැඹුරක් දෙනවා.",
                    marriage: "ගැඹුරු බව හා එකිනෙකා වැඩෙන එකෙන් විවාහය ජය ගන්නවා. එකිනෙකා එක්ක ඉගෙනීම මෙහිදී වැදගත්.",
                    relationships: "බොහෝ දෙනාට වඩා ගැඹුරු, අර්ථවත් සම්බන්ධතා ඔබට ඕනෑ. ඔබට ලඟින් ඉන්න අය විශේෂයි.",
                    character: "බුද්ධිමත්, සංවර, ගැඹුරු බව දන්නා. මේ ගති ඔබව තේරුම් ගන්නා කෙනෙක් කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ ආපසු යනවා හිතන්න හෝ විමර්ශනය කරන්න. එය ඔබේ බුද්ධිය පෙන්වනවා.",
                    challenges: "හැඟීමෙන් විවෘත වෙන එක හා තනි වෙන එක වළකන එක. ඔබට අන් අය එක්ක ලං වෙන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Thinker, you’re a seeker of truth, offering profound wisdom and clarity through your analytical mind."
                    },
                    si: {
                        description: "හිතන්නෙක් විදියට ඔබ සත්‍යය හොයනවා. ඔබේ විමර්ශනයෙන් ගැඹුරු බුද්ධිය හා පැහැදිලි බව අන් අයට දෙනවා."
                    }
                }
            }
        },
        8: { 
            traits: { 
                en: "Authoritative, goal-oriented, and powerful.", 
                si: "බල ඇති, ඉලක්ක තබන, හා ශක්තිමත්." 
            },
            characterType: { 
                en: "The Achiever", 
                si: "ජයග්‍රාහකයා" 
            },
            lifeStages: {
                en: {
                    early: "An ambitious and determined youth, setting big goals.",
                    mid: "A powerful period of success and influence.",
                    later: "A legacy-building phase, wielding authority wisely."
                },
                si: {
                    early: "ඉහළ බලාපොරොත්තු හා තීරණ ඇති තරුණ වියක්. මෙහිදී ඔබ විශාල ඉලක්ක තබනවා.",
                    mid: "ජයග්‍රහණ හා බලපෑම ඇති ශක්තිමත් කාලයක්. ඔබ මෙහිදී ඉහළට යනවා.",
                    later: "උරුමය හදන, බලය බුද්ධිමත්ව භාවිතා කරන කාලයක්. ඔබේ වෙහෙස මෙහිදී ගෞරවයට පත් වෙනවා."
                }
            },
            details: {
                en: {
                    education: "You excel in business, leadership, or technical fields.",
                    love: "You seek a partner who matches your drive and status.",
                    marriage: "Marriage thrives on shared ambition and respect.",
                    relationships: "You build influential, goal-oriented networks.",
                    character: "Driven, commanding, and resourceful.",
                    anger: "When angry, you assert control or become demanding.",
                    challenges: "Balancing power with humility and avoiding materialism."
                },
                si: {
                    education: "ව්‍යාපාර, නායකත්වය, හෝ තාක්ෂණික දේවල් ගැන ඉගෙනීමට ඔබ දක්ෂයි. ඔබට මේවා තුළින් ලොකු දෙයක් කරන්න පුළුවන්.",
                    love: "ආදරයේදී ඔබේ උත්සාහයට හා තත්ත්වයට ගැළපෙන කෙනෙක් ඔබට ඕනෑ. එය ඔබේ සම්බන්ධතාවට ශක්තියක් දෙනවා.",
                    marriage: "එකට ඉහළ බලාපොරොත්තු හා ගෞරවයෙන් විවාහය සතුටු වෙනවා. එකිනෙකාට ගරු කිරීම මෙහිදී වැදගත්.",
                    relationships: "බල ඇති, ඉලක්ක තබන සම්බන්ධතා ජාලයක් ඔබ හදනවා. ඔබේ බලය එහිදී අන් අයට පේනවා.",
                    character: "උත්සාහ ඇති, බලය පෙන්වන, සම්පත් තබන. මේ ගති ඔබව ජයග්‍රාහකයෙක් කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ පාලනය ගන්නවා හෝ ඉල්ලනවා. එය ඔබේ බලය පෙන්වන විදියයි.",
                    challenges: "බලය හා සරල බව සමබර කරන එක හා භෞතික දේට යෑම වළකන එක. ඔබට සමබරතාව ඉගෙන ගන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As an Achiever, you’re a force of success, turning visions into realities with your relentless determination."
                    },
                    si: {
                        description: "ජයග්‍රාහකයෙක් විදියට ඔබ ජයග්‍රහණයේ බලයක්. ඔබේ නොනවතින තීරණවලින් දැක්ම යථාර්ථයක් කරනවා."
                    }
                }
            }
        },
        9: { 
            traits: { 
                en: "Compassionate, idealistic, and generous.", 
                si: "කරුණාව ඇති, ඉහළ බලාපොරොත්තු තබන, හා දෙන." 
            },
            characterType: { 
                en: "The Humanitarian", 
                si: "මිනිසුන්ට ආදරය කරන්නා" 
            },
            lifeStages: {
                en: {
                    early: "A kind and idealistic youth, dreaming of a better world.",
                    mid: "A giving period of service and compassion.",
                    later: "A fulfilling phase, leaving a legacy of kindness."
                },
                si: {
                    early: "කරුණාව ඇති හා ඉහළ බලාපොරොත්තු තබන තරුණ වියක්. මෙහිදී ඔබ හොඳ ලෝකයක් ගැන හිතනවා.",
                    mid: "දෙන හා කරුණාවෙන් යුතු සේවා කරන කාලයක්. ඔබ මෙහිදී අන් අයට උදව් කරනවා.",
                    later: "කරුණාවේ උරුමයක් තබන සම්පූර්ණ කාලයක්. ඔබේ හොඳ බව මෙහිදී අන් අයට ලැබෙනවා."
                }
            },
            details: {
                en: {
                    education: "You shine in humanitarian or creative pursuits.",
                    love: "You seek a soulful, meaningful connection in love.",
                    marriage: "Marriage thrives on shared ideals and generosity.",
                    relationships: "You inspire and uplift everyone around you.",
                    character: "Altruistic, visionary, and empathetic.",
                    anger: "When angry, you may become preachy or distant.",
                    challenges: "Setting boundaries and avoiding burnout."
                },
                si: {
                    education: "මිනිසුන්ට උදව් කරන හෝ නිර්මාණශීලී දේවල්වල ඔබ දිලිසෙනවා. ඔබට මේවා තුළින් ලොකු දෙයක් කරන්න පුළුවන්.",
                    love: "ආදරයේදී ඔබට ආත්මික, අර්ථවත් එකතුවක් ඕනෑ. එය ඔබේ හදවතට ගැඹුරක් දෙනවා.",
                    marriage: "එකට ඉහළ බලාපොරොත්තු හා දෙන ගුණයෙන් විවාහය සතුටු වෙනවා. එකිනෙකාට උදව් කිරීම මෙහිදී වැදගත්.",
                    relationships: "ඔබ ඔබ ලඟ ඉන්න හැමෝටම ආනුභාවය හා උසස් බව දෙනවා. ඔබේ කරුණාව එහිදී පේනවා.",
                    character: "අන්‍යයන්ට උදව් කරන, ඉදිරි දකින, හැඟීම් දන්නා. මේ ගති ඔබව හොඳ කෙනෙක් කරනවා.",
                    anger: "කෝපයට පත් වුණාම ඔබ උපදෙස් දෙනවා හෝ ඈත් වෙනවා. එය ඔබේ ගැඹුරු හිතුවිලි පෙන්වනවා.",
                    challenges: "සීමා තබන එක හා වෙහෙසෙන එක වළකන එක. ඔබට තමන් ගැනත් හිතන්න ඕනෑ."
                },
                characterDetails: {
                    en: {
                        description: "As a Humanitarian, you’re a beacon of hope, tirelessly working to improve the world with your selfless spirit."
                    },
                    si: {
                        description: "මිනිසුන්ට ආදරය කරන්නෙක් විදියට ඔබ බලාපොරොත්තුවේ ආලෝකයක්. තමන් නොතකා ලෝකය හොඳ කරන්න ඔබ වෙහෙසෙනවා."
                    }
                }
            }
        }
    };

    const result = traitsMap[avgNumber] || traitsMap[1];
    return {
        traits: {
            en: result.traits.en,
            si: result.traits.si,
            lifeStages: result.lifeStages,
            details: result.details
        },
        characterType: {
            en: result.characterType.en,
            si: result.characterType.si,
            details: result.details.characterDetails
        }
    };
}