const mysql = require('mysql2/promise');

async function update() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sanjani2001',
        database: 'sumaga_lms',
        port: 3306
    });

    try {
        const query = `UPDATE subjects SET subjectName = REPLACE(REPLACE(subjectName, '-Grade', ' - Grade '), 'Grade ', 'Grade ') WHERE subjectName LIKE '%-Grade%';`;
        const [result] = await connection.execute(query);
        console.log('Updated ' + result.affectedRows + ' subject rows locally.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}
update();
