const ICAL = require('ical.js');
const GET_DATA = require('./getData');

function filterEventCondition(vevent, filters) {
  ret = false;
  if (!filters) return true;
  if (filters.filter) {
    for (row of vevent[1]) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] == 'text') {
          if (filters.filter.test(row[i+1])) {
            ret = true;
          }
        }
      }
    }
  }
  return ret;
}

module.exports = async function filterCalendarGroup(calendarGroup) {
  if (calendarGroup.length <= 1) return '';

  let mainData = await GET_DATA(calendarGroup[1].url);
  let jcalMain = ICAL.parse(mainData);

  for (let i = jcalMain[2].length-1; i >= 0; i--) {
    if (!filterEventCondition(jcalMain[2][i], calendarGroup[1].filters)) {
      jcalMain[2].splice(i, 1);
    }
  }

  for (let i = 2; i < calendarGroup.length; i++) {
    let data = await GET_DATA(calendarGroup[i].url);
    let jcalData = ICAL.parse(data);

    for (let j = jcalData[2].length-1; j >= 0; j--) {
      if (filterEventCondition(jcalData[2][j], calendarGroup[i].filters)) {
        jcalMain[2].push(jcalData[2][j]);
      }
    }
  }

  return ICAL.stringify(jcalMain);
}
