// src/index.js
import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { execSync } from "child_process";
import os from 'os';
import fs from 'fs';


dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Code Runner. <br/>Available routes: <br/>/stub: gets the stub <br/>/run: runs student code and returns result of test");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/stub", (req: Request, res: Response) => {
  const filePath = 'exercises/1/submissionstub.mjs';
  res.download(filePath);
});

app.post("/run", (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    if (!code || code === "" || code === undefined || code === null) {
      res.status(400).send("No code provided");
      return;
    }

    // first, build the base docker image. This contains node and the exercise code
    const cwd = process.cwd();
    execSync(`cd ${cwd}/exercises/1 && docker build -t ex1-base -f init.Dockerfile .`, { stdio: 'inherit' });

    // next, take the code from the student, and create a new container from that
    const randomID = "ex1_studentcontainer" + Math.floor(Math.random() * 1000000);
    const tmpdir = os.tmpdir() + '/' + randomID;
    console.log(tmpdir);

    // Build the student code
    fs.mkdirSync(tmpdir);
    fs.copyFileSync(`${cwd}/exercises/1/student.Dockerfile`, `${tmpdir}/student.Dockerfile`);
    fs.writeFileSync(`${tmpdir}/submission.mjs`, code as string);
    execSync(`cd ${tmpdir} && docker build -t ${randomID} -f student.Dockerfile .`, { stdio: 'inherit' });

    let failed = false;
    let result = "";
    // Run the student code
    try {
      result = execSync(`DOCKER_CLI_HINTS=false docker run --rm ${randomID}`).toString(); // TODO: timeout
    } catch (e) {
      failed = true;
      result = (e as any).toString();
    }

    console.log(result);
    console.log(result.includes("fail") || result.includes("failed") || result.includes("error"));

    // Clean up the student code
    const images = execSync(`docker images -q ${randomID}`).toString().split("\n").filter((x: string) => x !== "");
    for (const image of images) {
      execSync(`docker rmi ${image}`);
    }

    // Send result
    if (!failed && !(result.includes("fail") || result.includes("failed") || result.includes("error"))) {
      res.send("Test passed!");
    } else {
      res.send("Test failed" + result);
    }
  } catch (e) {
    res.status(500).send("An error occurred: " + e);
  }
});
