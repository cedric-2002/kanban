require('@marko/compiler/register'); 
const express = require('express');
const compressionMiddleware = require('compression');
const path = require('path');
const fs = require('fs');
const markoMiddleware = require('@marko/express').default;
const markoTemplate = require('./src/components/Body/index.marko').default;

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`Anfrage: ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(compressionMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/src/components')));
app.use('/components', express.static(path.join(__dirname, 'src/components')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, "public")));
app.use("/styles", express.static(path.join(__dirname, "src/components")));
app.use(markoMiddleware());

// Funktion zum Laden der Kanban-Daten
function getKanbanData() {
    const dataPath = path.join(__dirname, 'src/components/Columns/data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("⚠️ WARNUNG: Daten-Datei nicht gefunden, erstelle eine leere Datei.");
        fs.writeFileSync(dataPath, JSON.stringify({ columns: [], filters: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

// Route für die Hauptseite
app.get('/', (req, res) => {
    try {
        console.log("Marko-Template wird gerendert...");
        console.log("Template:", markoTemplate);

        if (typeof markoTemplate.render !== 'function') {
            throw new Error("`render` ist keine Funktion. Ist die Marko-Datei korrekt importiert?");
        }

        markoTemplate.render({}, (err, output) => {
            if (err) {
                console.error("Fehler beim Rendern:", err);
                return res.status(500).send("Render-Fehler: " + err.message);
            }
        });

    } catch (error) {
        console.error("Fehler beim Rendern des Marko-Templates:", error);
        res.status(500).send("Fehler: " + error.message);
    }
});

// API: Ticket aktualisieren
app.post('/update-ticket', (req, res) => {
    const { ticketId, newColumnId, newBoard, newFilters } = req.body;
    const ticketsPath = path.join(__dirname, 'src/components/Tickets/tickets.json');

    if (!fs.existsSync(ticketsPath)) {
        return res.status(404).json({ success: false, message: "Tickets-Datei nicht gefunden!" });
    }

    let ticketsData = JSON.parse(fs.readFileSync(ticketsPath, 'utf8'));
    const ticket = ticketsData.Ticket.find(t => t.TicketID == ticketId);

    if (ticket) {
        ticket.KanbanColumnID = newColumnId;
        ticket.Board = newBoard;
        ticket.Filters = newFilters;
        fs.writeFileSync(ticketsPath, JSON.stringify(ticketsData, null, 2));
        return res.status(200).json({ success: true });
    } else {
        return res.status(404).json({ success: false });
    }
});

// API: Spalten speichern
app.post('/save-columns', (req, res) => {
    const { columns, filters } = req.body;
    const jsonPath = path.join(__dirname, 'src/components/Columns/data.json');

    try {
        fs.writeFileSync(jsonPath, JSON.stringify({ columns, filters }, null, 2), 'utf8');
        res.json({ success: true });
    } catch (error) {
        console.error("Fehler beim Speichern der Datei:", error);
        res.status(500).json({ success: false });
    }
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf: http://localhost:${PORT}`);
});