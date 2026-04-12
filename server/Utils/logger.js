import fs from "fs";
import path from "path";
import cron from "node-cron";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = path.join(__dirname, "../.server.log");

// Helper to get timestamp
const getTimestamp = () => new Date().toISOString();

// Middleware to log requests and responses
export const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;

    // Capture response details
    res.on("finish", () => {
        const duration = Date.now() - start;
        const timestamp = getTimestamp();
        const statusCode = res.statusCode;
        const logEntry = `[${timestamp}] ${ip} | ${method} ${url} | Status: ${statusCode} | Duration: ${duration}ms\n`;
        
        // Always log to terminal (useful for both dev and prod log captures)
        const color = statusCode >= 400 ? "\x1b[31m" : "\x1b[32m"; // Red for errors, Green for success
        const reset = "\x1b[0m";
        console.log(`[${timestamp}] ${method} ${url} | ${color}${statusCode}${reset} | ${duration}ms`);

        fs.appendFile(LOG_FILE, logEntry, (err) => {
            if (err) console.error("Error writing to log file:", err);
        });
    });

    next();
};

// Cron Job: Refresh (delete and recreate) logs every 5 days
// Expression: 0 0 */5 * * (At 00:00 on every 5th day of the month)
cron.schedule("0 0 */5 * *", () => {
    console.log(`[${getTimestamp()}] Refreshing log file...`);
    fs.writeFile(LOG_FILE, `--- Log Refreshed on ${getTimestamp()} ---\n`, (err) => {
        if (err) console.error("Error refreshing log file:", err);
    });
});

// Ensure file exists on start
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, `--- Server Log Started on ${getTimestamp()} ---\n`);
}
