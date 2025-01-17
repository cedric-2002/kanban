require('@marko/compiler/register'); 
const express = require('express');
const compressionMiddleware = require('compression');
const path = require('path');
const fs = require('fs');


const { default: markoMiddleware } = require('@marko/express');
const markoTemplate = require('./src/components/Body/index.marko').default;

const app = express();
const PORT = 3000;

app.use(compressionMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/components', express.static(path.join(__dirname, 'src/components')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'src/components')));


app.use(markoMiddleware());


function getKanbanData() {
    const dataPath = path.join(__dirname, 'src/components/Columns/data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("⚠️ WARNUNG: Daten-Datei nicht gefunden, erstelle eine leere Datei.");
        fs.writeFileSync(dataPath, JSON.stringify({ columns: [], filters: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

app.get('/', (req, res) => {
    try {
        const data = getKanbanData();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');


        markoTemplate.render(
            { boards: data.columns, notification: { type: 'info', message: 'Willkommen beim Kanban-Board!' } },
            res
        );
    } catch (error) {
        console.error("Fehler beim Rendern des Templates:", error);
        res.status(500).send("Internal Server Error");
    }
});


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


app.post('/save-columns', (req, res) => {
    const { columns, filters } = req.body;
    const jsonPath = path.join(__dirname, 'src/components/Columns/data.json');

    try {
        fs.writeFileSync(jsonPath, JSON.stringify({ columns, filters }, null, 2), 'utf8');
        res.json({ success: true });
    } catch (error) {
        console.error(" Fehler beim Speichern der Datei:", error);
        res.status(500).json({ success: false });
    }
});


app.listen(PORT, () => {
    console.log(` Server läuft auf: http://localhost:${PORT}`);
});