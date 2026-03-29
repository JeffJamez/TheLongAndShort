import { run, step } from '.';
import { lintStep } from './lint';

run(
  'validate',

  lintStep,
  step('format', 'prettier --write --ignore-path .gitignore .'),
);
