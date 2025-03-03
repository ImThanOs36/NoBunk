export default {
	async scheduled(event, env, ctx) {
	  // This runs on cron trigger
	  console.log(`Worker ran at: ${new Date().toISOString()}`);
	  console.log(`Cron pattern: ${event.cron}`);

		  // You can also access environment variable
	},
  
	async fetch(request, env) {
	  // This runs on HTTP requests
	  
	  return new Response("Hello from Cron Worker!");
	}
  };