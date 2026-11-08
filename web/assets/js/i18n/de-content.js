// Deutsche Inhalte (Karten, Zeichen, Tierkreistiere, Beispieltexte …).
// Wird nur geladen, wenn Deutsch gewählt ist. Gleiche Schlüssel wie die vietnamesischen Daten.

const MAJOR = [
  ["Der Narr", "Anfänge, Freiheit, Vertrauen in den Weg", "Leichtsinn, Angst vor dem Anfangen", "Es gibt einen Schritt, den du nur aufschiebst, weil du Angst hast, naiv zu wirken.", "Wenn niemand zusähe – was würdest du als Erstes ausprobieren?"],
  ["Der Magier", "Können, Initiative, Ideen Wirklichkeit werden lassen", "Zerstreutheit, Zweifel an den eigenen Fähigkeiten", "Du hältst mehr in deinen Händen, als du denkst.", "Nenne drei Dinge, die du hast, aber noch nicht genutzt hast."],
  ["Die Hohepriesterin", "Intuition, Stille, das Verborgene", "die innere Stimme überhören", "Manchmal wartet die Antwort schon in der Stille.", "Wenn aller Lärm verstummte – was würdest du dich wünschen hören?"],
  ["Die Herrscherin", "Fürsorge, Fülle, Kreativität", "zu viel geben, sich selbst vergessen", "Du sorgst so gut für andere. Und für dich?", "Welche kleine Sache könnte dich heute nähren?"],
  ["Der Herrscher", "Struktur, Grenzen, Stabilität", "Starrheit, zu viel Kontrolle", "Halt wächst aus klaren Grenzen.", "Wozu musst du „Nein“ sagen, um dich zu schützen?"],
  ["Der Hierophant", "Tradition, Führung, Glaube", "Konventionen brechen, der eigene Weg", "Manche Lehren derer, die vor uns gingen, verdienen Gehör.", "Welchen Rat, den du einmal bekommen hast, verstehst du erst jetzt wirklich?"],
  ["Die Liebenden", "Entscheidungen des Herzens, Verbindung, Werte", "Ungleichgewicht, aus Angst wählen", "Jede Wahl ist ein Moment der Ehrlichkeit mit dir selbst.", "Wählst du aus Liebe oder aus Angst?"],
  ["Der Wagen", "Wille, Entschlossenheit, vorankommen", "die Richtung verlieren, in viele Richtungen gezogen", "Du wirst gerade in viele Richtungen zugleich gezogen.", "Wenn du diesen Monat nur eine Richtung behieltest – welche wäre es?"],
  ["Die Kraft", "Sanftheit, Mut, Geduld", "Selbstvorwürfe, wenig Selbstvertrauen", "Wahre Kraft ist Sanftheit gegenüber dem Schweren.", "Welcher Teil von dir braucht Trost statt Kritik?"],
  ["Der Eremit", "Besinnung, Alleinsein, innere Suche", "Isolation, Ausweichen", "Allein sein ist nicht Einsamkeit, sondern sich selbst wiederfinden.", "Wann hast du es zuletzt genossen, mit dir allein zu sein?"],
  ["Das Rad des Schicksals", "Zyklen, Wandel, der rechte Zeitpunkt", "sich gegen Veränderung stemmen", "Alles dreht sich, das Schwere wie das Gute.", "Was schien einmal für immer und ist doch vergangen?"],
  ["Die Gerechtigkeit", "Fairness, Wahrheit, Verantwortung", "zu streng mit dir selbst", "Bist du mit dir strenger als mit anderen?", "Wenn deine beste Freundin an deiner Stelle wäre – was würdest du ihr sagen?"],
  ["Der Gehängte", "Innehalten, Hingabe, ein neuer Blickwinkel", "Verzögerung, festgefahren sein", "Anhalten ist nicht verlieren.", "Wenn du das von der anderen Seite ansähest – was würdest du sehen?"],
  ["Wandlung", "Enden, die Anfänge möglich machen, Erneuerung", "am Alten festhalten", "Etwas ist bereit, abgeschlossen zu werden. Das ist kein schlechtes Omen, sondern eine Tür.", "Was bist du bereit, gehen zu lassen?"],
  ["Die Mäßigkeit", "Gleichgewicht, Harmonie, das rechte Maß", "Übermaß, Ungleichgewicht", "Nicht zu viel, nicht zu wenig.", "Wovon hast du zu viel, wovon zu wenig?"],
  ["Der Teufel", "Bindungen, Gewohnheiten, Versuchung", "sich befreien, die Ketten erkennen", "Manche Ketten legen wir uns selbst an.", "Welche Gewohnheit raubt dir Energie?"],
  ["Der Turm", "plötzlicher Umbruch, Erwachen", "Angst vor dem Zusammenbruch, der Wahrheit ausweichen", "Manches fällt, damit sich der Himmel öffnet.", "Was hast du aus einem früheren Zusammenbruch gelernt?"],
  ["Der Stern", "Hoffnung, Heilung, Frieden", "Vertrauensverlust, Müdigkeit", "Nach dem Sturm gibt es immer einen Stern.", "Welche Kleinigkeit gibt dir heute Hoffnung?"],
  ["Der Mond", "Ungewissheit, Intuition, verborgene Ängste", "Klarheit kehrt zurück, die Täuschung durchschauen", "Nicht jede Dunkelheit ist echt.", "Welche deiner Sorgen sind real, welche nur vorgestellt?"],
  ["Die Sonne", "Freude, Klarheit, Lebenskraft", "Freude, die kurz verdeckt ist", "Du darfst ohne Grund glücklich sein.", "Was bringt das Kind in dir zum Lächeln?"],
  ["Das Gericht", "Erwachen, ein Ruf, Vergebung", "Selbstverurteilung, Zweifel", "Es gibt einen Ruf, den du schon lange hörst.", "Wer zu werden schiebst du auf?"],
  ["Die Welt", "Ganzheit, Vollendung, Integration", "noch nicht abgeschlossen, ein fehlendes Stück", "Du hast einen langen Weg zurückgelegt.", "Nenne etwas, das du erreicht hast und von dem nur wenige wissen."],
];

