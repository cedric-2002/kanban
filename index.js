const express = require('express');
const compressionMiddleware = require('compression');
const path = require('path');
const fs = require('fs'); 

require('marko/node-require').install(); 
const markoTemplate = require('./src/components/Body/index.marko').default;

const app = express();
const PORT = 3000;

app.use(compressionMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/components/Columns/data.json'), 'utf8'));
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    markoTemplate.render(
      {
        boards: data.columns, 
        notification: { type: 'info', message: 'Willkommen auf deinem Kanban-Board!' }
      },
      res
    );
  } catch (error) {
    console.error("Error rendering template:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/update-ticket', (req, res) => {
  const { ticketId, newColumnId, newBoard, newFilters } = req.body;  // Hier wird auch newFilters übergeben

  const ticketsPath = path.join(__dirname, 'src/components/Tickets/tickets.json');
  const ticketsData = JSON.parse(fs.readFileSync(ticketsPath, 'utf8'));

  const ticket = ticketsData.Ticket.find(t => t.TicketID == ticketId);
  if (ticket) {
      ticket.KanbanColumnID = newColumnId;
      ticket.Board = newBoard;
      ticket.Filters = newFilters;  // Speichere die neuen Filter
      fs.writeFileSync(ticketsPath, JSON.stringify(ticketsData, null, 2));
      res.status(200).send({ success: true });
  } else {
      res.status(404).send({ success: false });
  }
});



function getColumnQueueID(columnId) {
    switch (columnId) {
        case 'nichtzugewiesen': return 1;
        case 'todo': return 2;
        case 'inprogress': return 3;
        case 'done': return 4;
        default: return 1;
    }
}

function saveDataToServer() {
  const dataToSave = {
      columns: boards.map(board => ({
          Board: board.Board, 
          columns: Object.keys(board.columns).reduce((acc, key) => {
              acc[key] = board.columns[key];
              return acc;
          }, {})
      })),
      filters: filters // Speichere auch die Filter
  };

  fetch('/save-columns', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          showCustomModal('success', 'Daten erfolgreich gespeichert.');
      } else {
          showCustomModal('error', 'Fehler beim Speichern der Daten.');
      }
  })
  .catch(error => console.error('Fehler beim Speichern:', error));
}


app.post('/save-columns', (req, res) => {
  const updatedColumns = req.body.columns;
  const updatedFilters = req.body.filters;

  fs.readFile(path.join(__dirname, 'src/components/Columns/data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return res.status(500).json({ success: false });
    }

    const jsonData = JSON.parse(data);
    jsonData.columns = updatedColumns;  // Spalten speichern
    jsonData.filters = updatedFilters;  // Filter speichern

    fs.writeFile(path.join(__dirname, 'src/components/Columns/data.json'), JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Fehler beim Speichern der Datei:', err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
