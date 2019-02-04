const Queue = require("bull");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const queue = new Queue("test", { redis: { port: 6379, host: "127.0.0.1" } });

const add = (id, priority, delay = 50) =>
  queue.add({ id }, { jobId: id, delay, priority, removeOnComplete: true });

queue.process(async function(job, done) {
  await delay(100);
  console.log(job.data.id);
  await done();
  await delay(10);
  add(job.data.id, job.opts.priority, job.opts.delay);
});

async function start() {
  await add("aaa", 1);
  await add("bbb", 1);
  await add("ccc", 1, 5000);
  await delay(300);
  const job = await queue.getJob("ccc");
  job.promote();
}

start();