const SUITS = {
  gay: { name: "Stäbe", element: "Feuer", domain: "Leidenschaft, Handeln und Inspiration" },
  coc: { name: "Kelche", element: "Wasser", domain: "Gefühle, Liebe und Beziehungen" },
  kiem: { name: "Schwerter", element: "Luft", domain: "Gedanken, Worte und Wahrheit" },
  tien: { name: "Münzen", element: "Erde", domain: "Arbeit, Geld und den Körper" },
};

// [Rang, Stufe, Frage] — {d} = erster Bereich der Farbe
const RANKS = [
  ["Ass", "der Same", "Welcher Same der {d} wartet darauf, dass du ihn pflanzt?"],
  ["Zwei", "Wahl und Gleichgewicht", "Welche zwei Dinge rund um {d} wägst du gerade ab?"],
  ["Drei", "Wachstum", "Was wächst in dir in Sachen {d}?"],
  ["Vier", "Stabilität", "Was rund um {d} musst du halten, und was lockern?"],
  ["Fünf", "Herausforderung", "Welche Herausforderung rund um {d} lehrt dich gerade etwas?"],
  ["Sechs", "Erholung und Harmonie", "Was in Sachen {d} heilt langsam?"],
  ["Sieben", "Besinnung und Bilanz", "Wenn du auf {d} zurückblickst – worauf bist du stolz?"],
  ["Acht", "Bewegung", "Wohin bist du mit {d} unterwegs?"],
  ["Neun", "fast am Ziel", "Was brauchst du noch für das letzte Stück in Sachen {d}?"],
  ["Zehn", "ein Zyklus schließt sich", "Welcher Zyklus rund um {d} schließt sich?"],
  ["Bube", "der Lernende", "Was möchtest du über {d} lernen?"],
  ["Ritter", "der Handelnde", "Wie bist du bereit, für {d} zu handeln?"],
  ["Königin", "die Nährende", "Wie könntest du {d} nähren?"],
  ["König", "der Meister", "Wie sähe es für dich aus, {d} zu meistern?"],
];

