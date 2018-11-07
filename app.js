const filterCalendarGroup = require('./calendarFilter');
const calendars = require('./settings');
const express = require('express');
const app = express();
const port = 3000

for (let calendar of calendars) {
  app.get('/' + calendar[0], (req, res) => {
    res.set('Content-Type', 'application/ical');
    filterCalendarGroup(calendar).then((ical) => {
      res.send(ical);
    });
  });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
