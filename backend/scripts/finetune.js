/**
 * Fine-tuning script for the e-learning platform quiz generator.
 *
 * Usage:
 *   node scripts/finetune.js           # upload dataset + start a new fine-tuning job
 *   node scripts/finetune.js --status  # check status of the most recently started job
 *
 * After the job completes, copy the model ID printed to stdout and add it to
 * your .env file as:  FINETUNED_MODEL_ID=ft:gpt-3.5-turbo-0125:...:<suffix>
 */

'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fs      = require('fs');
const path    = require('path');
const OpenAI  = require('openai');
const { quizzes, SYSTEM_PROMPT, USER_TEMPLATE } = require('../data/training_quizzes');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Build JSONL in-memory
// ─────────────────────────────────────────────────────────────────────────────
function buildJSONL() {
  return quizzes
    .map(({ topic, difficulty, quiz }) => {
      const record = {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: USER_TEMPLATE(topic, difficulty) },
          { role: 'assistant', content: JSON.stringify(quiz) },
        ],
      };
      return JSON.stringify(record);
    })
    .join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollJobUntilDone(jobId) {
  const INTERVALS = [10_000, 20_000, 30_000, 60_000]; // progressive back-off
  let attempt = 0;

  while (true) {
    const job = await client.fineTuning.jobs.retrieve(jobId);
    console.log(`[${new Date().toISOString()}] Status: ${job.status}`);

    if (job.status === 'succeeded') {
      console.log('\n✅ Fine-tuning succeeded!');
      console.log(`Fine-tuned model ID: ${job.fine_tuned_model}`);
      console.log('\nAdd this to your .env:\n');
      console.log(`FINETUNED_MODEL_ID=${job.fine_tuned_model}`);
      return job;
    }

    if (job.status === 'failed' || job.status === 'cancelled') {
      console.error(`\n❌ Fine-tuning job ${job.status}.`);
      if (job.error) console.error('Error:', job.error);
      process.exit(1);
    }

    const wait = INTERVALS[Math.min(attempt, INTERVALS.length - 1)];
    console.log(`   Waiting ${wait / 1000}s before next poll…`);
    await sleep(wait);
    attempt++;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check status of the latest job
// ─────────────────────────────────────────────────────────────────────────────
async function checkLatestJobStatus() {
  const jobs = await client.fineTuning.jobs.list({ limit: 1 });
  if (!jobs.data.length) {
    console.log('No fine-tuning jobs found.');
    return;
  }
  const job = jobs.data[0];
  console.log(`Job ID:    ${job.id}`);
  console.log(`Model:     ${job.model}`);
  console.log(`Status:    ${job.status}`);
  console.log(`Created:   ${new Date(job.created_at * 1000).toLocaleString()}`);
  if (job.fine_tuned_model) {
    console.log(`\n✅ Fine-tuned model: ${job.fine_tuned_model}`);
    console.log(`Add to .env:  FINETUNED_MODEL_ID=${job.fine_tuned_model}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main — upload JSONL + create fine-tuning job
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    await checkLatestJobStatus();
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌  OPENAI_API_KEY is not set in your .env file.');
    process.exit(1);
  }

  // 1. Write JSONL to a temp file (OpenAI SDK requires a readable stream / file path)
  const jsonl     = buildJSONL();
  const tmpPath   = path.resolve(__dirname, '../data/_finetune_upload.jsonl');
  fs.writeFileSync(tmpPath, jsonl, 'utf8');
  console.log(`✅ JSONL dataset written: ${quizzes.length} examples (${jsonl.split('\n').length} lines)`);

  // 2. Upload the file
  console.log('\nUploading training file to OpenAI…');
  const uploadedFile = await client.files.create({
    file:    fs.createReadStream(tmpPath),
    purpose: 'fine-tune',
  });
  console.log(`✅ File uploaded — ID: ${uploadedFile.id}`);

  // Optional: remove the temp file after upload
  fs.unlinkSync(tmpPath);

  // 3. Create the fine-tuning job
  console.log('\nCreating fine-tuning job…');
  const job = await client.fineTuning.jobs.create({
    model:        'gpt-3.5-turbo',
    training_file: uploadedFile.id,
    hyperparameters: {
      n_epochs: 3,          // Recommended baseline for small datasets
    },
    suffix: 'elearn-quiz',  // Results in ft:...:elearn-quiz:<hash>
  });

  console.log(`✅ Fine-tuning job created — ID: ${job.id}`);
  console.log(`   Model: ${job.model}`);
  console.log(`   Status: ${job.status}`);
  console.log('\nPolling for completion (this can take 15–60 minutes)…\n');

  await pollJobUntilDone(job.id);
}

main().catch((err) => {
  console.error('Fatal error:', err.message || err);
  process.exit(1);
});