const MINOR_KEYS = {
  gay: [
    ["Inspiration, Neubeginn, Potenzial", "Verzögerung, wenig Antrieb"],
    ["Planung, Vision, Entscheidungen", "Angst vor Veränderung, Zögern"],
    ["Ausdehnung, in die Ferne blicken, auf Ergebnisse warten", "Verzögerungen, Hindernisse"],
    ["Feier, Zuhause, Harmonie", "Unbeständigkeit, eine Übergangszeit"],
    ["Wettbewerb, kleine Reibereien", "Konflikte meiden, innere Anspannung"],
    ["Sieg, Anerkennung", "Selbstzweifel, Sehnsucht, gesehen zu werden"],
    ["standhaft bleiben, für Überzeugungen eintreten", "Erschöpfung, aufgeben wollen"],
    ["Tempo, Nachrichten, alles in Bewegung", "abbremsen, Eile am falschen Ort"],
    ["Widerstandskraft, ein letzter Kraftakt", "Müdigkeit, zu viel Abwehr"],
    ["Last, zu viel tragen", "etwas ablegen, um Hilfe bitten"],
    ["Neugier, Entdeckung, neue Ideen", "fehlende Richtung, Unruhe"],
    ["Begeisterung, Abenteuer, Wagemut", "Impulsivität, Hast"],
    ["Selbstvertrauen, Wärme, Entschlossenheit", "wenig Selbstvertrauen, Vergleichen"],
    ["Führung, Vision, andere inspirieren", "Dominanz, zu hohe Erwartungen"],
  ],
  coc: [
    ["neue Gefühle, überfließende Emotion", "Gefühle zurückhalten"],
    ["Verbindung, Einklang, Partnerschaft", "Ungleichgewicht in einer Beziehung"],
    ["Freundschaft, Feiern, Gemeinschaft", "Abstand zu Freunden, Übermaß"],
    ["Teilnahmslosigkeit, Besinnung, Langeweile", "eine neue Gelegenheit bemerken"],
    ["Verlust, Bedauern", "Annahme, weitergehen"],
    ["Nostalgie, Kindheit, Unschuld", "in der Vergangenheit verharren"],
    ["viele Möglichkeiten, Tagträume", "klar sehen, sich trauen zu wählen"],
    ["aufbrechen, um tieferen Sinn zu suchen", "Angst vor dem Aufbruch, Zögern"],
    ["Zufriedenheit, ein erfüllter Wunsch", "oberflächliche Zufriedenheit"],
    ["Familienglück, Erfüllung", "Entfremdung, unpassende Erwartungen"],
    ["Feinfühligkeit, Kreativität, eine liebevolle Botschaft", "emotionale Unreife"],
    ["Romantik, Idealen folgen", "Illusion, Launenhaftigkeit"],
    ["Mitgefühl, Intuition, Zuhören", "sich für andere verlieren"],
    ["emotionales Gleichgewicht, Großzügigkeit", "Verdrängung, schwer sich zu öffnen"],
  ],
  kiem: [
    ["Klarheit, Wahrheit, Durchbruch", "Verwirrung, Missverständnis"],
    ["Patt, eine schwere Wahl", "Informationsflut"],
    ["Herzschmerz, Verletzung", "Heilung, Vergebung"],
    ["Ruhe, Erholung", "Erschöpfung, jetzt anhalten müssen"],
    ["Konflikt, gewinnen und verlieren", "Versöhnung, das Ego beiseitelegen"],
    ["Übergang, raue Gewässer hinter sich lassen", "noch verstrickt"],
    ["Strategie, Geheimnisse wahren", "Geständnis, auf das Gewissen hören"],
    ["Selbstbegrenzung, sich gefangen fühlen", "Befreiung, den Ausweg sehen"],
    ["Angst, Schlaflosigkeit, Grübeln", "durch die Angst hindurchgehen"],
    ["Tiefpunkt, ein schmerzhaftes Ende", "Neubeginn, es geht nur noch aufwärts"],
    ["Neugier, Beobachtung, Lernlust", "reden, bevor man denkt"],
    ["entschlossen, schlagfertig", "voreilig, verletzende Worte"],
    ["klar, unabhängig, ehrlich", "kühl, verschlossen"],
    ["Vernunft, Fairness, Transparenz", "bevormundend, starr"],
  ],
  tien: [
    ["neue Chance, ein solider Anfang", "verpasste Chance, nicht ganz vorbereitet"],
    ["jonglieren, vieles ausbalancieren", "Überlastung, Durcheinander"],
    ["Zusammenarbeit, Handwerk, Teamarbeit", "mangelnde Abstimmung"],
    ["bewahren, Sicherheit, sparen", "festklammern, Verlustangst"],
    ["Not, Mangel, sich ausgeschlossen fühlen", "Erholung, Hilfe finden"],
    ["Geben und Nehmen, Großzügigkeit", "Abhängigkeit, ungleiches Geben"],
    ["Geduld, auf die Ernte warten", "Ungeduld, an der eigenen Mühe zweifeln"],
    ["Übung, Fleiß, Liebe zum Detail", "Perfektionismus, Eintönigkeit"],
    ["Eigenständigkeit, Fülle, sich selbst belohnen", "Abhängigkeit, Überarbeitung"],
    ["Familie, Erbe, Beständiges", "finanzielle Unsicherheit"],
    ["Lernen, neue Ziele", "mangelnde Konzentration"],
    ["beständig, verlässlich, ausdauernd", "Stillstand, starre Routine"],
    ["fürsorglich, praktisch, gemütlich", "zu viele Sorgen"],
    ["Wohlstand, Stabilität, Umsicht", "dem Materiellen nachjagen"],
  ],
};

// Fragen mit „der {d}“ brauchen den Genitiv des ersten Bereichs
const GENITIVE = { gay: "Leidenschaft", coc: "Gefühle", kiem: "Gedanken", tien: "Arbeit" };
const card = {};
MAJOR.forEach(([name, up, rev, msg, q], i) => (card[`major-${String(i).padStart(2, '0')}`] = { name, up, rev, msg, q }));
for (const [suitId, s] of Object.entries(SUITS)) {
  RANKS.forEach(([rank, stage, qTpl], r) => {
    const [up, rev] = MINOR_KEYS[suitId][r];
    card[`${suitId}-${String(r + 1).padStart(2, '0')}`] = {
      name: `${rank} der ${s.name}`,
      up,
      rev,
      msg: `Diese Karte spricht von ${s.domain}, in der Stufe „${stage}“. Element: ${s.element}.`,
      q: qTpl.replace('{d}', GENITIVE[suitId]),
    };
  });
}

