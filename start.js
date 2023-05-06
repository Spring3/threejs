import inquirer from 'inquirer';
import Rx from 'rxjs';
import fs from 'fs/promises';
import path from 'path';
import process from 'node:child_process';

const Subjects = {
  Chapter: 'chapter',
  Lesson: 'lesson'
};

let targetFolder = '';

const getDirectoriesInFolder = async ({ folder, matching }) => {
  const entities = await fs.readdir(folder, { withFileTypes: true });
  const matchingDirectories = entities.filter((entity) => entity.isDirectory() && entity.name.includes(matching));
  return matchingDirectories.map((dir) => dir.name);
}

const prompts = new Rx.Subject();

inquirer.prompt(prompts).ui.process.subscribe(async ({ name, answer }) => {
  switch (name) {
    case Subjects.Chapter: {
      const chapter = answer;
      const chapterDirPath = path.join('./', chapter);
      targetFolder = chapter;
      const lessons = await getDirectoriesInFolder({ folder: chapterDirPath, matching: 'lesson' })

      prompts.next({
        type: 'list',
        name: Subjects.Lesson,
        message: 'Select the lesson',
        default: lessons[0],
        choices: lessons
      });
      break;
    }
    case Subjects.Lesson: {
      const lesson = answer;
      const lessonDirPath = path.join(targetFolder, lesson);
      const viteServerProcess = process.exec(`yarn dev "${lessonDirPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return;
        }
      });

      viteServerProcess.stdout.on('data', (chunk) => {
        console.log(chunk);
      })
      prompts.complete();
      break;
    }
  }
});

const chapters = await getDirectoriesInFolder({ folder: './', matching: 'Chapter' });

prompts.next({
  type: 'list',
  name: Subjects.Chapter,
  message: 'Select the chapter',
  default: chapters[0],
  choices: chapters,
});
