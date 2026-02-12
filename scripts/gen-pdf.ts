import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { resolve } from 'path';
import { mkdir } from 'fs/promises';

const PORT = 4321;
const OUTPUT_DIR = resolve(process.cwd(), 'public');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'cv.pdf');

async function startServer(): Promise<() => void> {
  console.log('Starting Astro preview server...');
  
  const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
    stdio: 'pipe',
    shell: true,
  });

  return new Promise((resolve, reject) => {
    let started = false;

    server.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Local') || output.includes(`${PORT}`)) {
        if (!started) {
          started = true;
          console.log('Server started successfully');
          resolve(() => {
            console.log('Stopping server...');
            server.kill();
          });
        }
      }
    });

    server.stderr?.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        reject(new Error('Server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

async function generatePDF() {
  let stopServer: (() => void) | null = null;
  let browser = null;

  try {
    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Start the server
    stopServer = await startServer();

    // Wait for server to be fully ready and stabilized
    const SERVER_STABILIZATION_DELAY = 2000;
    await new Promise((resolve) => setTimeout(resolve, SERVER_STABILIZATION_DELAY));

    console.log('Launching browser...');
    browser = await chromium.launch();
    const page = await browser.newPage();

    console.log(`Navigating to http://localhost:${PORT}/cv/`);
    await page.goto(`http://localhost:${PORT}/cv/`, {
      waitUntil: 'networkidle',
    });

    console.log('Generating PDF...');
    await page.pdf({
      path: OUTPUT_FILE,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    });

    console.log(`PDF generated successfully: ${OUTPUT_FILE}`);

    await browser.close();
    browser = null;
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (stopServer) {
      stopServer();
    }
    process.exit(1);
  } finally {
    console.log('Stopping server...');
    if (stopServer) {
      stopServer();
    }
    // Close browser if still open
    if (browser) {
      await browser.close().catch(() => {});
    }
    // Force exit to prevent the process from hanging
    // waiting for open connections or other resources
    process.exit(0);
  }
}

generatePDF();
