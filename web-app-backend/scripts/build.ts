import fs from "fs-extra";
import logger from "jet-logger";
import childProcess from "child_process";

/**
 * Start
 */
(async () => {
    try {
        logger.info("Starting build process...");

        // Remove current build
        logger.info("Removing old dist directory...");
        await remove("./dist/");

        // Run TypeScript compilation
        logger.info("Running TypeScript compiler...");
        await exec("tsc --build tsconfig.json", "./");

        // Copy public files (check if exists first)
        if (await fs.pathExists("./src/public")) {
            logger.info("Copying public files...");
            await copy("./src/public", "./dist/public");
        } else {
            logger.warn("./src/public directory not found, skipping...");
        }

        // Copy views (check if exists first)
        if (await fs.pathExists("./src/views")) {
            logger.info("Copying views...");
            await copy("./src/views", "./dist/views");
        } else {
            logger.warn("./src/views directory not found, skipping...");
        }

        // Copy database.json (check if exists first)
        if (await fs.pathExists("./src/repos/database.json")) {
            logger.info("Copying database.json...");
            await copy(
                "./src/repos/database.json",
                "./dist/repos/database.json"
            );
        } else {
            logger.warn("./src/repos/database.json not found, skipping...");
        }

        // Copy temp files ONLY if they exist
        if (await fs.pathExists("./temp/config.js")) {
            logger.info("Copying config.js from temp...");
            await copy("./temp/config.js", "./config.js");
        } else {
            logger.warn("./temp/config.js not found, skipping...");
        }

        if (await fs.pathExists("./temp/src")) {
            logger.info("Copying temp/src to dist...");
            await copy("./temp/src", "./dist");
        } else {
            logger.warn("./temp/src directory not found, skipping...");
        }

        // Clean up temp directory
        if (await fs.pathExists("./temp/")) {
            logger.info("Removing temp directory...");
            await remove("./temp/");
        }

        logger.info("Build completed successfully!");
    } catch (err) {
        logger.err("Build failed:", err);
        // eslint-disable-next-line n/no-process-exit
        process.exit(1);
    }
})();

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return !!err ? rej(err) : res();
        });
    });
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return !!err ? rej(err) : res();
        });
    });
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return !!err ? rej(err) : res();
        });
    });
}
