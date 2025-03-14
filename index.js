require('@marko/compiler/register');
const express = require('express');
const path = require('path');
const fs = require('fs');
const markoMiddleware = require('@marko/express').default;
const markoTemplate = require('./src/components/Body/index.marko').default;
const lasso = require('lasso');

const app = express();
const PORT = 3000;

// Lasso-Konfiguration für Asset-Bundling
lasso.configure({
    outputDir: path.join(__dirname, "public/static"),
    urlPrefix: "/static",
    fingerprintsEnabled: false,
    bundlingEnabled: true,
    minify: true,
    require: {
        transforms: [
            {
                transform: "lasso-marko",
                config: {}
            }
        ]
    }
});

// Logging aller Anfragen
app.use((req, res, next) => {
    console.log(`Anfrage: ${req.method} ${req.url}`);
    next();
});

// Statische Dateien bereitstellen
app.use("/static", express.static(path.join(__dirname, "public/static")));
app.use("/styles", express.static(path.join(__dirname, "src/components")));
app.use("/scripts", express.static(path.join(__dirname, "src/components"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    }
}));

console.log("Statische Dateien bereitgestellt:");
console.log("/static → 'public/static/'");
console.log("/styles → 'src/components/'");
console.log("/scripts → 'src/components/'");

app.use(markoMiddleware());

// API zum Laden der Kanban-Daten (statt `fs` in `.marko`)
app.get('/api/get-kanban-data', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'src/components/Columns/data.json');
        if (!fs.existsSync(dataPath)) {
            console.warn("WARNUNG: Daten-Datei nicht gefunden, erstelle eine leere Datei.");
            fs.writeFileSync(dataPath, JSON.stringify({ columns: [], filters: [] }, null, 2));
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json(data);
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        res.status(500).json({ error: "Fehler beim Laden der Kanban-Daten." });
    }
});

// Route für die Hauptseite (Fehlerbehandlung verbessert)
app.get('/', (req, res) => {
    try {
        console.log("Marko-Template wird gerendert...");

        if (typeof markoTemplate.render !== 'function') {
            throw new Error("`render` ist keine Funktion. Ist die Marko-Datei korrekt importiert?");
        }

        markoTemplate.render({}, (err, output) => {
            if (err) {
                console.error("Fehler beim Rendern:", err);
                if (!res.headersSent) {
                    return res.status(500).send("Render-Fehler: " + err.message);
                }
                return;
            }
            res.send(output.toString());
        });

    } catch (error) {
        console.error("Fehler beim Rendern des Marko-Templates:", error);
        if (!res.headersSent) {
            res.status(500).send("Fehler: " + error.message);
        }
    }
});

// API: Ticket aktualisieren
app.post('/update-ticket', express.json(), (req, res) => {
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
app.post('/save-columns', express.json(), (req, res) => {
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