const sign = {
  'bach-duong': { name: "Widder", keywords: "mutig, direkt, leidenschaftlich", light: "Du traust dich anzufangen, während andere noch überlegen. Deine Energie reißt die ganze Gruppe mit.", shadow: "Ungeduldig, schnell entflammt und schnell abgekühlt, Warten fällt schwer.", heal: "Wenn ihn etwas verletzt, stürzt sich der Widder oft in Aktivität, um zu vergessen. Gönn dir eine Pause. Stillstehen ist nicht verlieren.", element: "Feuer", modality: "Kardinal", ruler: "Mars" },
  'kim-nguu': { name: "Stier", keywords: "beständig, verlässlich, liebt das Schöne", light: "Du bist ein fester Anker. Du genießt die einfachen Dinge: gutes Essen, eine warme Decke, Musik.", shadow: "Stur, veränderungsscheu, hält an Sicherheit fest.", heal: "Der Stier heilt über den Körper: langsam essen, genug schlafen, die Natur berühren. Veränderung darf langsam kommen – Hauptsache, sie kommt.", element: "Erde", modality: "Fix", ruler: "Venus" },
  'song-tu': { name: "Zwillinge", keywords: "neugierig, beweglich, kommunikativ", light: "Ein flinker Geist, der alles wissen will und mit allen gut auskommt.", shadow: "Zerstreut, schnell gelangweilt, denkt mehr, als er fühlt.", heal: "Zwillinge müssen schreiben. Wenn es in deinem Kopf laut wird, bring es zu Papier. Du musst heute nicht jede Frage beantworten.", element: "Luft", modality: "Veränderlich", ruler: "Merkur" },
  'cu-giai': { name: "Krebs", keywords: "beschützend, gefühlvoll, hingebungsvoll", light: "Du bist für viele Menschen ein „Zuhause“. Starke Intuition, langes Gedächtnis, tiefe Liebe.", shadow: "Empfindlich, zieht sich schnell in den Panzer zurück, hängt an der Vergangenheit.", heal: "Der Krebs sorgt zuerst für andere. Sei heute ein Zuhause für dich selbst: Koch dir etwas, ruf daheim an.", element: "Wasser", modality: "Kardinal", ruler: "Mond" },
  'su-tu': { name: "Löwe", keywords: "strahlend, großzügig, kreativ", light: "Du strahlst ganz natürlich. Ein großes, treues Herz, bei dem sich andere gesehen fühlen.", shadow: "Braucht Anerkennung, stolz, zeigt ungern Verletzlichkeit.", heal: "Der Wert des Löwen liegt nicht im Applaus. Du bist wertvoll, auch an Tagen, an denen es niemand bemerkt.", element: "Feuer", modality: "Fix", ruler: "Sonne" },
  'xu-nu': { name: "Jungfrau", keywords: "gewissenhaft, aufmerksam, hilfsbereit", light: "Du bemerkst Details, die andere übersehen, und machst still alles ein bisschen besser.", shadow: "Perfektionistisch, selbstkritisch, sorgt sich um Kleinigkeiten.", heal: "Liebe Jungfrau, „gut genug“ ist gut. Schreib drei Dinge auf, die du heute geschafft hast, bevor du an das Übrige denkst.", element: "Erde", modality: "Veränderlich", ruler: "Merkur" },
  'thien-binh': { name: "Waage", keywords: "harmonisch, anmutig, gerecht", light: "Du hast ein Auge für Schönheit, hörst beide Seiten und bringst Menschen zusammen.", shadow: "Unentschlossen, will gefallen, fürchtet Konflikte.", heal: "Waage, leg auch dich selbst in die Waagschale. Einmal „Nein“ zu sagen, bringt die Welt nicht ins Kippen.", element: "Luft", modality: "Kardinal", ruler: "Venus" },
  'bo-cap': { name: "Skorpion", keywords: "tief, intensiv, loyal", light: "Du siehst unter die Oberfläche. Wenn du vertraust, dann ganz, und du gehst den Weg bis zum Ende.", shadow: "Misstrauisch, verschlossen, lässt alte Wunden nur langsam los.", heal: "Der Skorpion ist am stärksten, wenn er sich traut, weich zu werden. Vergeben heißt nicht vergessen, sondern es nicht mehr tragen müssen.", element: "Wasser", modality: "Fix", ruler: "Pluto · Mars" },
  'nhan-ma': { name: "Schütze", keywords: "frei, optimistisch, abenteuerlustig", light: "Du bringst Lachen und Weitblick. Du liebst Lernen, Reisen und die großen Fragen.", shadow: "Bindungsscheu, zu direkt, bringt Dinge schwer zu Ende.", heal: "Nicht jede Traurigkeit lässt sich mit einer Reise abhängen. Manchmal ist die längste Reise, still bei dir zu bleiben.", element: "Feuer", modality: "Veränderlich", ruler: "Jupiter" },
  'ma-ket': { name: "Steinbock", keywords: "diszipliniert, verantwortungsvoll, ausdauernd", light: "Du steigst Schritt für Schritt und gibst selten auf. Man vertraut dir schwierige Dinge an.", shadow: "Streng, arbeitet zu viel, hält Ruhe für Faulheit.", heal: "Steinbock, Ruhe gehört zum Aufstieg. Du musst dir das Recht auf Ruhe nicht erst verdienen.", element: "Erde", modality: "Kardinal", ruler: "Saturn" },
  'bao-binh': { name: "Wassermann", keywords: "unabhängig, originell, menschenfreundlich", light: "Du denkst deiner Zeit voraus, dir liegt die Gemeinschaft am Herzen, und anders zu sein stört dich nicht.", shadow: "Emotional distanziert, eigensinnig, schwer nahbar.", heal: "Der Wassermann liebt die ganze Welt, vergisst aber, sich selbst zu lieben. Lass einen Menschen ein Stück näher kommen.", element: "Luft", modality: "Fix", ruler: "Uranus · Saturn" },
  'song-ngu': { name: "Fische", keywords: "verträumt, einfühlsam, fantasievoll", light: "Du spürst den Schmerz anderer und verwandelst Gefühl in Kunst.", shadow: "Flucht in Träume, schwache Grenzen, trägt die Traurigkeit anderer.", heal: "Fische brauchen Grenzen wie Fische klares Wasser. Nicht jede Traurigkeit, die du spürst, ist deine.", element: "Wasser", modality: "Veränderlich", ruler: "Neptun · Jupiter" },
};

