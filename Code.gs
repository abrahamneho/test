// ============================================================
//  INFOSYS INTERNSHIP FORM  –  Google Apps Script Backend
// ============================================================

const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Read data — sent as URLSearchParams with key "payload"
    let data;
    if (e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }

    const COLUMNS = [
      'submitted_at',
      'first_name', 'last_name', 'dob', 'gender', 'mobile', 'email', 'linkedin',
      'address', 'city', 'state', 'pin',
      'college', 'department', 'section', 'degree', 'year_sem', 'roll_no', 'grad_year',
      'cgpa', 'sslc', 'hsc',
      'skill',
      'has_exp',
      'pref_role', 'pref_location', 'relocate', 'join_date',
      'career_goal', 'why_infosys'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length)
        .setBackground('#003366')
        .setFontColor('white')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = COLUMNS.map(col => data[col] !== undefined ? data[col] : '');
    sheet.appendRow(row);
    sheet.autoResizeColumns(1, COLUMNS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === 'get') {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet || sheet.getLastRow() < 2) {
        return jsonResponse({ data: [] });
      }

      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]) : ''; });
        return obj;
      });

      return jsonResponse({ data: data.reverse() });
    } catch (err) {
      return jsonResponse({ data: [], error: err.message });
    }
  }

  return jsonResponse({ status: 'ok', message: 'Apps Script is running.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected to: ' + ss.getName());
  const sheet = ss.getSheetByName(SHEET_NAME);
  Logger.log('Sheet exists: ' + (sheet !== null));
}