// Vietnamesischer Tierkreis: Sửu ist der Wasserbüffel, Mão die Katze (nicht der Hase wie in China).
const chi = {
  'ty-chuot': { animal: "Ratte", traits: "flink, findig, sparsam, scharfsinnig", shadow: "sorgt sich im Voraus, rechnet manchmal zu viel", heal: "Die Ratte denkt zehn Schritte voraus. Denk heute nur an einen: den nächsten, sanften Schritt." },
  'suu-trau': { animal: "Büffel", traits: "fleißig, geduldig, verlässlich, beständig", shadow: "trägt alles allein, gibt Müdigkeit selten zu", heal: "Auch dem Büffel muss man das Joch abnehmen. Du darfst müde sein – und es sagen." },
  'dan-ho': { animal: "Tiger", traits: "mutig, stark, prinzipientreu, beschützt Schwächere", shadow: "aufbrausend, mag nicht kontrolliert werden", heal: "Ein Tiger ist nicht dann am stärksten, wenn er brüllt, sondern wenn er ruht, um Kraft zu sammeln. Gönn dir eine Weile Stille." },
  'mao-meo': { animal: "Katze", traits: "fein, sanft, taktvoll, friedliebend", shadow: "meidet Konflikte, leicht verletzlich", heal: "Katzen wissen, wo ein warmer Sonnenfleck ist. Du auch: Such dir heute einen sicheren Ort." },
  'thin-rong': { animal: "Drache", traits: "selbstbewusst, energiegeladen, ehrgeizig", shadow: "erwartet zu viel von sich", heal: "Drachen müssen nicht jeden Tag fliegen. An manchen Tagen reicht es, sich unter den Wolken einzurollen und zu atmen." },
  'ty-ran': { animal: "Schlange", traits: "tief, weise, intuitiv, diskret", shadow: "verbirgt Gefühle, vertraut nur langsam", heal: "Schlangen häuten sich, um zu wachsen. Welche alte Haut bist du bereit, zurückzulassen?" },
  'ngo-ngua': { animal: "Pferd", traits: "freiheitsliebend, begeistert, unabhängig, lebhaft", shadow: "ungeduldig, schnell gelangweilt", heal: "Pferde laufen am besten, nachdem sie getrunken und geruht haben. Vergiss nicht, an der Station anzuhalten." },
  'mui-de': { animal: "Ziege", traits: "gütig, künstlerisch, mitfühlend", shadow: "ängstlich, auf Zustimmung angewiesen", heal: "Deine Sanftheit ist eine Gabe, keine Schwäche. Heb ein wenig davon für dich selbst auf." },
  'than-khi': { animal: "Affe", traits: "klug, witzig, kreativ, anpassungsfähig", shadow: "versteckt Traurigkeit hinter Lachen", heal: "Du musst nicht immer diejenige oder derjenige sein, der alle zum Lachen bringt. Du darfst vor jemandem traurig sein." },
  'dau-ga': { animal: "Hahn", traits: "fleißig, offen, ordentlich, pünktlich", shadow: "perfektionistisch, Offenheit kann verletzen", heal: "Der Hahn kräht jeden Morgen pünktlich. Aber heute darfst du ein bisschen länger schlafen." },
  'tuat-cho': { animal: "Hund", traits: "treu, aufrichtig, hingebungsvoll, beschützend", shadow: "sorgt sich um andere, bis er sich selbst vergisst", heal: "Du hältst immer Wache für andere. Lass heute jemanden für dich Wache halten." },
  'hoi-lon': { animal: "Schwein", traits: "sanft, großzügig, aufrichtig, genießt das Leben", shadow: "gutgläubig, kann schwer Nein sagen", heal: "Deine Güte braucht einen Zaun. Eine Bitte abzulehnen, macht dich nicht weniger gütig." },
};

const napAm = {
  'Hải Trung Kim': { meaning: "Gold im Meer" }, 'Lư Trung Hỏa': { meaning: "Feuer im Ofen" }, 'Đại Lâm Mộc': { meaning: "Holz des großen Waldes" },
  'Lộ Bàng Thổ': { meaning: "Erde am Wegesrand" }, 'Kiếm Phong Kim': { meaning: "Gold der Schwertschneide" }, 'Sơn Đầu Hỏa': { meaning: "Feuer auf dem Berggipfel" },
  'Giản Hạ Thủy': { meaning: "Wasser in der Schlucht" }, 'Thành Đầu Thổ': { meaning: "Erde auf der Stadtmauer" }, 'Bạch Lạp Kim': { meaning: "Gold des Kerzenleuchters" },
  'Dương Liễu Mộc': { meaning: "Weidenholz" }, 'Tuyền Trung Thủy': { meaning: "Quellwasser" }, 'Ốc Thượng Thổ': { meaning: "Erde auf dem Dach" },
  'Tích Lịch Hỏa': { meaning: "Blitzfeuer" }, 'Tùng Bách Mộc': { meaning: "Kiefern- und Zypressenholz" }, 'Trường Lưu Thủy': { meaning: "Langes, fließendes Wasser" },
  'Sa Trung Kim': { meaning: "Gold im Sand" }, 'Sơn Hạ Hỏa': { meaning: "Feuer am Fuß des Berges" }, 'Bình Địa Mộc': { meaning: "Holz der Ebene" },
  'Bích Thượng Thổ': { meaning: "Erde an der Wand" }, 'Kim Bạch Kim': { meaning: "Gold mit Silber vermischt" }, 'Phú Đăng Hỏa': { meaning: "Lampenflamme" },
  'Thiên Hà Thủy': { meaning: "Himmelswasser" }, 'Đại Trạch Thổ': { meaning: "Erde des großen Sumpfes" }, 'Thoa Xuyến Kim': { meaning: "Schmuckgold" },
  'Tang Đố Mộc': { meaning: "Maulbeerholz" }, 'Đại Khê Thủy': { meaning: "Wasser des großen Baches" }, 'Sa Trung Thổ': { meaning: "Sandige Erde" },
  'Thiên Thượng Hỏa': { meaning: "Feuer am Himmel" }, 'Thạch Lựu Mộc': { meaning: "Granatapfelholz" }, 'Đại Hải Thủy': { meaning: "Wasser des großen Ozeans" },
};

const hanh = {
  'Kim': { name: "Metall", tone: "Weiß, Grau, Silber", trait: "Entschieden, prinzipientreu, klar" },
  'Mộc': { name: "Holz", tone: "Grün", trait: "Wachsend, gütig, sich ausdehnend" },
  'Thủy': { name: "Wasser", tone: "Schwarz, Blau", trait: "Beweglich, tief, weise" },
  'Hỏa': { name: "Feuer", tone: "Rot, Rosa, Violett", trait: "Leidenschaftlich, kreativ, strahlend" },
  'Thổ': { name: "Erde", tone: "Gelb, Erdbraun", trait: "Geerdet, tolerant, verlässlich" },
};

const element = {
  'Lửa': { name: "Feuer", desc: "Handeln, Leidenschaft, Begeisterung" },
  'Đất': { name: "Erde", desc: "Praktisch, ausdauernd, beständig" },
  'Khí': { name: "Luft", desc: "Denken, Kommunikation, Verbindung" },
  'Nước': { name: "Wasser", desc: "Gefühl, Intuition, Mitgefühl" },
};

const post = {
  'hd-001': { title: "Den Stern gezogen nach dem schlimmsten Monat meines Jahres", body: "Letzten Monat habe ich meinen Job verloren, mich getrennt und war krank. Gestern Abend habe ich zum Spaß eine Karte gezogen – es war Der Stern.\nIch glaube nicht, dass eine Karte etwas ändern kann. Aber als ich die Frau sah, die unter dem Sternenhimmel Wasser ausgießt, fühlte ich mich, als dürfte ich kurz ausruhen, als dürfte ich glauben, dass alles heilt, wenn auch langsam.", author: "Jemand in Hanoi" },
  'hd-002': { title: "Die „Tod“-Karte ist kein schlechtes Omen", body: "Viele geraten in Panik, wenn sie die XIII ziehen. Eigentlich spricht sie von Wandlung: Etwas endet, damit etwas anderes beginnen kann. Wie der Herbst, der die Blätter fallen lässt, damit der Baum wieder austreiben kann.\nWenn du sie ziehst, frag dich: „Was in meinem Leben ist abgelaufen, und ich halte es trotzdem fest?“", author: "Legt seit 6 Jahren Karten" },
  'hd-003': { title: "Als Steinbock lerne ich, mich auszuruhen", body: "Mein ganzes Leben dachte ich, Ruhe sei eine Belohnung, die man sich verdient, wenn alles erledigt ist. Aber die To-do-Liste endet nie.\nDieses Jahr habe ich angefangen, Ruhe so einzuplanen wie Meetings. Seltsamerweise arbeite ich besser. An jeden Steinbock, der das liest: Du musst dir das Recht auf Ruhe nicht verdienen.", author: "Steinbock, 31" },
  'hd-004': { title: "Büffeljahr und nie sagen „Ich bin müde“", body: "Meine Mutter sagt, Menschen aus dem Büffeljahr seien dazu bestimmt, hart zu arbeiten. Ich glaube nicht an Schicksal, aber ich gebe zu, dass ich zu viel auf mich nehme.\nNeulich habe ich etwas ausprobiert: mindestens einmal pro Woche um Hilfe bitten. Beim ersten Mal war es mir peinlich. Beim dritten Mal fühlte ich mich so viel leichter. Das „harte Arbeiten“ kam zum Teil daher, dass ich nie jemanden helfen ließ.", author: "Jemand aus einem Büffeljahr" },
  'hd-005': { title: "", body: "An dich, der du dich einsam fühlst: Der Eremit im Tarot steigt allein auf den Berg, eine Laterne in der Hand. Er ist nicht einsam. Er findet den Weg zurück zu sich selbst.\nWenn du heute allein bist, sieh es als einen Weg auf den Berg.", author: "Ein fremder Mensch" },
  'hd-006': { title: "Merkur rückläufig ist keine Ausrede", body: "Bei jedem rückläufigen Merkur geben die sozialen Medien ihm an allem die Schuld: Streit, verlorene Dinge, verpasste Termine.\nIch mag eine andere Sicht: Es ist eine Erinnerung, langsamer zu werden, Nachrichten vor dem Senden noch einmal zu lesen, Pläne zu überprüfen. Astrologie ist am besten, wenn sie uns hilft, langsamer zu leben – nicht, wenn sie uns Angst macht.", author: "Ein Wassermann, der Sternkarten liebt" },
  'hd-007': { title: "Was ist ein Nạp-âm-Element? Eine Einführung", body: "Jedes Mondjahr hat einen Himmelsstamm und einen Erdzweig, etwa Bính Ngọ. Die 60 Kombinationen bilden 30 Paare, jedes mit einem „Nạp-âm“-Element wie Himmelswasser oder Feuer im Ofen.\nSo nutzten die Alten Bilder aus der Natur, um den Charakter zu beschreiben. Wie ein Gedicht gelesen, ist es viel schöner als wie ein Urteil.", author: "Die Person, die den Kalender schreibt" },
  'hd-008': { title: "Dreimal hintereinander die Drei der Schwerter – was bedeutet das?", body: "Ich habe nach der Liebe gefragt und diese Woche dreimal die Drei der Schwerter gezogen (ein Herz, von drei Schwertern durchbohrt). Ist das jemandem schon passiert?\nIch weiß, dass ich traurig bin. Vielleicht sagt die Karte nur laut, was ich mir noch nicht eingestehen mochte.", author: "Jemand, der traurig ist" },
  'hd-009': { title: "", body: "An die Person, die dreimal die Drei der Schwerter gezogen hat: Die Karte sagt nicht, dass du für immer leiden wirst. Sie sagt, dass der Schmerz echt ist und geweint werden will.\nWenn du bereit bist, zieh noch eine Karte und frag: „Was brauche ich, um zu heilen?“ Ändere die Frage, und die Karte ändert sich auch.", author: "Jemand, der auch die Drei der Schwerter zog" },
  'hd-010': { title: "Ein Krebs fern von zu Hause", body: "In meinem vierten Jahr in Saigon vermisse ich mein Zuhause noch bei jeder Mahlzeit. Als ich über den Krebs las, verstand ich, warum: Für ein Wasserzeichen, das vom Mond beherrscht wird, ist „Zuhause“ keine Adresse, sondern ein Gefühl der Zugehörigkeit.\nJetzt mache ich mir in meinem Mietzimmer ein „Zuhause“: jeden Sonntag einen Topf saure Suppe, einen Topf Basilikum am Fenster.", author: "Ein Krebs in Saigon" },
  'hd-011': { title: "Bringt das eigene Tierkreisjahr wirklich Pech?", body: "Nächstes Jahr ist mein Tierkreisjahr, und die ganze Familie sagt, ich soll vorsichtig sein. Ich mache mir ein bisschen Sorgen. Wie war euer eigenes Tierkreisjahr?", author: "Jemand kurz vor dem eigenen Tierkreisjahr" },
  'hd-012': { title: "", body: "In meinem Tierkreisjahr habe ich den Job gewechselt, bin umgezogen und habe meinen jetzigen Partner kennengelernt. Es gab große Veränderungen, aber Veränderungen sind nicht immer schlecht.\nIch glaube, wenn die Älteren „sei vorsichtig“ sagen, meinen sie: Lebe achtsamer – nicht: Lebe in Angst.", author: "Jemand, der es schon erlebt hat" },
  'hd-013': { title: "Vier der Kelche: Wenn sich alles flach anfühlt", body: "Die Vier der Kelche zeigt einen Menschen unter einem Baum, die Arme verschränkt, den Blick auf drei Kelche – ohne die Hand zu bemerken, die ihm einen vierten reicht.\nEs ist die Karte der Tage, an denen alles fade schmeckt. Sie macht dir keinen Vorwurf. Sie erinnert dich nur: Wenn du bereit bist aufzublicken, wartet etwas Neues.", author: "Legt seit 6 Jahren Karten" },
  'hd-014': { title: "", body: "An meine Fische-Geschwister: Nicht jede Traurigkeit, die ihr spürt, ist eure. Ihr saugt die Gefühle anderer auf wie ein Schwamm.\nNimm heute Abend eine warme Dusche und stell dir vor, wie das Wasser die Gefühle fortspült, die nicht zu dir gehören.", author: "Noch ein Fisch" },
  'hd-015': { title: "Ein „Zwei Wege“-Legesystem, als ich über eine Kündigung nachdachte", body: "Ich legte drei Karten: Bleiben ergab Den Gehängten, Gehen die Sieben der Münzen, und was mein Herz weiß, Die Sonne.\nIch las es so: Bleiben heißt, in der Schwebe zu hängen; Gehen braucht Geduld bis zur Ernte; und mein Herz will fröhlich leben. Die Karten haben nicht für mich entschieden, aber sie haben mir geholfen auszusprechen, was ich schon wusste.", author: "Büroangestellte, 28" },
  'hd-016': { title: "Sonne, Mond, Aszendent: Was ist der Unterschied?", body: "Dein Sonnenzeichen (das, das du meistens nennst) ist dein Wesenskern. Dein Mondzeichen ist deine innere Gefühlswelt – wie du geliebt werden möchtest. Dein Aszendent ist der erste Eindruck, den andere von dir bekommen.\nWenn du das Gefühl hast, „deinem Zeichen gar nicht so ähnlich“ zu sein, sprechen vielleicht dein Mond oder dein Aszendent.", author: "Ein Wassermann, der Sternkarten liebt" },
  'hd-017': { title: "Vietnam hat die Katze, China den Hasen", body: "Etwas, das ich liebe: Im vietnamesischen Tierkreis ist Mão die Katze, nicht der Hase.\nMenschen aus dem Katzenjahr gelten als fein, friedliebend und wissen, wo ein warmer Sonnenfleck ist. Genau das habe ich heute gemacht: eine sonnige Ecke gefunden und ein Buch gelesen.", author: "Geboren in einem Quý-Mão-Jahr" },
  'hd-018': { title: "", body: "Die Karte Die Kraft zeigt keinen Krieger. Sie zeigt eine Frau, die sanft das Maul eines Löwen schließt.\nWenn du heute mit dir selbst ringst, versuch es mit Sanftheit. Wahre Kraft ist Sanftheit, die nicht aufgibt.", author: "Ein fremder Mensch in Huế" },
  'hd-019': { title: "Fällt es Skorpionen wirklich schwer zu vergeben?", body: "Ich bin Skorpion, und das trifft mich schmerzhaft genau. Wenn mich jemand verletzt, erinnere ich mich lange daran. Hat ein Skorpion gelernt loszulassen? Bitte erzählt.", author: "Ein November-Skorpion" },
  'hd-020': { title: "", body: "An den Skorpion, der gefragt hat: Ich habe drei Jahre gebraucht, um zu verstehen, dass Vergeben weder Zurückgehen noch Vergessen bedeutet.\nVergeben heißt, die Last abzulegen, weil du es verdienst, leichter zu gehen. Du kannst vergeben und trotzdem die Tür schließen.", author: "Ein Skorpion, der das kennt" },
  'hd-021': { title: "Mit 30 habe ich Den Narren gezogen", body: "Ich wollte mit 30 noch einmal studieren, und alle sagten, es sei zu spät. An dem Tag zog ich Den Narren: jemand, der sorglos am Rand einer Klippe geht, ein kleiner Hund trabt hinterher.\nIch habe mich entschieden, es als „Geh einfach, ein bisschen närrisch sein ist in Ordnung“ zu lesen. Jetzt bin ich im zweiten Studienjahr, die Älteste im Kurs – und die Glücklichste.", author: "Eine Studentin, fast 30" },
  'hd-022': { title: "Harmonische Trios und die vier Gegenüber: nicht dazu da, Menschen zu trennen", body: "Die harmonischen Trios (etwa Affe, Ratte, Drache) und die vier Gegenüber (etwa Ratte, Pferd, Katze, Hahn) sind die Art, wie die Alten die 12 Tiere in passende und „spannungsvolle“ Gruppen einteilten.\nIch sehe viele, die sie benutzen, um Liebe zu verbieten. Ich mag diese Sicht lieber: „Spannung“ bedeutet zwei verschiedene Blickwinkel, die mehr Zuhören brauchen. Kein Paar ist zum Scheitern geboren.", author: "Die Person, die den Kalender schreibt" },
  'hd-023': { title: "Vier der Schwerter: die Karte, die dich ausruhen lässt", body: "Ein Ritter liegt still in einer Kapelle, drei Schwerter an der Wand, eines unter ihm. Es ist die Karte der Erholung.\nWenn du sie ziehst, sagt dir das Universum (oder du selbst): Heute musst du nicht kämpfen. Schlaf.", author: "Legt seit 6 Jahren Karten" },
  'hd-024': { title: "Jungfrau und die „Erledigt“-Liste", body: "Ich schreibe immer To-do-Listen und mache mir dann Vorwürfe, wenn ich sie nicht schaffe. Eine Fische-Freundin schlug vor, auch eine Liste „Was ich heute getan habe“ zu schreiben.\nAls ich sie nach einer Woche wieder las, hätte ich fast geweint: Ich hatte so viel geschafft.", author: "Eine perfektionistische Jungfrau" },
};

const topic = { 'tarot': { label: "Tarot" }, 'chiem-tinh': { label: "Astrologie" }, 'tu-vi': { label: "Tử Vi" } };
const type = {
  'trai-bai': { label: "Legung" }, 'giai-nghia': { label: "Bedeutung" }, 'chia-se': { label: "Erfahrung" }, 'hoi-dap': { label: "Frage" }, 'loi-nhan': { label: "Gruß" },
};
const spread = {
  'mot-la': { name: "Eine Karte für heute", positions: ["Eine Botschaft für dich"] },
  'ba-la': { name: "Vergangenheit · Gegenwart · Zukunft", positions: ["Was vergangen ist", "Was ist", "Was kommen mag"] },
  'chua-lanh': { name: "Heilungs-Legung", positions: ["Was dir wehtut", "Was du loslassen kannst", "Was dich nährt"] },
  'lua-chon': { name: "Zwei Wege", positions: ["Wenn du A wählst", "Wenn du B wählst", "Was dein Herz weiß"] },
  'celtic-cross': {
    name: "Keltisches Kreuz (10 Karten)",
    positions: ["Deine Gegenwart", "Was dich herausfordert", "Das tiefe Fundament", "Was vergeht", "Wonach du strebst", "Was näher kommt", "Wie du dich siehst", "Dein Umfeld", "Hoffnungen und Ängste", "Wohin sich die Energie öffnet"],
  },
};
const hotline = {
  '115': { name: "Medizinischer Notruf (Vietnam)", note: "Bei unmittelbarer Lebensgefahr" },
  '096 306 1414': { name: "Ngày-Mai-Hotline (Vietnam)", note: "Seelische Unterstützung für Menschen in Krisen" },
  '111': { name: "Nationale Kinderschutz-Hotline (Vietnam)", note: "Für alle unter 18" },
  'findahelpline': { name: "Find A Helpline", note: "Kostenlose Hilfetelefone in über 130 Ländern (Deutschland: TelefonSeelsorge 0800 111 0 111)" },
};

export default { card, suit: SUITS, sign, chi, napAm, hanh, element, post, topic, type, spread, hotline };
